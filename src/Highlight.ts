import dom from './dom';
import SerializedHighlight from './SerializedHighlight';

export const FOCUS_CSS = 'focus';

export default class Highlight {
  private _id: string;
  private _content: string;
  private _range: Range;
  private _elements: HTMLElement[] = [];

  constructor(range: Range, content: string);
  constructor(id: string, range: Range, content: string);
  constructor(arg: any, arg2: any, content?: string) {
    if (arg instanceof Range) {
      // TODO - something more random here
      this._id = (new Date()).getTime().toString();
      this._range = arg;
      this._content = arg2;
    } else if (content) {
      this._id = arg;
      this._range = arg2;
      this._content = content;
    } else {
      throw new Error('invalid constructor arguments');
    }
  }

  public get id(): string {
    return this._id;
  }

  public get content(): string {
    return this._content;
  }

  public get range(): Range {
    return this._range;
  }

  public set elements(elements: HTMLElement[]) {
    if (this.elements) {
      throw new Error(`Hightlight elements aren't reloadable`);
    }
    this._elements = elements;
  }

  public get elements(): HTMLElement[] {
    return this._elements;
  }

  public isAttached(): boolean {
    // TODO - check and see if these are in the dom
    return this.elements.length > 0;
  }

  public scrollTo(handler?: (elements: HTMLElement[]) => void): Highlight {
    if (!this.isAttached()) {
      return this;
    } else if (handler) {
      handler(this.elements);
    } else {
      this.elements[0].scrollIntoView();
    }
    return this;
  }

  public focus(): Highlight {
    this.elements.forEach((el: HTMLElement) => el.classList.add(FOCUS_CSS));
    return this;
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
      id: this.id,
      ...SerializedHighlight.defaultSerializer(this.range, referenceElement),
    });
  }
}
