import Highlight, { IHighlightData, IOptions as HighlightOptions } from './Highlight';
import SerializedHighlight from './SerializedHighlight';
export declare const ON_SELECT_DELAY = 300;
interface IOptions {
    snapCode?: boolean;
    snapTableRows?: boolean;
    snapMathJax?: boolean;
    snapWords?: boolean;
    className?: string;
    skipIDsBy?: RegExp;
    formatMessage: (descriptor: {
        id: string;
    }, values: {
        style: IHighlightData['style'];
    }) => string;
    onClick?: (highlight: Highlight | undefined, event: MouseEvent) => void;
    onSelect?: (highlights: Highlight[], newHighlight?: Highlight) => void;
    onFocusIn?: (highlight: Highlight) => void;
    onFocusOut?: (highlight: Highlight) => void;
    tabbable?: boolean;
}
export default class Highlighter {
    readonly container: HTMLElement;
    private highlights;
    private options;
    private previousRange;
    private focusInHandler;
    private focusOutHandler;
    constructor(container: HTMLElement, options: IOptions);
    unmount(): void;
    eraseAll: () => void;
    teardown: () => void;
    erase: (highlight: Highlight) => void;
    highlight(highlight?: Highlight | SerializedHighlight): void;
    getHighlight(id: string): Highlight | undefined;
    getReferenceElement(id: string): HTMLElement | null;
    getHighlightFromElement(el: Element): Highlight | null | undefined;
    clearFocusedStyles(): void;
    getHighlights(): Highlight[];
    getHighlightOptions(): HighlightOptions;
    getOrderedHighlights(): Highlight[];
    getHighlightBefore(target: Highlight): Highlight | undefined;
    getHighlightAfter(target: Highlight): Highlight | undefined;
    readonly document: Document;
    setSnapValues(value: boolean): void;
    private snapSelection;
    private debouncedSnapSelection;
    private debouncedOnSelect;
    private onSelectionChange;
    private onClickHandler;
    private onFocusHandler;
    private onClick;
    private onSelect;
    private compareRanges;
}
export {};
