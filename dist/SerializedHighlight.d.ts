import { Highlight as ApiHighlight, NewHighlight as NewApiHighlight } from './api';
import Highlight, { IHighlightData } from './Highlight';
import Highlighter from './Highlighter';
import { ISerializationData } from './serializationStrategies';
import { serialize as defaultSerializer } from './serializationStrategies/XpathRangeSelector';
declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
interface IOptionalApiData {
    annotation?: string;
}
declare type IData = IHighlightData & ISerializationData & IOptionalApiData;
export default class SerializedHighlight {
    readonly data: IData;
    readonly id: string;
    readonly content: string;
    static defaultSerializer: typeof defaultSerializer;
    static fromApiResponse(highlight: ApiHighlight): SerializedHighlight;
    private _data;
    private deserializer;
    constructor(data: IData & {
        [key: string]: any;
    });
    getApiPayload(highlighter: Highlighter, highlight: Highlight): Omit<NewApiHighlight, 'sourceType' | 'sourceId'> & {
        id: string;
    };
    isLoadable(highlighter: Highlighter): boolean;
    load(highlighter: Highlighter): Highlight;
}
export {};
