import * as uuid from 'uuid/v4';
import dom from './dom';
import { DATA_SCREEN_READERS_ATTR, DATA_SCREEN_READERS_ATTR_SELECTOR } from './injectHighlightWrappers';
import SerializedHighlight from './SerializedHighlight';

export interface IHighlightData {
  style?: string;
  id: string;
  content: string;
}

export interface IOptions {
  skipIDsBy?: RegExp;
  formatMessage: (descriptor: { id: string }, values: { style: IHighlightData['style'] }) => string;
  tabbable?: boolean;
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
  public readonly options: IOptions;
  private data: IHighlightData;
  private _elements: HTMLElement[] = [];

  constructor(
    range: Range,
    data: Pick<IHighlightData, Exclude<keyof IHighlightData, 'id'>> & Partial<Pick<IHighlightData, 'id'>>,
    options: IOptions
  ) {
    this.range = range;
    this.options = options;
    this.data = {
      ...data,
      id: data.id || uuid(),
    };
  }

  public getMessage(id: string): string {
    return this.options.formatMessage({ id }, { style: this.data.style });
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
    const { style } = this.data;
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

  public updateStartMarker(el: Element, position: string) {
    const marker = el.querySelector(`[${DATA_SCREEN_READERS_ATTR}][tabindex]`);
    const message = this.getMessage(`i18n:highlighter:highlight:${position}`);

    if (!marker) {
      return;
    }
    marker.setAttribute('data-message', message);
  }
  /**
   * Add class 'focus' to all elements of this highlight.
   */
  public addFocusedStyles(): Highlight {
    this.elements.forEach((el: HTMLElement) => {
      el.setAttribute('aria-current', 'true');
      this.updateStartMarker(el, 'start-selected');
    });
    return this;
  }

  /**
   * Move focus to the first element of this highlight.
   * @return boolean indicating if the action was a success.
   */
  public focus(): boolean {
    const focusableElement = this.elements[0].querySelector(DATA_SCREEN_READERS_ATTR_SELECTOR) as HTMLElement | null;
    if (focusableElement) {
      focusableElement.focus();
      return true;
    }
    return false;
  }

  public intersects(range: Range): boolean {
    if (!range) {
      return false;
    }
    return this.range.compareBoundaryPoints(Range.START_TO_END, range) !== -1
      && this.range.compareBoundaryPoints(Range.END_TO_START, range) !== 1;
  }

  public serialize(referenceElement?: HTMLElement): SerializedHighlight {
    const validReferenceElement = this.getValidReferenceElement(referenceElement);

    if (!validReferenceElement) {
      throw new Error('reference element not found');
    }

    return new SerializedHighlight({
      ...this.data,
      ...SerializedHighlight.defaultSerializer(this.range, validReferenceElement),
    });
  }
  private loadStyle() {
    const { style } = this.data;
    if (style) {
      this.elements.forEach((element) => element.classList.add(style));
    }
  }

  private checkReferenceElement(referenceElement?: HTMLElement): referenceElement is HTMLElement {
    if (!referenceElement || !referenceElement.id) {
      return false;
    }

    if (!this.options.skipIDsBy) {
      return true;
    } else {
      return !this.options.skipIDsBy.test(referenceElement.id);
    }
  }

  private getValidReferenceElement(referenceElement?: HTMLElement): HTMLElement | null {
    if (!referenceElement) {
      referenceElement = dom(this.range.commonAncestorContainer).closest('[id]');
    }

    const parentElement = referenceElement && referenceElement.parentElement;

    if (this.checkReferenceElement(referenceElement)) {
      return referenceElement;
    } else if (parentElement) {
      const nextReferenceElement = dom(parentElement).closest('[id]');
      return this.getValidReferenceElement(nextReferenceElement);
    } else {
      return null;
    }
  }
}
