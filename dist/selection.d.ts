export declare const getRange: (selection: Selection) => Range;
interface IOptions {
    snapTableRows?: boolean;
    snapMathJax?: boolean;
    snapWords?: boolean;
    snapCode?: boolean;
}
export declare const snapSelection: (selection: Selection, options: IOptions) => Range | undefined;
export {};
