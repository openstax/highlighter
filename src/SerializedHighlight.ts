import {getFirstByXPath} from './xpath';
import Highlighter from './Highlighter';

export class SerializedData {
  referenceElementId: string;
  startContainer: string;
  startOffset: number;
  endContainer: string;
  endOffset: number;
  content: string;

  constructor(data: SerializedData) {
    Object.assign(this, data);
  }
}

export default class SerializedHighlight extends SerializedData {
  isLoadable(highlighter : Highlighter) {
    const referenceElement = highlighter.getReferenceElement(this.referenceElementId);

    if (!referenceElement) {
      return false;
    }

    const startContainer = getFirstByXPath(this.startContainer, referenceElement);
    const endContainer = getFirstByXPath(this.endContainer, referenceElement);

    return !!startContainer && !!endContainer;
  }
}
