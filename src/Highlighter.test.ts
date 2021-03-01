import * as lodash from 'lodash';
import Highlight from './Highlight';
import Highlighter from './Highlighter';
import * as injectHighlightWrappersUtils from './injectHighlightWrappers';
import * as rangeContents from './rangeContents';
import * as selection from './selection';

describe('Reference elements', () => {

  test('resolve', () => {
    document.body.innerHTML = `
      <div id="container">
        <div id="referenceElement1"></div>
        <div id="referenceElement2"></div>
        <div id="referenceElement3"></div>
      </div>
    `;

    const container = document.getElementById('container');
    const reference = document.getElementById('referenceElement2');

    if (!container) {
      throw new Error('cannot find container');
    }

    const highlighter = new Highlighter(container);

    expect(highlighter.getReferenceElement('referenceElement2')).toEqual(reference);
  });

  test('do not resolve outside the container', () => {
    document.body.innerHTML = `
      <div>
        <div id="referenceElement1"></div>
        <div id="container">
          <div id="referenceElement2"></div>
          <div id="referenceElement3"></div>
        </div>
      </div>
    `;

    const container = document.getElementById('container');

    if (!container) {
      throw new Error('can\'t find container');
    }

    const highlighter = new Highlighter(container);

    expect(highlighter.getReferenceElement('referenceElement1')).toEqual(null);
  });
});

describe('onClick', () => {
  test('handle clicks inside of the container', () => {
    const spyOnClick = jest.fn();

    const container = document.createElement('div');

    // tslint:disable-next-line no-unused-expression
    new Highlighter(container, {onClick: spyOnClick});

    const e = document.createEvent('MouseEvent');
    e.initEvent('click', true, true);
    container.dispatchEvent(e);

    expect(spyOnClick).toHaveBeenCalledWith(undefined, e);
  });

  test('handle clicks on the highlights', () => {
    const spyOnClick = jest.fn();
    const spyInjectHighlightWrappersUtils = jest.fn();

    const container = document.createElement('div');
    const highlightElement = document.createElement('span');
    highlightElement.setAttribute(injectHighlightWrappersUtils.DATA_ATTR, 'highlight');
    highlightElement.setAttribute(injectHighlightWrappersUtils.DATA_ID_ATTR, 'some-highlight');
    container.append(highlightElement);

    const highlight = new Highlight(new Range(), { id: 'some-highlight', content: 'asd' });

    jest.spyOn(injectHighlightWrappersUtils, 'default')
      .mockImplementation(spyInjectHighlightWrappersUtils);

    // tslint:disable-next-line no-unused-expression
    const highlighter = new Highlighter(container, {onClick: spyOnClick});

    highlighter.highlight(highlight);

    const e = document.createEvent('MouseEvent');
    e.initEvent('click', true, true);
    Object.defineProperty(e, 'target', {value: highlightElement});
    container.dispatchEvent(e);

    expect(spyInjectHighlightWrappersUtils).toHaveBeenCalledWith(highlight, expect.anything());
    expect(spyOnClick).toHaveBeenCalledWith(highlight, e);
  });

  test('does not handle clicks outside of the container', () => {
    const spyOnClick = jest.fn();

    const container = document.createElement('div');

    // tslint:disable-next-line no-unused-expression
    new Highlighter(container, {onClick: spyOnClick});

    const e = document.createEvent('MouseEvent');
    e.initEvent('click', true, true);
    document.dispatchEvent(e);

    expect(spyOnClick).not.toHaveBeenCalled();
  });
});

