import SerializedHighlight from './SerializedHighlight';
import Highlighter from './Highlighter';
import * as xpath from './xpath';

describe('isLoadable', () => {
  let highlighter: Highlighter
    , serialized: SerializedHighlight
    , getReferenceElement: jest.MockInstance<Function>
    , getFirstByXPath: jest.MockInstance<Function>;

  beforeEach(() => {
    highlighter = new Highlighter(document.createElement('div'));
    serialized = new SerializedHighlight({
      referenceElementId: 'id',
      startContainer: 'start',
      endContainer: 'end',
      startOffset: 0,
      endOffset: 0,
      content: 'content'
    });

    getReferenceElement = jest.spyOn(highlighter, 'getReferenceElement');
    getFirstByXPath = jest.spyOn(xpath, 'getFirstByXPath');
  });

  afterEach(() => {
    getReferenceElement.mockRestore();
    getFirstByXPath.mockRestore();
  });

  test(`returns false if reference element can't be found`, () => {
    getReferenceElement.mockImplementation(() => null);
    getFirstByXPath.mockImplementation(() => document.createElement('div'));

    expect(serialized.isLoadable(highlighter)).toEqual(false);
  });

  test(`returns false if start container can't be found`, () => {
    getReferenceElement.mockImplementation(() => document.createElement('div'));
    getFirstByXPath.mockImplementation((path: string) => path === 'end' ? document.createElement('div') : null);

    expect(serialized.isLoadable(highlighter)).toEqual(false);
  });

  test(`returns false if end container can't be found`, () => {
    getReferenceElement.mockImplementation(() => document.createElement('div'));
    getFirstByXPath.mockImplementation((path: string) => path === 'start' ? document.createElement('div') : null);

    expect(serialized.isLoadable(highlighter)).toEqual(false);
  });

  test(`returns true if all nodes are found`, () => {
    getReferenceElement.mockImplementation(() => document.createElement('div'));
    getFirstByXPath.mockImplementation(() => document.createElement('div'));

    expect(serialized.isLoadable(highlighter)).toEqual(true);
  });
});

