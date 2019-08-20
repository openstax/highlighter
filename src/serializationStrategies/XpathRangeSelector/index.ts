import dom from '../../dom';
import Highlighter from '../../Highlighter';
import {getFirstByXPath, getXPathForElement} from './xpath';

export const discriminator = 'XpathRangeSelector';

export interface IData {
  type: 'XpathRangeSelector';
  referenceElementId: string;
  startContainer: string;
  startOffset: number;
  endContainer: string;
  endOffset: number;
}

export function serialize(range: Range, referenceElement?: HTMLElement): IData {
  referenceElement = referenceElement || dom(range.commonAncestorContainer).closest('[id]');

  if (!referenceElement) {
    throw new Error('reference element not found');
  }

  const [endContainer, endOffset] = getXPathForElement(range.endContainer, range.endOffset, referenceElement);
  const [startContainer, startOffset] = getXPathForElement(range.startContainer, range.startOffset, referenceElement);

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

  const [startContainer] = getFirstByXPath(data.startContainer, data.startOffset, referenceElement);
  const [endContainer] = getFirstByXPath(data.endContainer, data.endOffset, referenceElement);

  return !!startContainer && !!endContainer;
}

export function load(highlighter: Highlighter, data: IData): Range {
  const range = highlighter.document.createRange();
  const referenceElement = highlighter.getReferenceElement(data.referenceElementId);

  const [startContainer, startOffset] = getFirstByXPath(data.startContainer, data.startOffset, referenceElement);
  const [endContainer, endOffset] = getFirstByXPath(data.endContainer, data.endOffset, referenceElement);

  if (startContainer && endContainer) {
    range.setStart(startContainer, startOffset);
    range.setEnd(endContainer, endOffset);
  }

  return range;
}
