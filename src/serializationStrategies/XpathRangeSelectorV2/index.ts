import Highlighter from '../../Highlighter';
import { getFirstByXPath, getVisibleTextLength, getXPathForElement } from '../XpathRangeSelector/xpath';

/**
 * Same as XpathRangeSelector, except that text offsets leave out the hidden screen reader labels inside other
 * highlights. Those labels depend on what else is on the page, so offsets that count them can point to the wrong
 * text when the page loads with different highlights or search results.
 */
export const discriminator = 'XpathRangeSelectorV2';

export interface IData {
  type: 'XpathRangeSelectorV2';
  referenceElementId: string;
  startContainer: string;
  startOffset: number;
  endContainer: string;
  endOffset: number;
}

export function serialize(range: Range, referenceElement: HTMLElement): IData {
  const [endContainer, endOffset] = getXPathForElement(
    range.endContainer, range.endOffset, referenceElement, getVisibleTextLength
  );
  const [startContainer, startOffset] = getXPathForElement(
    range.startContainer, range.startOffset, referenceElement, getVisibleTextLength
  );

  return {
    endContainer,
    endOffset,
    referenceElementId: referenceElement.id,
    startContainer,
    startOffset,
    type: discriminator,
  };
}

const findBoundaries = (referenceElement: HTMLElement, data: IData) => ({
  end: getFirstByXPath(data.endContainer, data.endOffset, referenceElement, getVisibleTextLength),
  start: getFirstByXPath(data.startContainer, data.startOffset, referenceElement, getVisibleTextLength),
});

export function isLoadable(highlighter: Highlighter, data: IData): boolean {
  const referenceElement = highlighter.getReferenceElement(data.referenceElementId);
  if (!referenceElement) {
    return false;
  }

  const { start: [startContainer], end: [endContainer] } = findBoundaries(referenceElement, data);

  return !!startContainer && !!endContainer;
}

export function load(highlighter: Highlighter, data: IData): Range {
  const range = highlighter.document.createRange();
  const referenceElement = highlighter.getReferenceElement(data.referenceElementId);

  if (!referenceElement) {
    return range;
  }

  const { start: [startContainer, startOffset], end: [endContainer, endOffset] } = findBoundaries(referenceElement, data);

  if (startContainer && endContainer) {
    range.setStart(startContainer, startOffset);
    range.setEnd(endContainer, endOffset);
  }

  return range;
}
