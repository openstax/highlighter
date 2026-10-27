import Highlight from './Highlight';
export declare const TIMESTAMP_ATTR = "data-timestamp";
export declare const DATA_ATTR = "data-highlighted";
export declare const DATA_ATTR_SELECTOR: string;
export declare const DATA_ID_ATTR = "data-highlight-id";
export declare const DATA_SCREEN_READERS_ATTR = "data-for-screenreaders";
export declare const DATA_SCREEN_READERS_ATTR_SELECTOR: string;
interface IOptions {
    id?: string;
    timestamp?: number;
    className?: string;
}
export default function injectHighlightWrappers(highlight: Highlight, options?: IOptions): void;
export {};
