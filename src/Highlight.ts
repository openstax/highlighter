import dom from './dom';
import SerializedHighlight from './SerializedHighlight';

export const FOCUS_CSS = 'focus';

export interface IHighlightData {
  style?: string;
  id: string;
  content: string;
}

export default class Highlight {

  public get id(): string {
    return this.data.id;
  }

  public get content(): string {
    return this.data.content;
  }

  public set elements(elements: HTMLElement[]) {
    if (this.elements.length > 0) {
      throw new Error(`Hightlight elements aren't reloadable`);
    }
    this._elements = elements;
    this.loadStyle();
  }

  public get elements(): HTMLElement[] {
    return this._elements;
  }
  public readonly range: Range;
  private data: IHighlightData;
  private _elements: HTMLElement[] = [];

  constructor(range: Range, data: Pick<IHighlightData, Exclude<keyof IHighlightData, 'id'>> & Partial<Pick<IHighlightData, 'id'>>) {
    this.range = range;
    this.data = {
      ...data,
      // TODO - something more random here
      id: data.id || (new Date()).getTime().toString(),
    };
  }

  public setStyle(style: string) {
    this.removeStyle();
    this.data.style = style;
    this.loadStyle();
  }

  public getStyle() {
    return this.data.style;
  }

  public removeStyle() {
    const {style} = this.data;
    if (style) {
      this.elements.forEach((element) => element.classList.remove(style));
      delete this.data.style;
    }
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
      ...this.data,
      ...SerializedHighlight.defaultSerializer(this.range, referenceElement),
    });
  }
  private loadStyle() {
    const {style} = this.data;
    if (style) {
      this.elements.forEach((element) => element.classList.add(style));
    }
  }
}
