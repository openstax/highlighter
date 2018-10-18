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

interface IOptions {
  snapTableRows?: boolean;
  snapMathJax?: boolean;
  snapWords?: boolean;
}

export const snapSelection = (selection: Selection, options: IOptions): void => {
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
        shouldGobbleCharacter(range.startContainer.textContent, range.startOffset - 1);
    };
    const shouldGobbleForward = () => {
      return range.endContainer.textContent &&
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

  selection.removeAllRanges();
  selection.addRange(range);
};
