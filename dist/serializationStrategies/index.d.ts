import Highlighter from '../Highlighter';
import * as TextPositionSelector from './TextPositionSelector';
import * as XpathRangeSelector from './XpathRangeSelector';
export declare type ISerializationData = XpathRangeSelector.IData | TextPositionSelector.IData;
export interface IDeserializer {
    isLoadable(highlighter: Highlighter): boolean;
    load(highlighter: Highlighter): Range;
}
export declare function getDeserializer(data: ISerializationData): IDeserializer;
