import { getContentPath } from "./contentPath";
import Highlighter from "./Highlighter";
import Highlight from "./Highlight";
import { IData } from "./serializationStrategies/XpathRangeSelector";
import { adjacentTextSections } from "./injectHighlightWrappers.spec.data";

describe('getContentPath', () => {
  it('creates a path of indexes', () => {
    document.body.innerHTML = `<div id="page">${adjacentTextSections}</div>`;

    const container = document.getElementById('page')!;
    const element = document.getElementById('test-p')!;

    const highlighter = new Highlighter(container, { formatMessage: jest.fn() });
    const highlightData = { id: 'some-highlight', content: 'asd', style: 'yellow' };

    const range: any = {
      collapse: false,
      commonAncestorContainer: container,
      setEndAfter: jest.fn(),
      setStartBefore: jest.fn(),
      endContainer: element.childNodes[0],
      endOffset: 10,
      startContainer: element.childNodes[0],
      startOffset: 4,
    };

    const highlight = new Highlight(range, highlightData, { formatMessage: jest.fn() });

    const result = getContentPath(
      {
        referenceElementId: 'test-container',
        startContainer: "./*[name()='section'][1]/*[name()='div'][1]/*[name()='p'][1]/text()[1]"
      } as IData,
      highlighter,
      highlight
    );

    expect(result).toEqual([3, 1, 1, 0, 4]);
  });
});
