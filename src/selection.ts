import dom from './dom';

const isIframe = (node: Node) => node.nodeName === 'IFRAME';
const isFirstImgOnPage = (node: Node) => node.nodeName === 'IMG';

export const cleanSelection = (selection: Selection): Selection => {
  const anchor = selection.anchorNode;
  const focus = selection.focusNode;

  if (!anchor || !focus) {
    return selection;
  }

  const anchorParent = anchor.parentNode;
  const focusParent = focus.parentNode;
  const beginsOnIframe = isIframe(anchor);
  const endsOnIframe = isIframe(focus);

  if (beginsOnIframe && anchorParent && !endsOnIframe) {
    selection.setBaseAndExtent(anchorParent, selection.anchorOffset, focus, selection.focusOffset);
  }

  if (endsOnIframe && focusParent) {
    const newAnchor = beginsOnIframe && anchorParent ? anchorParent : anchor;
    selection.setBaseAndExtent(newAnchor, selection.anchorOffset, focusParent, selection.focusOffset + 1);
  }

  return selection;
}

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

interface IOptions {
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

  if (isFirstImgOnPage(range.startContainer) && range.startContainer.parentNode) {
    range.setStart(range.startContainer.parentNode, range.startOffset);
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
    const getMath = (node: Node) => dom(node).farthest('.MathJax,.MathJax_Display');

    const startMath = getMath(range.startContainer.nodeType === 3 /* #text */
      ? range.startContainer
      : range.startContainer.childNodes[range.startOffset] || range.startContainer
    );
    if (startMath) {
      range.setStartBefore(startMath);
    }

    const endMath = getMath(range.endContainer.nodeType === 3 /* #text */
      ? range.endContainer
      : range.endContainer.childNodes[range.endOffset - 1] || range.endContainer
    );

    if (endMath) {
      const endElement = dom(endMath.nextSibling).matches('script[type="math/mml"]') ? endMath.nextSibling : endMath;
      const endContainer = endElement.parentNode;
      range.setEnd(endContainer, Array.prototype.indexOf.call(endContainer.childNodes, endElement) + 1);
    }
  }

  if (options.snapWords) {
    const shouldGobbleCharacter = (container: string, targetOffset: number) =>
      targetOffset >= 0 && container.length >= targetOffset && /\S/.test(container.substr(targetOffset, 1));

    const shouldGobbleBackward = () => {
      return range.startContainer.textContent &&
        range.startOffset < range.startContainer.textContent.length &&
        shouldGobbleCharacter(range.startContainer.textContent, range.startOffset - 1);
    };
    const shouldGobbleForward = () => {
      return range.endContainer.textContent &&
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
