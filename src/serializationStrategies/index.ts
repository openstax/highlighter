import * as TextPositionSelector from './TextPositionSelector';
import * as XpathRangeSelector from './XpathRangeSelector';

export type ISerializationData = XpathRangeSelector.IData | TextPositionSelector.IData;

export const serializers = {
  [TextPositionSelector.discriminator]: TextPositionSelector,
  [XpathRangeSelector.discriminator]: XpathRangeSelector,
};
