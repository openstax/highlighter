class Selection {
  getRangeAt = () => new Range();
  rangeCount = 1;
}

global.window.document.getSelection = () => new Selection();
global.Selection = Selection;