describe('onSelect', () => {
  let getSelectionSpy: jest.SpyInstance;
  let snapSelectionSpy: jest.SpyInstance;
  let rangeContentsStringSpy: jest.SpyInstance;

  jest.useFakeTimers();

  beforeEach(() => {
    getSelectionSpy = jest.spyOn(document, 'getSelection');
    snapSelectionSpy = jest.spyOn(selection, 'snapSelection');
    rangeContentsStringSpy = jest.spyOn(rangeContents, 'rangeContentsString');

    rangeContentsStringSpy.mockImplementation(() => '');
  });

  afterEach(() => {
    getSelectionSpy.mockRestore();
    snapSelectionSpy.mockRestore();
    rangeContentsStringSpy.mockRestore();
  });

  it('returns a highlight with the snapped range, even if document selection returns something completely different (looking at you safari)', () => {
    let highlight: Highlight | undefined;

    const container = document.createElement('div');
    const node = document.createElement('div');
    node.innerHTML = 'some text';

    container.appendChild(node);

    const spyDebounce = jest.spyOn(lodash, 'debounce')
      .mockImplementation((fn: any) => fn);

    // tslint:disable-next-line no-unused-expression
    new Highlighter(
      container,
      {onSelect: (_: Highlight[], newHighlight?: Highlight) => highlight = newHighlight}
    );

    expect(spyDebounce).toHaveBeenCalled();

    const inputSelection = new Selection();
    const selectionRange = new Range();
    const snappedRange = new Range();

    selectionRange.setStart(node, 0);
    selectionRange.setEnd(node, 5);

    selectionRange.setStart(node, 0);
    selectionRange.setEnd(node, 5);

    Object.defineProperty(inputSelection, 'isCollapsed', {value: false});
    Object.defineProperty(inputSelection, 'anchorNode', {value: node});
    Object.defineProperty(inputSelection, 'focusNode', {value: node});

    inputSelection.getRangeAt = jest.fn(() => selectionRange);
    snapSelectionSpy.mockImplementation(() => snappedRange);

    getSelectionSpy.mockImplementation(() => inputSelection);

    const e = document.createEvent('Event');
    e.initEvent('selectionchange', true, true);
    document.dispatchEvent(e);

    if (highlight === undefined) {
      expect(highlight).toBeDefined();
    } else {
      expect(highlight.range).not.toEqual(selectionRange);
      expect(highlight.range).toEqual(snappedRange);
    }
  });

  it('noops on selecitonchange event if there is no selection, selection is collapsed or selection type is None', () => {
    const spyOnSelect = jest.fn();

    const container = document.createElement('div');
    const node = document.createElement('div');

    container.appendChild(node);

    const spyDebounce = jest.spyOn(lodash, 'debounce')
      .mockImplementation((fn: any) => fn);

    // tslint:disable-next-line no-unused-expression
    new Highlighter(container, {onSelect: spyOnSelect});

    expect(spyDebounce).toHaveBeenCalled();

    getSelectionSpy.mockImplementation(() => null);

    const e = document.createEvent('Event');
    e.initEvent('selectionchange', true, true);
    document.dispatchEvent(e);

    expect(spyOnSelect).not.toHaveBeenCalled();

    getSelectionSpy.mockImplementation(() => ({ isCollapsed: true }));

    expect(spyOnSelect).not.toHaveBeenCalled();

    getSelectionSpy.mockImplementation(() => ({ isCollapsed: false, type: 'None' }));

    expect(spyOnSelect).not.toHaveBeenCalled();
  });

  it('noops on selecitonchange event if anchorNode or focusNode is not in the container', () => {
    const spyOnSelect = jest.fn();

    const container = document.createElement('div');
    const nodeInside = document.createElement('div');
    const nodeOutside = document.createElement('div');

    container.appendChild(nodeInside);

    const spyDebounce = jest.spyOn(lodash, 'debounce')
      .mockImplementation((fn: any) => fn);

    // tslint:disable-next-line no-unused-expression
    new Highlighter(container, {onSelect: spyOnSelect});

    expect(spyDebounce).toHaveBeenCalled();

    getSelectionSpy.mockImplementation(() => ({ isCollapsed: false, anchorNode: nodeOutside, focusNode: nodeInside }));

    const e = document.createEvent('Event');
    e.initEvent('selectionchange', true, true);
    document.dispatchEvent(e);

    expect(spyOnSelect).not.toHaveBeenCalled();

    getSelectionSpy.mockImplementation(() => ({ isCollapsed: false, anchorNode: nodeInside, focusNode: nodeOutside }));

    expect(spyOnSelect).not.toHaveBeenCalled();
  });
});
