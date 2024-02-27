// tslint:disable
import dom from './dom';
import Highlight from './Highlight';

export const TIMESTAMP_ATTR = 'data-timestamp';
export const DATA_ATTR = 'data-highlighted';
export const DATA_ATTR_SELECTOR = '[' + DATA_ATTR + ']';
export const DATA_ID_ATTR = 'data-highlight-id';
export const DATA_SCREEN_READERS_ATTR = 'data-for-screenreaders';
export const DATA_SCREEN_READERS_ATTR_SELECTOR = '[' + DATA_SCREEN_READERS_ATTR + ']';
const NODE_TYPE = {
  ELEMENT_NODE: 1,
  TEXT_NODE: 3,
};
/**
 * Don't highlight content of these tags.
 * @type {string[]}
 */
const IGNORE_TAGS = [
  'SCRIPT', 'STYLE', 'SELECT', 'OPTION', 'BUTTON', 'OBJECT', 'APPLET',
  'AUDIO', 'CANVAS', 'EMBED', 'PARAM', 'METER', 'PROGRESS',
];
/**
 * Highlights can be created around these block and text elements.
 */
const BLOCK_ELEMENTS = ['img', 'iframe'];
const TEXT_ELEMENTS = ['.MathJax'];
const ALLOWED_ELEMENTS = BLOCK_ELEMENTS.concat(TEXT_ELEMENTS).join(',');

interface IOptions {
  id?: string;
  timestamp?: number;
  className?: string;
}

const isEmptyTextNode = (node: Node) =>
  node.nodeType === NODE_TYPE.TEXT_NODE && node.textContent && !node.textContent.trim().length;

const isImgOrMediaSpan = (node: Node) =>
  node.nodeName === 'IMG' || (node.nodeName === 'SPAN' && (node as HTMLElement).dataset.type === 'media');

export default function injectHighlightWrappers(highlight: Highlight, options: IOptions = {}) {
  const wrapper = createWrapper({
    id: highlight.id,
    timestamp: Date.now(),
    ...options
  });

  const createdHighlights = highlightRange(highlight.range, wrapper);
  const normalizedHighlights = normalizeHighlights(highlight, createdHighlights);

  if (normalizedHighlights.length === 0) {
    return;
  }

  highlight.range.setStartBefore(normalizedHighlights[0]);
  highlight.range.setEndAfter(normalizedHighlights[normalizedHighlights.length - 1]);

  highlight.elements = normalizedHighlights;
}

/**
 * Create empty span with tabindex=0 and all necessary information taken from @param highlight
 * and insert this node at the first position inside @param element.
 * @param highlight Highlight
 * @param element HTMLElement highlight element for which we will insert the starting or ending element for screenreader
 * @param position start | end
 */
function createAndInsertNodeForScreenReaders(highlight: Highlight, element: HTMLElement, position: 'start' | 'end'): void {
  const node = document.createElement('span');
  node.setAttribute(DATA_SCREEN_READERS_ATTR, 'true');
  node.setAttribute(DATA_ID_ATTR, highlight.id);

  const message = highlight.getMessage(`i18n:highlighter:highlight:${position}`);

  node.textContent = message;

  if (position === 'start') {
    node.setAttribute('tabindex', '0');
    element.prepend(node);
  } else {
    element.append(node);
  }
}

/**
 * Normalizes highlights. Ensures that highlighting is done with use of the smallest possible number of
 * wrapping HTML elements.
 * Flattens highlights structure and merges sibling highlights. Normalizes text nodes within highlights.
 * Adds "first" and "last" classes to the highlights and "text" or "block" class for each highlight depends
 * on the content.
 * @param {Array} highlights - highlights to normalize.
 * @returns {Array} - array of normalized highlights. Order and number of returned highlights may be different than
 * input highlights.
 */
function normalizeHighlights(highlight: Highlight, highlights: HTMLElement[]) {
  let normalizedHighlights: HTMLElement[];

  //flattenNestedHighlights(highlights);
  mergeSiblingHighlights(highlights);

  // omit removed nodes
  normalizedHighlights = highlights.filter(function(hl) {
    return hl.parentElement ? hl : null;
  });

  normalizedHighlights = unique(normalizedHighlights);
  normalizedHighlights.sort(function(a: Node, b: Node) {
    if (!a.compareDocumentPosition) {
      // support for IE8 and below
      return (a as any).sourceIndex - (b as any).sourceIndex;
    }
    const position = a.compareDocumentPosition(b);
    if (position & Node.DOCUMENT_POSITION_FOLLOWING || position & Node.DOCUMENT_POSITION_CONTAINED_BY) {
      return -1;
    } else if (position & Node.DOCUMENT_POSITION_PRECEDING || position & Node.DOCUMENT_POSITION_CONTAINS) {
      return 1;
    } else {
      return 0;
    }
  });

  for (const [index, node] of normalizedHighlights.entries()) {
    if (index === 0) {
      node.classList.add('first');
      createAndInsertNodeForScreenReaders(highlight, node, 'start');
    }

    if (hasBlockContent(node)) {
      node.classList.add('block');
    } else {
      node.classList.add('text');
    }

    if (index === (normalizedHighlights.length - 1)) {
      node.classList.add('last');
      createAndInsertNodeForScreenReaders(highlight, node, 'end');
    }
  }

  return normalizedHighlights;
}

