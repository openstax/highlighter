import dom from './dom';

export const rangeContentsString = (range: Range): string => {
  const fragment = cloneRangeContents(range);
  const container = document.createElement('div');
  const removeAll = (nodes: NodeList) => nodes.forEach((element: HTMLElement) => element.remove());

  container.appendChild(fragment);
  removeAll(container.querySelectorAll('.MathJax'));
  removeAll(container.querySelectorAll('.MathJax_Display'));
  removeAll(container.querySelectorAll('.MathJax_Preview'));
  removeAll(container.querySelectorAll('.MJX_Assistive_MathML'));

  container.querySelectorAll('script[type="math/mml"]').forEach((element: HTMLElement) => {
    const template = document.createElement('template');
    template.innerHTML = element.textContent;
    const math = template.content.firstChild;

    element.parentElement.insertBefore(math, element);
    element.remove();
  });

  return container.innerHTML;
};

export const cloneRangeContents = (range: Range): DocumentFragment => {
  const tableTags = ['TR', 'TBODY', 'TABLE'];
  const fragment = document.createDocumentFragment();

  const getStartNode = () => {
    if (range.commonAncestorContainer.nodeType === 3 /* #text */) {
      return range.commonAncestorContainer.parentNode;
    } else if (tableTags.indexOf(range.commonAncestorContainer.nodeName) > -1) {
      return dom(range.commonAncestorContainer).closest('table').parentNode;
    } else {
      return range.commonAncestorContainer;
    }
  };

  cloneForRange(getStartNode(), range).childNodes.forEach((node: Node) =>
    fragment.appendChild(node.cloneNode(true))
  );

  return fragment;
};

function cloneForRange(element: Node, range: Range, foundStart: boolean = false) {
  const isStart = (node: Node) => node.parentElement === range.startContainer
    && Array.prototype.indexOf.call(range.startContainer.childNodes, node) === range.startOffset;
  const isEnd = (node: Node) => node.parentElement === range.endContainer
    && Array.prototype.indexOf.call(range.endContainer.childNodes, node) === range.endOffset;

  const result = element.cloneNode();

  if (element.nodeType === 3 /* #text */) {
    if (element === range.startContainer && element === range.endContainer) {
      result.textContent = element.textContent.substring(range.startOffset, range.endOffset + 1);
    } else if (element === range.startContainer) {
      result.textContent = element.textContent.substring(range.startOffset);
    } else if (element === range.endContainer) {
      result.textContent = element.textContent.substring(0, range.endOffset);
    } else {
      result.textContent = element.textContent;
    }
  } else {
    let node: Node = element.firstChild;
    let foundEnd;

    while (node && !isEnd(node) && !foundEnd) {
      foundStart = foundStart || isStart(node);
      foundEnd = dom(node).isParent(range.endContainer);

      if (foundStart && !foundEnd) {
        const copy = node.cloneNode(true);
        result.appendChild(copy);
      } else if (foundStart || dom(node).isParent(range.startContainer)) {
        const copy = cloneForRange(node, range, foundStart);
        result.appendChild(copy);
        foundStart = true;
      }

      node = node.nextSibling;
    }
  }

  return result;
}
