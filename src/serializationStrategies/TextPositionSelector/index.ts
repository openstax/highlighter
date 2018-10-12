import serializeSelection from 'serialize-selection';
import dom from '../../dom';
import Highlighter from '../../Highlighter';

export const discriminator = 'TextPositionSelector';

export interface IData {
  type: 'TextPositionSelector';
  referenceElementId: string;
  start: number;
  end: number;
}

export function serialize(range: Range, referenceElement?: HTMLElement): IData {
  referenceElement = referenceElement || dom(range.commonAncestorContainer).closest('[id]');

  // modified copy/paste out of 'serialize-selection' module
  const cloneRange = range.cloneRange();
  const startContainer = cloneRange.startContainer;
  const startOffset = cloneRange.startOffset;
  const contentLength = cloneRange.toString().length;

  cloneRange.selectNodeContents(referenceElement);
  cloneRange.setEnd(startContainer, startOffset);

  return {
    end: cloneRange.toString().length + contentLength,
    referenceElementId: referenceElement.id,
    start: cloneRange.toString().length,
    type: discriminator,
  };
}

export function isLoadable(highlighter: Highlighter, data: IData): boolean {
  return !!highlighter.document.getElementById(data.referenceElementId);
}

export function load(highlighter: Highlighter, data: IData): Range {
  const referenceElement = highlighter.getReferenceElement(data.referenceElementId);
  const selection = serializeSelection.restore(data, referenceElement);
  const range = selection.getRangeAt(0);
  selection.removeAllRanges();
  return range;
}
