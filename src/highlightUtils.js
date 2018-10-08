const DATA_ATTR = 'data-highlighted';
const NODE_TYPE = {
  ELEMENT_NODE: 1,
  TEXT_NODE: 3
};

export function injectHighlightWrappers(highlight, options = {}) {
  const wrapper = createWrapper(Object.assign({
    timestamp: Date.now(),
    id: highlight.id,
  }, options));

  const createdHighlights = highlightRange(highlight.range, wrapper);
  const normalizedHighlights = normalizeHighlights(createdHighlights);

  return normalizedHighlights;
};

/**
 * Normalizes highlights. Ensures that highlighting is done with use of the smallest possible number of
 * wrapping HTML elements.
 * Flattens highlights structure and merges sibling highlights. Normalizes text nodes within highlights.
 * @param {Array} highlights - highlights to normalize.
 * @returns {Array} - array of normalized highlights. Order and number of returned highlights may be different than
 * input highlights.
 */
function normalizeHighlights(highlights) {
  var normalizedHighlights;

  flattenNestedHighlights(highlights);
  mergeSiblingHighlights(highlights);

  // omit removed nodes
  normalizedHighlights = highlights.filter(function (hl) {
    return hl.parentElement ? hl : null;
  });

  normalizedHighlights = unique(normalizedHighlights);
  normalizedHighlights.sort(function (a, b) {
    if( !a.compareDocumentPosition) {
      // support for IE8 and below
      return a.sourceIndex - b.sourceIndex;
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

  return normalizedHighlights;
};

/**
 * Highlights range.
 * Wraps text of given range object in wrapper element.
 * @param {Range} range
 * @param {HTMLElement} wrapper
 * @returns {Array} - array of created highlights.
 */
function highlightRange(range, wrapper) {
  if (!range || range.collapsed) {
    return [];
  }

  var result = refineRangeBoundaries(range),
    startContainer = result.startContainer,
    endContainer = result.endContainer,
    goDeeper = result.goDeeper,
    done = false,
    node = startContainer,
    highlights = [],
    highlight,
    wrapperClone,
    nodeParent;

  const highlightNode = node => {
    wrapperClone = wrapper.cloneNode(true);
    wrapperClone.setAttribute(DATA_ATTR, true);
    nodeParent = node.parentNode;

    highlight = dom(node).wrap(wrapperClone);
    highlights.push(highlight);
  };

  do {
    if(!node) { done = true; }

    if (dom(node).matches('.MathJax,img')) {
      highlightNode(node);
      goDeeper = false;
    }
    if (goDeeper && node.nodeType === NODE_TYPE.TEXT_NODE) {

      if (IGNORE_TAGS.indexOf(node.parentNode.tagName) === -1 && node.nodeValue.trim() !== '') {
        highlightNode(node);
      }

      goDeeper = false;
    }
    if (node === endContainer && !(endContainer.hasChildNodes() && goDeeper)) {
      done = true;
    }

    if (node.tagName && IGNORE_TAGS.indexOf(node.tagName) > -1) {

      if (endContainer.parentNode === node) {
        done = true;
      }
      goDeeper = false;
    }
    if (goDeeper && node.hasChildNodes()) {
      node = node.firstChild;
    } else if (node.nextSibling) {
      node = node.nextSibling;
      goDeeper = true;
    } else {
      node = node.parentNode;
      goDeeper = false;
    }
  } while (!done);

  return highlights;
};

/**
 * Takes range object as parameter and refines it boundaries
 * @param range
 * @returns {object} refined boundaries and initial state of highlighting algorithm.
 */
function refineRangeBoundaries(range) {
  var startContainer = range.startContainer,
    endContainer = range.endContainer,
    ancestor = range.commonAncestorContainer,
    goDeeper = true;

  if (range.endOffset === 0) {
    while (!endContainer.previousSibling && endContainer.parentNode !== ancestor) {
      endContainer = endContainer.parentNode;
    }
    endContainer = endContainer.previousSibling;
  } else if (endContainer.nodeType === NODE_TYPE.TEXT_NODE) {
    if (range.endOffset < endContainer.nodeValue.length) {
      endContainer.splitText(range.endOffset);
    }
  } else if (range.endOffset > 0) {
    endContainer = endContainer.childNodes.item(range.endOffset - 1);
  }
  if (startContainer.nodeType === NODE_TYPE.TEXT_NODE) {
    if (range.startOffset === startContainer.nodeValue.length) {
      goDeeper = false;
    } else if (range.startOffset > 0) {
      startContainer = startContainer.splitText(range.startOffset);
      if (endContainer === startContainer.previousSibling) {
        endContainer = startContainer;
      }
    }
  } else if (range.startOffset < startContainer.childNodes.length) {
    startContainer = startContainer.childNodes.item(range.startOffset);
  } else {
    startContainer = startContainer.nextSibling;
  }

  // BEGIN this might not be necessary, test removing it
  const getMath = node => {
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
    startContainer: startContainer,
    endContainer: endContainer,
    goDeeper: goDeeper
  };
}

/**
 * Flattens highlights structure.
 * Note: this method changes input highlights - their order and number after calling this method may change.
 * @param {Array} highlights - highlights to flatten.
 */
function flattenNestedHighlights(highlights) {
  var again;

  sortByDepth(highlights, true);

  function flattenOnce() {
    var again = false;

    highlights.forEach(function (hl, i) {
      var parent = hl.parentElement,
        parentPrev = parent.previousSibling,
        parentNext = parent.nextSibling;

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
          parent.replaceChild(hl.firstChild, hl);
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
};

/**
 * Merges sibling highlights and normalizes descendant text nodes.
 * Note: this method changes input highlights - their order and number after calling this method may change.
 * @param highlights
 */
function mergeSiblingHighlights(highlights) {

  function shouldMerge(current, node) {
    return node && node.nodeType === NODE_TYPE.ELEMENT_NODE &&
      haveSameColor(current, node) &&
      isHighlight(node);
  }

  highlights.forEach(function (highlight) {
    var prev = highlight.previousSibling,
      next = highlight.nextSibling;

    if (shouldMerge(highlight, prev)) {
      dom(highlight).prepend(prev.childNodes);
      dom(prev).remove();
    }
    if (shouldMerge(highlight, next)) {
      dom(highlight).append(next.childNodes);
      dom(next).remove();
    }

    dom(highlight).normalizeTextNodes();
  });
};

/**
 * Creates wrapper for highlights.
 */
function createWrapper(options) {
  var span = document.createElement('span');
  span.className = options.className || 'highlight';
  if (options.timestamp) {
    span.setAttribute(options.timestamp || 'data-timestamp', options.timestamp);
  }
  if (options.id) {
    span.setAttribute('data-id', options.id)
  }
  return span;
};

function isHighlight(el) {
  return el && el.nodeType === NODE_TYPE.ELEMENT_NODE && el.hasAttribute(DATA_ATTR);
};

function sortByDepth(arr, descending) {
  arr.sort(function (a, b) {
    return dom(descending ? b : a).parents().length - dom(descending ? a : b).parents().length;
  });
}

function haveSameColor() {
  return true;
}

/**
 * Returns array without duplicated values.
 * @param {Array} arr
 * @returns {Array}
 */
function unique(arr) {
  return arr.filter(function (value, idx, self) {
    return self.indexOf(value) === idx;
  });
}
