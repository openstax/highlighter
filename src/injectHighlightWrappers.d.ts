import Highlight from './Highlight';

export const TIMESTAMP_ATTR = 'data-timestamp';
export const DATA_ATTR = 'data-highlighted';

interface IOptions {
  id?: string;
  timestamp?: number;
  className?: string;
}

declare const injectHighlightWrappers: (highlight: Highlight, options?: IOptions) => void;

export default injectHighlightWrappers;
