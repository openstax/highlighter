class Range {
  cloneRange = () => new Range();
  setEnd = () => {};
  setStart = () => {};
  // Stub ranges have no real boundaries, so a range is only treated as equal to itself
  compareBoundaryPoints = (_how, other) => (other === this ? 0 : -1);
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
