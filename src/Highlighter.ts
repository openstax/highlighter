import {injectHighlightWrappers} from './highlightUtils';
import Highlight from './Highlight';

interface options {
  className?: string
}

export default class Highlighter {
  container: HTMLElement;
  highlights: Highlight[] = [];
  options: options;

  constructor(container: HTMLElement, options: options = {}) {
    this.container = container;
    this.options = options;
  }

  mount(): void {
  }

  unmount(): void {
  }

  highlight(highlight: Highlight): void {
    this.highlights.push(highlight);
    injectHighlightWrappers(highlight, this.options);
  }

  getReferenceElement(id: string): HTMLElement {
    return this.container.querySelector(`#${id}`);
  }
}
