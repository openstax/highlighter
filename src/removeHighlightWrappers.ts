// tslint:disable
import dom from './dom';
import Highlight from './Highlight';
import { DATA_ATTR_SELECTOR } from './injectHighlightWrappers';

const NODE_TYPE = {
  ELEMENT_NODE: 1,
  TEXT_NODE: 3,
};

/**
 * Removes highlights from element. If element is a highlight itself, it is removed as well.
 * If no element is given, all highlights all removed.
 * @param {HTMLElement} [element] - element to remove highlights from
 */
export function removeAllHighlights(element: HTMLElement, matchingFn?: (element: HTMLElement) => boolean) {
  getHighlights(element).forEach((element) => removeHighlightElement(element, matchingFn));
}

export default function(highlight: Highlight, matchingFn?: (element: HTMLElement) => boolean) {
  highlight.elements.forEach((element) => removeHighlightElement(element, matchingFn));
}

function removeHighlightElement(element: HTMLElement, matchingFn?: (element: HTMLElement) => boolean) {
  const container = element,
    highlights = getHighlights(container);

  const highlightsFromCurrentHighlighter = matchingFn
    ? highlights.filter(matchingFn)
    : highlights;

  function mergeSiblingNodes(node: HTMLElement | Text) {
    if (node.nodeType !== NODE_TYPE.TEXT_NODE) { return; }

    const prev = node.previousSibling,
      next = node.nextSibling;

    if (prev && prev.nodeType === NODE_TYPE.TEXT_NODE) {
      node.nodeValue = prev!.nodeValue + node.nodeValue!;
      dom(prev).remove();
    }
    if (next && next.nodeType === NODE_TYPE.TEXT_NODE) {
      node.nodeValue = node!.nodeValue + next.nodeValue!;
      dom(next).remove();
    }
  }

  function removeHighlight(highlight: HTMLElement) {
    const childNodes = dom(highlight).unwrap();

    childNodes.forEach(function(node: Text) {
      mergeSiblingNodes(node);
    });
  }

  sortByDepth(highlightsFromCurrentHighlighter, true);

  highlightsFromCurrentHighlighter.forEach(removeHighlight);
}

/**
 * Returns highlights from given container.
 * @param {HTMLElement} container - return highlights from this element
 * @returns {Array} - array of highlights.
 */
function getHighlights(container: HTMLElement): HTMLElement[] {
  const nodeList = container.querySelectorAll(DATA_ATTR_SELECTOR),
    highlights = Array.prototype.slice.call(nodeList);

  if (container.matches(DATA_ATTR_SELECTOR)) {
    highlights.push(container);
  }

  return highlights;
}

/**
 * Sorts array of DOM elements by its depth in DOM tree.
 * @param {HTMLElement[]} arr - array to sort.
 * @param {boolean} descending - order of sort.
 */
function sortByDepth(arr: HTMLElement[], descending: boolean) {
  arr.sort(function(a, b) {
    return dom(descending ? b : a).parents().length - dom(descending ? a : b).parents().length;
  });
}
