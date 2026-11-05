/**
 * Utility functions to make DOM manipulation easier.
 */
export default function dom(el: any): {
    readonly el: any;
    /**
     * Adds class to element.
     * @param {string} className
     */
    addClass(className: any): void;
    /**
     * Removes class from element.
     * @param {string} className
     */
    removeClass(className: any): void;
    /**
     * Prepends child nodes to base element.
     * @param {Node[]} nodesToPrepend
     */
    prepend(nodesToPrepend: any): void;
    /**
     * Appends child nodes to base element.
     * @param {Node[]} nodesToAppend
     */
    append(nodesToAppend: any): void;
    /**
     * Inserts base element after refEl.
     * @param {Node} refEl - node after which base element will be inserted
     * @returns {Node} - inserted element
     */
    insertAfter(refEl: any): any;
    /**
     * Inserts base element before refEl.
     * @param {Node} refEl - node before which base element will be inserted
     * @returns {Node} - inserted element
     */
    insertBefore(refEl: any): any;
    /**
     * Removes base element from DOM.
     */
    remove(): void;
    /**
     * Returns true if base element contains given child.
     * @param {Node|HTMLElement} child
     * @returns {boolean}
     */
    contains(child: any): any;
    /**
     * Wraps base element in wrapper element.
     * @param {HTMLElement} wrapper
     * @returns {HTMLElement} wrapper element
     */
    wrap(wrapper: any): any;
    /**
     * Unwraps base element.
     * @returns {Node[]} - child nodes of unwrapped element.
     */
    unwrap(): any[];
    /**
     * Returns array of base element parents.
     * @returns {HTMLElement[]}
     */
    parents(): any[];
    /**
     * Normalizes text nodes within base element, ie. merges sibling text nodes and assures that every
     * element node has only one text node.
     * It should does the same as standard element.normalize, but IE implements it incorrectly.
     */
    normalizeTextNodes(): void;
    /**
     * Creates dom element from given html string.
     * @param {string} html
     * @returns {NodeList}
     */
    fromHTML(html: any): NodeListOf<ChildNode>;
    /**
     * Returns first range of the window of base element.
     * @returns {Range}
     */
    getRange(): any;
    /**
     * Removes all ranges of the window of base element.
     */
    removeAllRanges(): void;
    /**
     * Returns selection object of the window of base element.
     * @returns {Selection}
     */
    getSelection(): any;
    /**
     * Returns window of the base element.
     * @returns {Window}
     */
    getWindow(): any;
    /**
     * Returns document of the base element.
     * @returns {HTMLDocument}
     */
    getDocument(): any;
    matches(selector: any): any;
    isParent(node: any, options?: any): boolean;
    closest(selector: any): any;
    farthest(selector: any): any;
    readonly isHtmlElement: boolean;
};
export declare const isHtmlElement: (thing: any) => thing is HTMLElement;
