import Highlighter from '../../Highlighter';
import { getFirstByXPath, getTextLengthCountingScreenReaderText, getXPathForElement } from './xpath';

export const discriminator = 'XpathRangeSelector';

// Offsets count the screen reader labels inside other highlights, and a point inside another highlight is not found.
const findPoint = (path: string, offset: number, referenceElement: HTMLElement) =>
  getFirstByXPath(path, offset, referenceElement, getTextLengthCountingScreenReaderText, false);
const getPath = (node: Node, offset: number, referenceElement: HTMLElement) =>
  getXPathForElement(node, offset, referenceElement, getTextLengthCountingScreenReaderText);

export interface IData {
  type: 'XpathRangeSelector';
  referenceElementId: string;
  startContainer: string;
  startOffset: number;
  endContainer: string;
  endOffset: number;
}

export function serialize(range: Range, referenceElement: HTMLElement): IData {

  const [endContainer, endOffset] = getPath(range.endContainer, range.endOffset, referenceElement);
  const [startContainer, startOffset] = getPath(range.startContainer, range.startOffset, referenceElement);

  return {
    endContainer,
    endOffset,
    referenceElementId: referenceElement.id,
    startContainer,
    startOffset,
    type: discriminator,
  };
}

export function isLoadable(highlighter: Highlighter, data: IData): boolean {
  const referenceElement = highlighter.getReferenceElement(data.referenceElementId);
  if (!referenceElement) {
    return false;
  }

  const [startContainer] = findPoint(data.startContainer, data.startOffset, referenceElement);
  const [endContainer] = findPoint(data.endContainer, data.endOffset, referenceElement);

  return !!startContainer && !!endContainer;
}

export function load(highlighter: Highlighter, data: IData): Range {
  const range = highlighter.document.createRange();
  const referenceElement = highlighter.getReferenceElement(data.referenceElementId);

  const [startContainer, startOffset] = findPoint(data.startContainer, data.startOffset, referenceElement!);
  const [endContainer, endOffset] = findPoint(data.endContainer, data.endOffset, referenceElement!);

  if (startContainer && endContainer) {
    range.setStart(startContainer, startOffset);
    range.setEnd(endContainer, endOffset);
  }

  return range;
}
