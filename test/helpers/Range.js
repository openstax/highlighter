class Range {
  setEnd = () => {};
  setStart = () => {};
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
