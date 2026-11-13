import dom from './dom';
import { removeAllHighlights } from './removeHighlightWrappers';

/**
 * Returns the HTML of the range's contents without highlight wrappers or screen reader labels.
 * Content saved with an XpathRangeSelector was built with one character past the end of a range inside a single
 * text node, so pass `includeCharacterAfterEnd` to compare against it.
 */
export const rangeContentsString = (range: Range, includeCharacterAfterEnd = false): string => {
  const fragment = cloneRangeContents(range, includeCharacterAfterEnd);
  const container = document.createElement('div');
  const removeAll = (nodes: NodeListOf<Element>) => nodes.forEach((element: Element) => element.remove());

  container.appendChild(fragment);

  // handle mml math nodes from mathjax 4
  const mjxContainers = container.querySelectorAll('mjx-container');
  mjxContainers.forEach((mjxContainer: Element) => {
    const mathTag = mjxContainer.querySelector('mjx-assistive-mml math');
    if (mathTag && mjxContainer.parentElement) {
      mjxContainer.parentElement.insertBefore(mathTag, mjxContainer);
    }
  });

  removeAll(container.querySelectorAll('.MathJax,mjx-container'));
  removeAll(container.querySelectorAll('.MathJax_Display'));
  removeAll(container.querySelectorAll('.MathJax_Preview'));
  removeAll(container.querySelectorAll('.MJX_Assistive_MathML'));
  removeAllHighlights(container);

  container.querySelectorAll('script[type="math/mml"]').forEach((element: Element) => {
    const template = document.createElement('template');
    template.innerHTML = element.textContent || '';
    const math = template.content.firstChild;

    if (math && element.parentElement) {
      element.parentElement.insertBefore(math, element);
      element.remove();
    }
  });

  return container.innerHTML;
};

export const cloneRangeContents = (range: Range, includeCharacterAfterEnd = false): DocumentFragment => {
  const tableTags = ['TR', 'TBODY', 'TABLE'];
  const fragment = document.createDocumentFragment();

  const getStartNode = () => {
    if (range.commonAncestorContainer.nodeType === 3 /* #text */) {
      return range.commonAncestorContainer.parentNode;
    } else if (tableTags.indexOf(range.commonAncestorContainer.nodeName) > -1) {
      return dom(range.commonAncestorContainer).closest('table').parentNode;
    } else {
      return range.commonAncestorContainer;
    }
  };

  cloneForRange(getStartNode(), range, includeCharacterAfterEnd).childNodes.forEach((node: Node) =>
    fragment.appendChild(node.cloneNode(true))
  );

  return fragment;
};

function cloneForRange(element: Node, range: Range, includeCharacterAfterEnd: boolean, foundStart: boolean = false) {
  const isStart = (node: Node) => node.parentElement === range.startContainer
    && Array.prototype.indexOf.call(range.startContainer.childNodes, node) === range.startOffset;
  const isEnd = (node: Node) => node.parentElement === range.endContainer
    && Array.prototype.indexOf.call(range.endContainer.childNodes, node) === range.endOffset;

  const result = element.cloneNode();

  if (element.nodeType === 3 /* #text */) {
    if (element === range.startContainer && element === range.endContainer) {
      const end = includeCharacterAfterEnd ? range.endOffset + 1 : range.endOffset;
      result.textContent = (element.textContent || '').substring(range.startOffset, end);
    } else if (element === range.startContainer) {
      result.textContent = (element.textContent || '').substring(range.startOffset);
    } else if (element === range.endContainer) {
      result.textContent = (element.textContent || '').substring(0, range.endOffset);
    } else {
      result.textContent = element.textContent;
    }
  } else {
    let node: Node | null = element.firstChild;
    let foundEnd;

    while (node && !isEnd(node) && !foundEnd) {
      foundStart = foundStart || isStart(node);
      foundEnd = dom(node).isParent(range.endContainer);

      if (foundStart && !foundEnd) {
        const copy = node.cloneNode(true);
        result.appendChild(copy);
      } else if (foundStart || dom(node).isParent(range.startContainer)) {
        const copy = cloneForRange(node, range, includeCharacterAfterEnd, foundStart);
        result.appendChild(copy);
        foundStart = true;
      }

      node = node.nextSibling;
    }
  }

  return result;
}
