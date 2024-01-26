import SerializedHighlight from './SerializedHighlight';
export declare const FOCUS_CSS = "focus";
export interface IHighlightData {
    style?: string;
    id: string;
    content: string;
}
export interface IOptions {
    skipIDsBy?: RegExp;
    formatMessage: (descriptor: {
        id: string;
    }, values: {
        style: IHighlightData['style'];
    }) => string;
}
export default class Highlight {
    readonly id: string;
    readonly content: string;
    elements: HTMLElement[];
    readonly range: Range;
    readonly options: IOptions;
    private data;
    private _elements;
    constructor(range: Range, data: Pick<IHighlightData, Exclude<keyof IHighlightData, 'id'>> & Partial<Pick<IHighlightData, 'id'>>, options: IOptions);
    getMessage(id: string): string;
    setStyle(style: string): void;
    getStyle(): string | undefined;
    removeStyle(): void;
    isAttached(): boolean;
    scrollTo(handler?: (elements: HTMLElement[]) => void): Highlight;
    /**
     * Add class 'focus' to all elements of this highlight.
     */
    addFocusedStyles(): Highlight;
    /**
     * Move focus to the first element of this highlight.
     * @return boolean indicating if the action was a success.
     */
    focus(): boolean;
    intersects(range: Range): boolean;
    serialize(referenceElement?: HTMLElement): SerializedHighlight;
    private loadStyle;
    private checkReferenceElement;
    private getValidReferenceElement;
}
