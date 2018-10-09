import Highlight from './Highlight';
import Highlighter from './Highlighter';
import {getFirstByXPath} from './xpath';

interface IData {
  meta?: object;
  referenceElementId: string;
  startContainer: string;
  startOffset: number;
  endContainer: string;
  endOffset: number;
  content: string;
}

export default class SerializedHighlight {
  private data: IData;

  constructor(data: IData) {
    this.data = data;
  }

  public isLoadable(highlighter: Highlighter): boolean {
    const referenceElement = highlighter.getReferenceElement(this.data.referenceElementId);

    if (!referenceElement) {
      return false;
    }

    const startContainer = getFirstByXPath(this.data.startContainer, referenceElement);
    const endContainer = getFirstByXPath(this.data.endContainer, referenceElement);

    return !!startContainer && !!endContainer;
  }

  public load(highlighter: Highlighter): Highlight {
    const range = document.createRange();
    const referenceElement = highlighter.getReferenceElement(this.data.referenceElementId);
    const startContainer = getFirstByXPath(this.data.startContainer, referenceElement);
    const endContainer = getFirstByXPath(this.data.endContainer, referenceElement);

    range.setStart(startContainer, this.data.startOffset);
    range.setEnd(endContainer, this.data.endOffset);

    return new Highlight(range, this.data.content, this.data.meta);
  }
}
