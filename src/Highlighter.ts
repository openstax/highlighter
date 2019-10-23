import Highlight, {FOCUS_CSS} from './Highlight';
import injectHighlightWrappers from './injectHighlightWrappers';
import {rangeContentsString} from './rangeContents';
import removeHighlightWrappers from './removeHighlightWrappers';
import {getRange, snapSelection} from './selection';
import SerializedHighlight from './SerializedHighlight';

interface IOptions {
  snapTableRows?: boolean;
  snapMathJax?: boolean;
  snapWords?: boolean;
  className?: string;
  onClick?: (highlight?: Highlight) => void;
  onSelect?: (highlights: Highlight[], newHighlight?: Highlight) => void;
}

export default class Highlighter {
  public readonly container: HTMLElement;
  private highlights: {[key: string]: Highlight} = {};
  private options: IOptions;

  constructor(container: HTMLElement, options: IOptions = {}) {
    this.container = container;
    this.options = {
      className: 'highlight',
      ...options,
    };
    this.container.addEventListener('mouseup', this.onMouseup);
  }

  public unmount(): void {
    this.container.removeEventListener('mouseup', this.onMouseup);
  }

  public eraseAll = (): void => {
    this.getHighlights().forEach(this.erase);
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

  public getOrderedHighlights(): Highlight[] {
    const highlights = Object.values(this.highlights);

    highlights.sort((a, b) => {
      return a.range.compareBoundaryPoints(Range.START_TO_START, b.range);
    });

    return highlights;
  }

  public get document(): Document {
    if (!this.container.ownerDocument) {
      throw new Error('highlighter container is not mounted to a document!');
    }
    return this.container.ownerDocument;
  }

  private onMouseup = (): void => {
    const selection = this.document.getSelection();

    if (!selection) {
      return;
    }

    if (selection.isCollapsed) {
      this.onClick(selection);
    } else {
      this.onSelect(selection);
    }
  }

  private onClick(selection: Selection): void {
    const {onClick} = this.options;

    const clickedHighlight = (): Highlight | undefined => {
      if (selection.rangeCount < 1) {
        return;
      }
      const range: Range = getRange(selection);
      return Object.values(this.highlights)
        .find((other: Highlight) => other.intersects(range));
    };

    if (onClick) {
      onClick(clickedHighlight());
    }
  }

  private onSelect(selection: Selection): void {
    const {onSelect} = this.options;

    const range = snapSelection(selection, this.options);

    if (onSelect && range) {
      const highlights: Highlight[] = Object.values(this.highlights)
        .filter((other: Highlight) => other.intersects(range));

      if (highlights.length === 0) {
        const highlight: Highlight = new Highlight(range, {content: rangeContentsString(range)});
        onSelect(highlights, highlight);
      } else {
        onSelect(highlights);
      }
    }
  }
}
