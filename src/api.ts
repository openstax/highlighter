import { NewHighlightColorEnum } from '../highlights-client';

export * from '../highlights-client';

export const styleIsColor = (style: string): style is NewHighlightColorEnum =>
  Object.values(NewHighlightColorEnum).includes(style);
