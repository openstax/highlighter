import {camelCase, snakeCase} from 'change-case';
import {Highlight as ApiHighlight, NewHighlight as NewApiHighlight, styleIsColor } from './api';
import Highlight, {IHighlightData} from './Highlight';
import Highlighter from './Highlighter';
import {getDeserializer, IDeserializer, ISerializationData} from './serializationStrategies';
import {serialize as defaultSerializer} from './serializationStrategies/XpathRangeSelector';

const mapKeys = (transform: (key: string) => string, obj: {[key: string]: any}) => Object.keys(obj).reduce((result, key) => ({
  ...result, [transform(key)]: obj[key],
}), {});

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

interface IOptionalApiData {
  annotation?: string;
}
type IData = IHighlightData & ISerializationData & IOptionalApiData;

export default class SerializedHighlight {

  public get data(): IData {
    return this._data;
  }

  public get id(): string {
    return this.data.id;
  }

  public get content(): string {
    return this.data.content;
  }
  public static defaultSerializer = defaultSerializer;

  /*
   * when (if?) tutor starts using the api, remove this method and
   * pull these property names down through the rest of the logic
   *
   * TODO - support more better api interaction when above
   * refactor happens:
   *   - loop over locationStrategies and pick the best one instead of
   *     the first one
   *   - use location strategy bindings instead of arbitrary mapKeys
   *     or revise swagger definition to properly use oneOf so that it
   *     does it automatically
   */
  public static fromApiResponse(highlight: ApiHighlight) {

    if (!highlight.locationStrategies) {
      throw new Error('highlight with no location strategies');
    }
    if (!highlight.highlightedContent) {
      throw new Error('highlight with no location strategies');
    }
    if (!highlight.anchor) {
      throw new Error('highlight with no location strategies');
    }

    return new SerializedHighlight({
      ...mapKeys(camelCase, highlight.locationStrategies[0]) as ISerializationData,
      annotation: highlight.annotation,
      content: highlight.highlightedContent,
      id: highlight.id,
      referenceElementId: highlight.anchor,
      style: highlight.color,
    });
  }

  private _data: IData;
  private deserializer: IDeserializer;

  constructor(data: IData & {[key: string]: any}) {
    this._data = data;
    this.deserializer = getDeserializer(data);
  }

  /*
   * when (if?) tutor starts using the api, rename these fields in the rest of the code
   * so that less mapping is necessary
   */
  public getApiPayload(highlighter: Highlighter, highlight: Highlight): Omit<NewApiHighlight, 'sourceType' | 'sourceId'> & {id: string} {
    const {id, content, style, annotation, referenceElementId, ...serializationData} = this.data;

    const prevHighlight = highlighter.getHighlightBefore(highlight);
    const nextHighlight = highlighter.getHighlightAfter(highlight);

    if (!style) {
      throw new Error('a style is requred to create an api payload');
    }
    if (!styleIsColor(style)) {
      throw new Error(`style ${style} doesn't match an api color`);
    }

    return {
      anchor: referenceElementId,
      annotation,
      color: style,
      highlightedContent: content,
      id,
      locationStrategies: [mapKeys(snakeCase, serializationData)],
      nextHighlightId: nextHighlight && nextHighlight.id,
      prevHighlightId: prevHighlight && prevHighlight.id,

    };
  }

  public isLoadable(highlighter: Highlighter): boolean {
    return this.deserializer.isLoadable(highlighter);
  }

  public load(highlighter: Highlighter): Highlight {
    const range = this.deserializer.load(highlighter);
    return new Highlight(range, this.data);
  }
}
