import Highlighter from './Highlighter';
import { IData as TextPositionData } from './serializationStrategies/TextPositionSelector';
import { IData as XpathData } from './serializationStrategies/XpathRangeSelector';
import { getFirstByXPath, isText, isTextHighlightOrScreenReaderNode } from './serializationStrategies/XpathRangeSelector/xpath';

type IData = XpathData | TextPositionData;

export function getContentPath(serializationData: IData, highlighter: Highlighter) {
  if (serializationData.type === 'TextPositionSelector') {
    return [0, serializationData.start];
  }

  const referenceElement = highlighter.getReferenceElement(serializationData.referenceElementId);
  if (!referenceElement) { return; }

  const element = getFirstByXPath(
    serializationData.startContainer,
    serializationData.startOffset,
    referenceElement
  );
  if (!element[0]) { return; }

  const nodePath = getNodePath(element[0], referenceElement);
  nodePath.push(serializationData.startOffset);

  return nodePath;
}

function getNodePath(element: HTMLElement, container: HTMLElement): number[] {
  let currentNode: HTMLElement | null = element;
  const nodePath: number[] = [];

  // Go up the stack, capturing the index of each node to create a path
  while (currentNode !== container) {
    if (currentNode && currentNode.parentNode) {
      let filteredNodes = Array.from(currentNode.parentNode.childNodes).filter((n) => !isTextHighlightOrScreenReaderNode(n));

      filteredNodes = filteredNodes.filter((node, i) => {
        if (node === currentNode) {
          // Always include the node with the content to get the index
          return true;
        }

        const nextNode = filteredNodes[i + 1];
        const isCollapsible = (nextNode && isText(nextNode) && isText(node));

        // Remove adjacent text nodes
        return !isCollapsible;
      });

      const index = filteredNodes.indexOf(currentNode);
      nodePath.unshift(index);
      currentNode = currentNode.parentElement;
    }
  }

  return nodePath.length > 0 ? nodePath : [0];
}
