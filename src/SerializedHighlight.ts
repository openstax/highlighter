import Highlight from './Highlight';
import Highlighter from './Highlighter';
import {ISerializationData, serializers} from './serializationStrategies';

interface ICommon {
  id: string;
  content: string;
}

type IData = ICommon & ISerializationData;

export default class SerializedHighlight {
  public static defaultSerializer = serializers.TextPositionSelector.serialize;

  private _data: IData;

  constructor(data: IData) {
    this._data = data;
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

    // TODO - this approach is total garbage, find a better way.
    // it would be nice to do serializers[this.data.type].isLoadable
    // but typescript can't figure it out
    return this.data.type === serializers.XpathRangeSelector.discriminator
        ? serializers.XpathRangeSelector.isLoadable(highlighter, this.data)
      : this.data.type === serializers.TextPositionSelector.discriminator
        ? serializers.TextPositionSelector.isLoadable(highlighter, this.data)
      : ((data: never): null => {
        console.warn('not a valid serialization', data);
        return null;
      })(this.data);
  }

  public load(highlighter: Highlighter): Highlight {

    // TODO - this approach is total garbage, find a better way.
    // it would be nice to do serializers[this.data.type].load
    // but typescript can't figure it out
    const range = this.data.type === serializers.XpathRangeSelector.discriminator
        ? serializers.XpathRangeSelector.load(highlighter, this.data)
      : this.data.type === serializers.TextPositionSelector.discriminator
        ? serializers.TextPositionSelector.load(highlighter, this.data)
      : ((data: never): null => {
        console.warn('not a valid serialization', data);
        return null;
      })(this.data);

    return new Highlight(this.id, range, this.content);
  }
}
