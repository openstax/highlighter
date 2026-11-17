import Highlighter from '../../Highlighter';
export declare const discriminator = "XpathRangeSelector";
export interface IData {
    type: 'XpathRangeSelector';
    referenceElementId: string;
    startContainer: string;
    startOffset: number;
    endContainer: string;
    endOffset: number;
}
export declare function serialize(range: Range, referenceElement: HTMLElement): IData;
export declare function isLoadable(highlighter: Highlighter, data: IData): boolean;
export declare function load(highlighter: Highlighter, data: IData): Range;