/**
 * Check if there are block elements inside node.
 * Block elements are: img and iframe.
 * @param {HTMLElement} node
 * @returns {boolean}
 */
function hasBlockContent(node: HTMLElement) {
  return !!node.querySelector(BLOCK_ELEMENTS.join(','));
}

/**
 * Highlights range.
 * Wraps text of given range object in wrapper element.
 * @param {Range} range
 * @param {HTMLElement} wrapper
 * @returns {Array} - array of created highlights.
 */
function highlightRange(range: Range, wrapper: HTMLElement) {
  if (!range || range.collapsed) {
    return [];
  }

  let result = refineRangeBoundaries(range),
    startContainer = result.startContainer,
    endContainer = result.endContainer,
    goDeeper = result.goDeeper,
    done = false,
    node = startContainer,
    highlights = [] as HTMLElement[],
    highlight,
    wrapperClone;

  const highlightNode = (node: HTMLElement) => {
    wrapperClone = wrapper.cloneNode(true) as HTMLElement;
    wrapperClone.setAttribute(DATA_ATTR, 'true');

    highlight = dom(node).wrap(wrapperClone);
    highlights.push(highlight);
  };

  do {
    if (!node) { done = true; }

    if (dom(node).matches(ALLOWED_ELEMENTS)) {
      highlightNode(node as HTMLElement);
      goDeeper = false;
    }
    if (goDeeper && node.nodeType === NODE_TYPE.TEXT_NODE) {

      if (IGNORE_TAGS.indexOf((node.parentNode as HTMLElement).tagName) === -1 && node.nodeValue!.trim() !== '') {
        highlightNode(node as HTMLElement);
      }

      goDeeper = false;
    }
    if (node === endContainer && !(endContainer.hasChildNodes() && goDeeper)) {
      done = true;
    }

    if ((node as HTMLElement).tagName && IGNORE_TAGS.indexOf((node as HTMLElement).tagName) > -1) {

      if (endContainer.parentNode === node) {
        done = true;
      }
      goDeeper = false;
    }
    if (goDeeper && node.hasChildNodes()) {
      node = node.firstChild as HTMLElement;
    } else if (!goDeeper && node.contains(endContainer)) {
      // stops traversing of tree if endContainer is a descendent of current allowed node
      // this prevents a bug where the highlighter breaks out of its bounds and scans the remainder of the page
      // (happens when firefox sets the comment inside an iframe as endcontainer)
      done = true;
    } else if (node.nextSibling) {
      node = node.nextSibling;
      goDeeper = true;
    } else {
      node = node.parentNode as HTMLElement;
      goDeeper = false;
    }
  } while (!done);

  return highlights;
}

/**
 * Takes range object as parameter and refines it boundaries
 * @param range
 * @returns {object} refined boundaries and initial state of highlighting algorithm.
 */
