import Highlighter from '../../Highlighter';
export declare const discriminator = "TextPositionSelector";
export interface IData {
    type: 'TextPositionSelector';
    referenceElementId: string;
    start: number;
    end: number;
}
export declare function serialize(range: Range, referenceElement: HTMLElement): IData;
export declare function isLoadable(highlighter: Highlighter, data: IData): boolean;
export declare function load(highlighter: Highlighter, data: IData): Range;
