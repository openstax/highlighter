import dom from './dom';
import SerializedHighlight from './SerializedHighlight';
import {getXPathForElement} from './xpath';

export default class Highlight {
  private range: Range;
  private content: string;
  private meta: object;

  constructor(range: Range, content: string, meta: object = {}) {
    this.range = range;
    this.content = content;
    this.meta = meta;
  }

  public getRange() {
    return this.range;
  }

  public updateMeta(meta: object) {
    Object.assign(this.meta, meta);
  }

  public getMeta() {
    return this.meta;
  }

  public intersects(range: Range): boolean {
    if (!range) {
      return false;
    }
    return this.range.compareBoundaryPoints(Range.START_TO_END, range) !== -1
      && this.range.compareBoundaryPoints(Range.END_TO_START, range) !== 1;
  }

  public serialize(referenceElement?: HTMLElement): SerializedHighlight {
    referenceElement = referenceElement || dom(this.range.commonAncestorContainer).closest('[id]');

    return new SerializedHighlight({
      content: this.content,
      endContainer: getXPathForElement(this.range.endContainer, referenceElement),
      endOffset: this.range.endOffset,
      meta: this.meta,
      referenceElementId: referenceElement.id,
      startContainer: getXPathForElement(this.range.startContainer, referenceElement),
      startOffset: this.range.startOffset,
    });
  }
}
