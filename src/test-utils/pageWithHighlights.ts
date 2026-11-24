import Highlight from '../Highlight';
import Highlighter from '../Highlighter';

/**
 * Builds a paragraph that specs can draw search results and user highlights on, with the same screen reader labels
 * that REX uses.
 */
export const PAGE_TEXT = 'Each meter equals roughly three feet, a bit longer than an average step';

const userMessages: { [id: string]: string } = {
  'i18n:highlighter:highlight:end': 'End of yellow highlight',
  'i18n:highlighter:highlight:start': 'Start yellow highlight',
  'i18n:highlighter:highlight:start-selected': 'Start selected yellow highlight',
};
const searchMessages: { [id: string]: string } = {
  'i18n:highlighter:highlight:end': 'End of search result',
  'i18n:highlighter:highlight:start': 'Start search result',
};

export const USER_LABELS_LENGTH = userMessages['i18n:highlighter:highlight:start'].length
  + userMessages['i18n:highlighter:highlight:end'].length;

const getElement = (id: string): HTMLElement => {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`no element with id ${id}`);
  }
  return element;
};

const isInsideLabel = (node: Node) => !!node.parentElement && node.parentElement.hasAttribute('data-for-screenreaders');

const findTextNodes = (node: Node): Text[] => node.nodeType === Node.TEXT_NODE
  ? [node as Text]
  : Array.prototype.concat.apply([], Array.from(node.childNodes).map(findTextNodes));

/**
 * Returns the text node and offset where `text` starts, looking only at text a reader sees.
 */
export const findText = (reference: HTMLElement, text: string): [Text, number] => {
  const node = findTextNodes(reference).find((textNode) => !isInsideLabel(textNode) && textNode.data.includes(text));
  if (!node) {
    throw new Error(`no text node contains ${text}`);
  }
  return [node, node.data.indexOf(text)];
};

export const rangeOver = (reference: HTMLElement, text: string): Range => {
  const [node, offset] = findText(reference, text);
  const range = document.createRange();
  range.setStart(node, offset);
  range.setEnd(node, offset + text.length);
  return range;
};

export const createPage = () => {
  document.body.innerHTML = `<div id="highlighter"><p id="reference">${PAGE_TEXT}</p></div>`;
  const container = getElement('highlighter');
  const reference = getElement('reference');
  const highlighter = new Highlighter(container, { formatMessage: ({ id }) => userMessages[id] });
  const searchHighlighter = new Highlighter(container, {
    className: 'search-highlight',
    formatMessage: ({ id }) => searchMessages[id],
  });

  const draw = (onHighlighter: Highlighter, text: string, id: string) => {
    const highlightData = { content: text, id, style: 'yellow' };
    onHighlighter.highlight(new Highlight(rangeOver(reference, text), highlightData, onHighlighter.getHighlightOptions()));
  };

  return {
    drawSearchResult: (text: string) => draw(searchHighlighter, text, `search-${text}`),
    drawUserHighlight: (text: string) => draw(highlighter, text, `user-${text}`),
    highlighter,
    reference,
  };
};

export const expectSameRange = (actual: Range, expected: Range) => {
  expect(actual.startContainer).toBe(expected.startContainer);
  expect(actual.startOffset).toEqual(expected.startOffset);
  expect(actual.endContainer).toBe(expected.endContainer);
  expect(actual.endOffset).toEqual(expected.endOffset);
};
