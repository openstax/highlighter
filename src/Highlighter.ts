import { debounce } from 'lodash';
import dom from './dom';
import Highlight, { FOCUS_CSS, IOptions as HighlightOptions } from './Highlight';
import injectHighlightWrappers, { DATA_ATTR, DATA_ID_ATTR } from './injectHighlightWrappers';
import { rangeContentsString } from './rangeContents';
import removeHighlightWrappers from './removeHighlightWrappers';
import { getRange, snapSelection } from './selection';
import SerializedHighlight from './SerializedHighlight';

export const ON_SELECT_DELAY = 300;

interface IOptions {
  snapTableRows?: boolean;
  snapMathJax?: boolean;
  snapWords?: boolean;
  className?: string;
  skipIDsBy?: RegExp;
  onClick?: (highlight: Highlight | undefined, event: MouseEvent) => void;
  onSelect?: (highlights: Highlight[], newHighlight?: Highlight) => void;
}

export default class Highlighter {
  public readonly container: HTMLElement;
  private highlights: { [key: string]: Highlight } = {};
  private options: IOptions;
  private previousRange: Range | null = null;

  constructor(container: HTMLElement, options: IOptions = {}) {
    this.container = container;
    this.options = {
      className: 'highlight',
      ...options,
    };
    this.debouncedOnSelect = debounce(this.onSelect, ON_SELECT_DELAY);
    this.container.addEventListener('click', this.onClickHandler);
    document.addEventListener('selectionchange', this.onSelectionChange);
    this.container.addEventListener('keyup', this.snapSelection);
    this.container.addEventListener('mouseup', this.snapSelection);
  }

  public unmount(): void {
    this.container.removeEventListener('click', this.onClickHandler);
    document.removeEventListener('selectionchange', this.onSelectionChange);
    this.container.removeEventListener('keyup', this.snapSelection);
    this.container.removeEventListener('mouseup', this.snapSelection);
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
    const { skipIDsBy } = this.options;

    return {
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

  private snapSelection = () => {
    const selection = this.document.getSelection();

    if (!selection || selection.isCollapsed) {
      return;
    }

    return snapSelection(selection, this.options);
  }

  // Created in the constructor
  private debouncedOnSelect: () => void = () => undefined;

  private onSelectionChange = (): void => {
    const selection = this.document.getSelection();

    if (
      !selection
      || selection.isCollapsed
      || selection.type === 'None'
      || !dom(this.container).contains(selection.anchorNode)
      || !dom(this.container).contains(selection.focusNode)
      || this.compareRanges(selection ? getRange(selection) : null, this.previousRange)
    ) {
      return;
    }

    this.debouncedOnSelect();
  }

  private onClickHandler = (event: MouseEvent): void => {
    this.onClick(event);
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

  private onSelect = (): void => {
    const { onSelect } = this.options;

    const selection = document.getSelection();
    if (!selection) {
      return;
    }

    const range = this.snapSelection();
    this.previousRange = range || null;

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

  private compareRanges(range1: Range | null, range2: Range | null): boolean {
    if (range1 === null && range2 === null) { return true; }
    if (range1 === null && range2) { return false; }
    if (range2 === null && range1) { return false; }
    return range1!.compareBoundaryPoints(Range.START_TO_START, range2!) === 0
      && range1!.compareBoundaryPoints(Range.END_TO_END, range2!) === 0;
  }
}
