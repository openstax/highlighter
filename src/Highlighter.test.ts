import Highlight from './Highlight';
import Highlighter from './Highlighter';
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

describe('onSelect', () => {
  let getSelectionSpy: jest.SpyInstance;
  let snapSelectionSpy: jest.SpyInstance;
  let rangeContentsStringSpy: jest.SpyInstance;

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

    const highlighter = new Highlighter(
      document.createElement('div'),
      {onSelect: (_: Highlight[], newHighlight?: Highlight) => highlight = newHighlight}
    );

    const inputSelection = new Selection();
    const selectionRange = new Range();
    const snappedRange = new Range();

    Object.defineProperty(inputSelection, 'isCollapsed', {value: false});

    inputSelection.getRangeAt = jest.fn(() => selectionRange);
    snapSelectionSpy.mockImplementation(() => snappedRange);

    getSelectionSpy.mockImplementation(() => inputSelection);

    const e = document.createEvent('MouseEvents');
    e.initEvent('mouseup', true, true);
    highlighter.container.dispatchEvent(e);

    if (highlight === undefined) {
      expect(highlight).toBeDefined();
    } else {
      expect(highlight.range).not.toEqual(selectionRange);
      expect(highlight.range).toEqual(snappedRange);
    }
  });
});
