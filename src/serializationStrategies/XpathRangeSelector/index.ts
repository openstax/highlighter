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

  return {
    endContainer: getXPathForElement(range.endContainer, referenceElement),
    endOffset: range.endOffset,
    referenceElementId: referenceElement.id,
    startContainer: getXPathForElement(range.startContainer, referenceElement),
    startOffset: range.startOffset,
    type: discriminator,
  };
}

export function isLoadable(highlighter: Highlighter, data: IData): boolean {
  const referenceElement = highlighter.getReferenceElement(data.referenceElementId);

  if (!referenceElement) {
    return false;
  }

  const startContainer = getFirstByXPath(data.startContainer, referenceElement);
  const endContainer = getFirstByXPath(data.endContainer, referenceElement);

  return !!startContainer && !!endContainer;
}

export function load(highlighter: Highlighter, data: IData): Range {
  const range = highlighter.document.createRange();
  const referenceElement = highlighter.getReferenceElement(data.referenceElementId);
  const startContainer = getFirstByXPath(data.startContainer, referenceElement);
  const endContainer = getFirstByXPath(data.endContainer, referenceElement);

  range.setStart(startContainer, data.startOffset);
  range.setEnd(endContainer, data.endOffset);

  return range;
}
