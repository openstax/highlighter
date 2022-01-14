import { isText, isTextHighlightOrScreenReaderNode, getFirstByXPath } from './serializationStrategies/XpathRangeSelector/xpath';
import Highlight from './Highlight';
import Highlighter from './Highlighter';
import { IData } from './serializationStrategies/XpathRangeSelector';

export function getContentPath(serializationData: IData, highlighter: Highlighter, highlight: Highlight) {

  const referenceElement = highlighter.getReferenceElement(serializationData.referenceElementId);
  if (!referenceElement) { return; }

  const element = getFirstByXPath(serializationData.startContainer, highlight.range.startOffset, referenceElement);
  if (!element[0]) { return; }

  const nodePath = getNodePath(element[0], referenceElement);
  nodePath.push(highlight.range.startOffset);

  return nodePath;
}

function getNodePath(element: HTMLElement, container: HTMLElement): number[] {
  let currentParent: HTMLElement | null = element;
  const nodePath: number[] = [];

  // Go up the stack, capturing the index of each node to create a path
  while (currentParent != container) {
    const currentChild = currentParent;

    if (currentParent.parentElement) {
      currentParent = currentParent.parentElement;
      let filteredNodes = Array.from(currentParent.childNodes).filter(n => !isTextHighlightOrScreenReaderNode(n));

      filteredNodes = filteredNodes.filter((current, i) => {
        if (current == currentChild) {
          // Always include the node with the content to get the index
          return true;
        }

        const adjacent = filteredNodes[i + 1];
        const isCollapsible = (adjacent && isText(adjacent) && isText(current));

        // Remove adjacent text nodes
        return !isCollapsible;
      });

      const index = filteredNodes.indexOf(currentChild);
      nodePath.unshift(index);
    }

  }

  return nodePath.length > 0 ? nodePath : [0];
}
