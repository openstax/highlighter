import Highlight from './Highlight';
import injectHighlightWrappers from './injectHighlightWrappers';
import {rangeContentsString} from './rangeContents';
import {getRange, snapSelection} from './selection';

interface IOptions {
  snapTableRows?: boolean;
  snapMathJax?: boolean;
  snapWords?: boolean;
  className?: string;
  onClick?: (highlight?: Highlight) => void;
  onSelect?: (highlights: Highlight[], newHighlight: Highlight) => void;
}

export default class Highlighter {
  private container: HTMLElement;
  private highlights: Highlight[] = [];
  private options: IOptions;

  constructor(container: HTMLElement, options: IOptions = {}) {
    this.container = container;
    this.options = options;
  }

  public mount(): void {
    this.container.addEventListener('mouseup', this.onMouseup);

  }

  public unmount(): void {
    this.container.removeEventListener('mouseup', this.onMouseup);
  }

  public highlight(highlight: Highlight): void {
    this.highlights.push(highlight);
    injectHighlightWrappers(highlight, this.options);
  }

  public getReferenceElement(id: string): HTMLElement {
    return this.container.querySelector(`#${id}`);
  }

  private onMouseup(): void {
    const selection = this.container.ownerDocument.getSelection();

    if (selection.isCollapsed) {
      this.onClick(selection);
    } else {
      this.onSelect(selection);
    }
  }

  private onClick(selection: Selection): void {
    const {onClick} = this.options;

    if (onClick) {
      const range: Range = getRange(selection);
      const highlight: Highlight = this.highlights.find((other: Highlight) => other.intersects(range));
      onClick(highlight);
    }
  }

  private onSelect(selection: Selection): void {
    const {onSelect} = this.options;

    snapSelection(selection, this.options);

    if (onSelect) {
      const range: Range = getRange(selection);
      const highlights: Highlight[] = this.highlights.filter((other: Highlight) => other.intersects(range));
      const highlight: Highlight = new Highlight(range, rangeContentsString(range));
      onSelect(highlights, highlight);
    }
  }
}
