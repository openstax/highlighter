import dom, { isHtmlElement } from './dom';
import Highlight, { FOCUS_CSS, IHighlightData, IOptions as HighlightOptions } from './Highlight';
import injectHighlightWrappers, { DATA_ATTR, DATA_ID_ATTR, DATA_SCREEN_READERS_ATTR } from './injectHighlightWrappers';
import { rangeContentsString } from './rangeContents';
import removeHighlightWrappers from './removeHighlightWrappers';
import { snapSelection } from './selection';
import SerializedHighlight from './SerializedHighlight';

interface IOptions {
  snapTableRows?: boolean;
  snapMathJax?: boolean;
  snapWords?: boolean;
  className?: string;
  skipIDsBy?: RegExp;
  formatMessage: (id: string, style: IHighlightData['style']) => string;
  onClick?: (highlight: Highlight | undefined, event: MouseEvent) => void;
  onSelect?: (highlights: Highlight[], newHighlight?: Highlight) => void;
  onFocusIn?: (highlight: Highlight) => void;
  onFocusOut?: (highlight: Highlight) => void;
}

export default class Highlighter {
  public readonly container: HTMLElement;
  private highlights: { [key: string]: Highlight } = {};
  private options: IOptions;

  constructor(container: HTMLElement, options: IOptions) {
    this.container = container;
    this.options = {
      className: 'highlight',
      ...options,
    };
    this.container.addEventListener('mouseup', this.onMouseup);
    this.container.addEventListener('focusin', this.onFocusHandler('in'));
    this.container.addEventListener('focusout', this.onFocusHandler('out'));
  }

  public unmount(): void {
    this.container.removeEventListener('mouseup', this.onMouseup);
  }

  public eraseAll = (): void => {
    this.getHighlights().forEach(this.erase);
  }

  public teardown = (): void => {
    this.eraseAll();
    this.unmount();
  }

  public erase = (highlight: Highlight): void => {
    removeHighlightWrappers(highlight);
    delete this.highlights[highlight.id];
  }

  public highlight(highlight?: Highlight | SerializedHighlight): void {
    if (highlight instanceof SerializedHighlight && highlight.isLoadable(this)) {
      return this.highlight(highlight.load(this));
    } else if (highlight instanceof Highlight) {
      this.highlights[highlight.id] = highlight;
      injectHighlightWrappers(highlight, this.options);
    }
  }

  public getHighlight(id: string): Highlight | undefined {
    return this.highlights[id];
  }

  public getReferenceElement(id: string): HTMLElement | null {
    return this.container.querySelector(`[id="${id}"]`);
  }

  public clearFocus(): void {
    this.container.querySelectorAll(`.${this.options.className}.${FOCUS_CSS}`)
      .forEach((el: Element) => el.classList.remove(FOCUS_CSS));
  }

  public getHighlights(): Highlight[] {
    return Object.values(this.highlights);
  }

  public getHighlightOptions(): HighlightOptions {
    const { formatMessage, skipIDsBy } = this.options;

    return {
      formatMessage,
      skipIDsBy,
    };
  }

  public getOrderedHighlights(): Highlight[] {
    const highlights = Object.values(this.highlights);

    highlights.sort((a, b) => {
      return a.range.compareBoundaryPoints(Range.START_TO_START, b.range);
    });

    return highlights;
  }

  public getHighlightBefore(target: Highlight) {
    return this.getOrderedHighlights().filter((highlight) =>
      highlight.id !== target.id &&
      highlight.range.compareBoundaryPoints(Range.START_TO_START, target.range) < 0
    ).pop();
  }

  public getHighlightAfter(target: Highlight) {
    return this.getOrderedHighlights().filter((highlight) =>
      highlight.id !== target.id &&
      highlight.range.compareBoundaryPoints(Range.START_TO_START, target.range) >= 0
    ).shift();
  }

  public get document(): Document {
    if (!this.container.ownerDocument) {
      throw new Error('highlighter container is not mounted to a document!');
    }
    return this.container.ownerDocument;
  }

  private onMouseup = (ev: MouseEvent): void => {
    const selection = this.document.getSelection();

    if (!selection) {
      return;
    }

    if (selection.isCollapsed) {
      this.onClick(ev);
    } else {
      this.onSelect(selection);
    }
  }

  private onFocusHandler = (type: 'in' | 'out') => (ev: Event): void => {
    if (
      (type === 'in' && !this.options.onFocusIn)
      || (type === 'out' && !this.options.onFocusOut)
    ) {
      return;
    }

    const highlightId = isHtmlElement(ev.target) && ev.target.hasAttribute(DATA_SCREEN_READERS_ATTR)
      ? ev.target.getAttribute(DATA_ID_ATTR)
      : null;
    const highlight = highlightId ? this.getHighlight(highlightId) : null;

    if (type === 'in' && highlight) {
      this.options.onFocusIn!(highlight);
    }

    if (type === 'out' && highlight) {
      this.options.onFocusOut!(highlight);
    }
  }

  private onClick(event: MouseEvent): void {
    const { onClick } = this.options;
    let target: any = event.target;
    if (!onClick) { return; }

    if (dom(target).isHtmlElement) {
      target = dom(target);
      while (target.isHtmlElement) {
        if (target.el.getAttribute(DATA_ATTR)) {
          // there may be multiple highlighters active on the same document,
          // check if the found highlight is known to this instance
          const highlight = this.highlights[target.el.getAttribute(DATA_ID_ATTR)];
          if (highlight) {
            onClick(highlight, event);
            return;
          }
        }
        target = dom(target.el.parentElement);
      }
    }
    onClick(undefined, event);
  }

  private onSelect(selection: Selection): void {
    const { onSelect } = this.options;

    const range = snapSelection(selection, this.options);

    if (onSelect && range) {
      const highlights: Highlight[] = Object.values(this.highlights)
        .filter((other: Highlight) => other.intersects(range));

      if (highlights.length === 0) {
        const highlight: Highlight = new Highlight(
          range,
          { content: rangeContentsString(range) },
          this.getHighlightOptions()
        );
        onSelect(highlights, highlight);
      } else {
        onSelect(highlights);
      }
    }
  }
}