function refineRangeBoundaries(range: Range) {
  let startContainer = range.startContainer,
    endContainer = range.endContainer,
    ancestor = range.commonAncestorContainer,
    goDeeper = true;

  if (range.endOffset === 0) {
    while (!endContainer.previousSibling && endContainer.parentNode !== ancestor) {
      endContainer = endContainer.parentNode as HTMLElement;
    }
    // use previous sibling for end container unless end container is an img/media span preceded by an empty text node
    // otherwise highlights ending on an img in firefox may not display correctly due to empty text nodes around img element
    if (endContainer.previousSibling && !(isImgOrMediaSpan(endContainer) && isEmptyTextNode(endContainer.previousSibling))) {
      endContainer = endContainer.previousSibling as HTMLElement;
    }
  } else if (endContainer.nodeType === NODE_TYPE.TEXT_NODE) {
    if (range.endOffset < endContainer.nodeValue!.length) {
      (endContainer as Text).splitText(range.endOffset);
    }
  } else if (range.endOffset > 0) {
    endContainer = endContainer.childNodes.item(range.endOffset - 1);
  }
  if (startContainer.nodeType === NODE_TYPE.TEXT_NODE) {
    if (range.startOffset === (startContainer as Text).nodeValue!.length) {
      goDeeper = false;
    } else if (range.startOffset > 0) {
      startContainer = (startContainer as Text).splitText(range.startOffset);
      if (endContainer === startContainer.previousSibling) {
        endContainer = startContainer;
      }
    }
  } else if (range.startOffset < startContainer.childNodes.length) {
    startContainer = startContainer.childNodes.item(range.startOffset);
    // use next sibling for start container unless start container is an img/media span followed by an empty text node
    // otherwise highlights starting on an img in firefox may not display correctly due to empty text nodes around img element
  } else if (startContainer.nextSibling && !(isImgOrMediaSpan(startContainer) && isEmptyTextNode(startContainer.nextSibling))) {
    startContainer = startContainer.nextSibling as Node;
  }

  // BEGIN this might not be necessary, test removing it
  const getMath = (node: Node) => {
    const mathjax = dom(node).farthest('.MathJax');
    if (mathjax) {
      return mathjax;
    }

    const mml = dom(node).farthest('script[type="math/mml"]');
    if (mml && mml.previousSibling.matches('.MathJax')) {
      return mml.previousSibling;
    }
    if (mml && mml.previousSibling.matches('.MathJax_Display')) {
      return mml.previousSibling.querySelector('.MathJax');
    }

    return null;
  };
  const endMath = getMath(endContainer);
  if (endMath) {
    endContainer = endMath;
  }
  const startMath = getMath(startContainer);
  if (startMath) {
    startContainer = startMath;
    goDeeper = false;
  }
  // END this might not be necessary, test removing it

  return {
    startContainer,
    endContainer,
    goDeeper,
  };
}

/**
 * Flattens highlights structure.
 * Note: this method changes input highlights - their order and number after calling this method may change.
 * @param {Array} highlights - highlights to flatten.
 */
// @ts-ignore
function flattenNestedHighlights(highlights: Node[]) {
  let again;

  sortByDepth(highlights, true);

  function flattenOnce() {
    let again = false;

    highlights.forEach(function(hl, i) {
      const parent = hl.parentElement!,
        parentPrev = parent!.previousSibling,
        parentNext = parent!.nextSibling;

      if (isHighlight(parent)) {

        if (!haveSameColor(parent, hl)) {

          if (!hl.nextSibling) {
            dom(hl).insertBefore(parentNext || parent);
            again = true;
          }

          if (!hl.previousSibling) {
            dom(hl).insertAfter(parentPrev || parent);
            again = true;
          }

          if (!parent.hasChildNodes()) {
            dom(parent).remove();
          }

        } else {
          parent.replaceChild(hl.firstChild!, hl);
          highlights[i] = parent;
          again = true;
        }

      }

    });

    return again;
  }

  do {
    again = flattenOnce();
  } while (again);
}

/**
 * Merges sibling highlights and normalizes descendant text nodes.
 * Note: this method changes input highlights - their order and number after calling this method may change.
 * @param highlights
 */
function mergeSiblingHighlights(highlights: Node[]) {

  function shouldMerge(current: any, node: any) {
    return isHighlight(current) && isHighlight(node)
      && (current as any).data && (node as any).data
      && (current as any).data.id === (node as any).data.id;
  }

  highlights.forEach(function(highlight) {
    const prev = highlight.previousSibling,
      next = highlight.nextSibling;

    if (shouldMerge(highlight, prev)) {
      dom(highlight).prepend(prev!.childNodes);
      dom(prev).remove();
    }
    if (shouldMerge(highlight, next)) {
      dom(highlight).append(next!.childNodes);
      dom(next).remove();
    }

    dom(highlight).normalizeTextNodes();
  });
}

/**
 * Creates wrapper for highlights.
 */
function createWrapper(options: any) {
  const el = document.createElement('mark');
  el.className = options.className;
  if (options.timestamp) {
    el.setAttribute(TIMESTAMP_ATTR, options.timestamp);
  }
  if (options.id) {
    el.setAttribute(DATA_ID_ATTR, options.id);
  }
  return el;
}

function isHighlight(el: any): el is HTMLElement {
  return el && el.nodeType === NODE_TYPE.ELEMENT_NODE && el.matches(DATA_ATTR_SELECTOR);
}

function sortByDepth(arr: Node[], descending: boolean) {
  arr.sort(function(a, b) {
    return dom(descending ? b : a).parents().length - dom(descending ? a : b).parents().length;
  });
}

function haveSameColor(_: Node, __: Node) {
  return true;
}

/**
 * Returns array without duplicated values.
 * @param {Array} arr
 * @returns {Array}
 */
function unique(arr: any[]) {
  return arr.filter(function(value, idx, self) {
    return self.indexOf(value) === idx;
  });
}
