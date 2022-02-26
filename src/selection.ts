import flow from 'lodash/fp/flow';
import dom from './dom';

export const getRange = (selection: Selection): Range => {
  if (selection.rangeCount < 1) {
    throw new Error('selection had no ranges');
  }

  // set up range to modify
  const range = selection.getRangeAt(0).cloneRange();
  const endRange = selection.getRangeAt(selection.rangeCount - 1);

  range.setEnd(endRange.endContainer, endRange.endOffset);

  return range;
};

const getDirection = (selection: Selection): 'forward' | 'backward' => {
  const anchorNode = selection.anchorNode;
  const anchorOffset = selection.anchorOffset;
  const range = getRange(selection);

  if (anchorNode !== range.startContainer || anchorOffset !== range.startOffset) {
    return 'backward';
  }

  return 'forward';
};

const getContainer = (container: Node, offset: number) =>
  container.nodeType === 3 /* #text */
  ? container
  : container.childNodes[offset] || container;

const resetRangeEnd = (range: Range, node: Node, selector: string) => {
  if (!range || !node) {
    return;
  }
  const endElement = node.nextSibling && dom(node.nextSibling).matches(selector) ? node.nextSibling : node;
  const endContainer = endElement.parentNode;
  if (endContainer) {
    range.setEnd(endContainer, Array.prototype.indexOf.call(endContainer.childNodes, endElement) + 1);
  }
};

const snapToSelectedBlock = (range: Range, ancestorSelector: string, endSelector?: string) => {
  const getBlock = (node: Node) => dom(node).farthest(ancestorSelector);
  const getBlockBoundary = flow(getContainer, getBlock);

  const startBlock = getBlockBoundary(range.startContainer, range.startOffset);

  if (startBlock) {
    range.setStartBefore(startBlock);
  }

  const endBlock = getBlockBoundary(range.endContainer, range.endOffset);
  resetRangeEnd(range, endBlock, endSelector || ancestorSelector);
};

interface IOptions {
  snapCode?: boolean;
  snapTableRows?: boolean;
  snapMathJax?: boolean;
  snapWords?: boolean;
}

export const snapSelection = (selection: Selection, options: IOptions): Range | undefined => {
  const selectionDirection = getDirection(selection);
  const range = getRange(selection);

  if (!range) {
    return;
  }

  if (options.snapTableRows) {
    if (['TBODY', 'TR'].indexOf(range.commonAncestorContainer.nodeName) > -1) {
      const startRow = dom(range.startContainer).farthest('tr');
      const endRow = dom(range.endContainer).farthest('tr');

      if (startRow) {
        range.setStartBefore(startRow.firstElementChild.firstChild);
      }
      if (endRow) {
        range.setEndAfter(endRow.lastElementChild.lastChild);
      }
    }
  }

  if (options.snapMathJax) {
    snapToSelectedBlock(range, '.MathJax,.MathJax_Display', 'script[type="math/mml"]');
  }

  if (options.snapCode) {
    // also this requires a change to rex (snapCode: true) + lib update
    snapToSelectedBlock(range, '[data-type="code"]');
  }

  if (options.snapWords) {
    const shouldGobbleCharacter = (container: string, targetOffset: number) =>
      targetOffset >= 0 && container.length >= targetOffset && /\S/.test(container.substr(targetOffset, 1));

    const shouldGobbleBackward = () => {
      return range.startContainer.textContent &&
        // ensure range of selection overlaps with startContainer before gobbling
        // fixes firefox behavior that prevented starting highlights on images
        range.startOffset < range.startContainer.textContent.length &&
        shouldGobbleCharacter(range.startContainer.textContent, range.startOffset - 1);
    };
    const shouldGobbleForward = () => {
      return range.endContainer.textContent &&
        // ensure range of selection overlaps with endContainer before gobbling
        // fixes firefox behavior that prevented ending highlights on images
        range.endOffset > 0 &&
        shouldGobbleCharacter(range.endContainer.textContent, range.endOffset);
    };
    const gobbleBackward = () => {
      range.setStart(range.startContainer, range.startOffset - 1);
    };
    const gobbleForward = () => {
      range.setEnd(range.endContainer, range.endOffset + 1);
    };
    if (range.startContainer.nodeName === '#text') {
      while (shouldGobbleBackward()) {
        gobbleBackward();
      }
    }
    if (range.endContainer.nodeName === '#text') {
      while (shouldGobbleForward()) {
        gobbleForward();
      }
    }
  }

  if (selectionDirection === 'backward') {
    // https://stackoverflow.com/a/10705853
    const endRange = range.cloneRange();
    endRange.collapse(false);
    selection.removeAllRanges();
    selection.addRange(endRange);
    selection.extend(range.startContainer, range.startOffset);
    return range;
  }

  selection.removeAllRanges();
  selection.addRange(range);

  return range;
};
