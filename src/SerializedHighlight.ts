import Highlight, {IHighlightData} from './Highlight';
import Highlighter from './Highlighter';
import {getDeserializer, IDeserializer, ISerializationData} from './serializationStrategies';
import {serialize as defaultSerializer} from './serializationStrategies/XpathRangeSelector';

type IData = IHighlightData & ISerializationData;

export default class SerializedHighlight {
  public static defaultSerializer = defaultSerializer;

  private _data: IData;
  private deserializer: IDeserializer;

  constructor(data: IData) {
    this._data = data;
    this.deserializer = getDeserializer(data);
  }

  public get data(): IData {
    return this._data;
  }

  public get id(): string {
    return this.data.id;
  }

  public get content(): string {
    return this.data.content;
  }

  public isLoadable(highlighter: Highlighter): boolean {
    return this.deserializer.isLoadable(highlighter);
  }

  public load(highlighter: Highlighter): Highlight {
    const range = this.deserializer.load(highlighter);
    return new Highlight(range, this.data);
  }
}
