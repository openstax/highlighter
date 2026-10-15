// Orders two boundary points the way a real Range does: -1 if a is before b, 0 if equal, 1 if after
const comparePoints = (aContainer, aOffset, bContainer, bOffset) => {
  if (aContainer === bContainer) {
    return Math.sign(aOffset - bOffset);
  }
  if (!aContainer || !bContainer) {
    return aContainer ? 1 : -1;
  }
  const childIndex = (ancestor, descendant) => {
    let child = descendant;
    while (child.parentNode !== ancestor) {
      child = child.parentNode;
    }
    return Array.prototype.indexOf.call(ancestor.childNodes, child);
  };
  if (aContainer.contains(bContainer)) {
    return aOffset <= childIndex(aContainer, bContainer) ? -1 : 1;
  }
  if (bContainer.contains(aContainer)) {
    return bOffset <= childIndex(bContainer, aContainer) ? 1 : -1;
  }
  // eslint-disable-next-line no-bitwise
  return aContainer.compareDocumentPosition(bContainer) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
};

class Range {
  static START_TO_START = 0;
  static START_TO_END = 1;
  static END_TO_END = 2;
  static END_TO_START = 3;

  startContainer = null;
  startOffset = 0;
  endContainer = null;
  endOffset = 0;

  cloneRange = () => {
    const clone = new Range();
    clone.setStart(this.startContainer, this.startOffset);
    clone.setEnd(this.endContainer, this.endOffset);
    return clone;
  };
  setEnd = (container, offset) => {
    this.endContainer = container;
    this.endOffset = offset;
  };
  setStart = (container, offset) => {
    this.startContainer = container;
    this.startOffset = offset;
  };
  // Same meaning of `how` as the real Range: e.g. START_TO_END compares this range's end to the other's start
  compareBoundaryPoints = (how, other) => {
    const useThisEnd = how === Range.START_TO_END || how === Range.END_TO_END;
    const useOtherEnd = how === Range.END_TO_END || how === Range.END_TO_START;
    return comparePoints(
      useThisEnd ? this.endContainer : this.startContainer,
      useThisEnd ? this.endOffset : this.startOffset,
      useOtherEnd ? other.endContainer : other.startContainer,
      useOtherEnd ? other.endOffset : other.startOffset
    );
  };
  getBoundingClientRect = () => {};
  getClientRects = () => {};
  createContextualFragment = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.children[0];
  };
}

global.window.document.createRange = () => new Range();
global.Range = Range;
