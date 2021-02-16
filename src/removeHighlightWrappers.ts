// tslint:disable
import dom from './dom';
import Highlight from './Highlight';
import { DATA_ATTR_SELECTOR, DATA_SCREEN_READERS_ATTR_SELECTOR } from './injectHighlightWrappers';

const NODE_TYPE = {
  ELEMENT_NODE: 1,
  TEXT_NODE: 3,
};

/**
 * Removes highlights from element. If element is a highlight itself, it is removed as well.
 * If no element is given, all highlights all removed.
 * @param {HTMLElement} [element] - element to remove highlights from
 */
export function removeAllHighlights(element: HTMLElement) {
  getHighlights(element).forEach(removeHighlightElement);
}

export default function(highlight: Highlight) {
  highlight.elements.forEach(removeHighlightElement);
}

function removeHighlightElement(element: HTMLElement) {
  getScreenReaderNodes(element).forEach((element) => element.remove());

  const container = element,
    highlights = getHighlights(container);

  function mergeSiblingTextNodes(textNode: Text) {
    const prev = textNode.previousSibling,
      next = textNode.nextSibling;

    if (prev && prev.nodeType === NODE_TYPE.TEXT_NODE) {
      textNode.nodeValue = prev!.nodeValue + textNode.nodeValue!;
      dom(prev).remove();
    }
    if (next && next.nodeType === NODE_TYPE.TEXT_NODE) {
      textNode.nodeValue = textNode!.nodeValue + next.nodeValue!;
      dom(next).remove();
    }
  }

  function removeHighlight(highlight: HTMLElement) {
    const textNodes = dom(highlight).unwrap();

    textNodes.forEach(function(node: Text) {
      mergeSiblingTextNodes(node);
    });
  }

  sortByDepth(highlights, true);

  highlights.forEach(removeHighlight);
}

/**
 * Returns highlights from given container.
 * @param {HTMLElement} container - return highlights from this element
 * @returns {Array} - array of highlights.
 */
function getHighlights(container: HTMLElement) {
  const nodeList = container.querySelectorAll(DATA_ATTR_SELECTOR),
    highlights = Array.prototype.slice.call(nodeList);

  if (container.matches(DATA_ATTR_SELECTOR)) {
    highlights.push(container);
  }

  return highlights;
}

/**
 * Returns screenreader nodes from given container.
 * @param {HTMLElement} container - return nodes screated for screenreder from this element
 * @returns {Array} - array of screenreader nodes.
 */
function getScreenReaderNodes(container: HTMLElement) {
  const nodeList = container.querySelectorAll(DATA_SCREEN_READERS_ATTR_SELECTOR),
    screenreaderNodes: HTMLElement[] = Array.prototype.slice.call(nodeList);

  if (container.matches(DATA_SCREEN_READERS_ATTR_SELECTOR)) {
    screenreaderNodes.push(container);
  }

  return screenreaderNodes;
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
