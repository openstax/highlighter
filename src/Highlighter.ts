export default class Highlighter {
  container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  mount() {
  }

  unmount() {
  }

  loadHighlights(highlights: any) {
  }

  getReferenceElement(id: string): HTMLElement {
    return this.container.querySelector(`#${id}`);
  }
}
