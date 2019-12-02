import { NewHighlightColorEnum } from '@openstax/highlights-client';

export * from '@openstax/highlights-client';

export const styleIsColor = (style: string): style is NewHighlightColorEnum =>
  Object.values(NewHighlightColorEnum).includes(style);
