import Highlighter from '../Highlighter';
import * as TextPositionSelector from './TextPositionSelector';
import * as XpathRangeSelector from './XpathRangeSelector';

export type ISerializationData = XpathRangeSelector.IData | TextPositionSelector.IData;

export interface IDeserializer {
  isLoadable(highlighter: Highlighter): boolean;
  load(highlighter: Highlighter): Range;
}

export function getDeserializer(data: ISerializationData): IDeserializer {
  switch (data.type) {
    case TextPositionSelector.discriminator:
      return {
        isLoadable: (highlighter: Highlighter) => TextPositionSelector.isLoadable(highlighter, data),
        load: (highlighter: Highlighter) => TextPositionSelector.load(highlighter, data),
      };
    case XpathRangeSelector.discriminator:
      return {
        isLoadable: (highlighter: Highlighter) => XpathRangeSelector.isLoadable(highlighter, data),
        load: (highlighter: Highlighter) => XpathRangeSelector.load(highlighter, data),
      };
    default:
      ((bad: never): null => {
        console.warn('not a valid serialization', bad);
        return null;
      })(data);

      return {
        isLoadable: () => false,
        load: (highlighter) => highlighter.document.createRange(),
      };
  }
}
