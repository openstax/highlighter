import Highlighter from '../Highlighter';
import * as TextPositionSelector from './TextPositionSelector';
import * as XpathRangeSelector from './XpathRangeSelector';
import * as XpathRangeSelectorV2 from './XpathRangeSelectorV2';

export type ISerializationData = XpathRangeSelector.IData | XpathRangeSelectorV2.IData | TextPositionSelector.IData;

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
    case XpathRangeSelectorV2.discriminator:
      return {
        isLoadable: (highlighter: Highlighter) => XpathRangeSelectorV2.isLoadable(highlighter, data),
        load: (highlighter: Highlighter) => XpathRangeSelectorV2.load(highlighter, data),
      };
    default:
      ((bad: never): null => {
        throw new Error(`not a valid serialization: ${JSON.stringify(bad)}`);
        return null;
      })(data);

      return {
        isLoadable: () => false,
        load: (highlighter) => highlighter.document.createRange(),
      };
  }
}
