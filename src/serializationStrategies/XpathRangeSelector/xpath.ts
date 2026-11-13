// tslint:disable
import { DATA_ATTR, DATA_SCREEN_READERS_ATTR } from '../../injectHighlightWrappers';

type Nullable<T> = T | null | undefined;

const findNonTextChild = (node: Node) => Array.prototype.find.call(node.childNodes,
  (node: Node) => node.nodeType === Node.ELEMENT_NODE && !isTextHighlightOrScreenReaderNode(node)
);
const isHighlight = (node: Nullable<Node>): node is HTMLElement => !!node && (node as Element).getAttribute && (node as Element).getAttribute(DATA_ATTR) !== null;
const isHighlightOrScreenReaderNode = (node: Nullable<Node>) => isHighlight(node) || isScreenReaderNode(node);
const isTextHighlight = (node: Nullable<Node>): node is HTMLElement => isHighlight(node) && !findNonTextChild(node);
const isTextHighlightOrScreenReaderNode = (node: Nullable<Node>): node is HTMLElement => (isHighlight(node) || isScreenReaderNode(node)) && !findNonTextChild(node);
const isText = (node: Nullable<Node>): node is Text => !!node && node.nodeType === 3;
const isTextOrTextHighlight  = (node: Nullable<Node>): node is Text | HTMLElement => isText(node) || isTextHighlight(node);
const isTextOrTextHighlightOrScreenReaderNode = (node: Nullable<Node | HTMLElement>) => isText(node) || isTextHighlightOrScreenReaderNode(node) || isScreenReaderNode(node);
const isElement = (node: Node): node is HTMLElement => node && node.nodeType === 1;
const isElementNotHighlight = (node: Node) => isElement(node) && !isHighlight(node);
const nodeIndex = (list: NodeList, element: Node) => Array.prototype.indexOf.call(list, element);
const isScreenReaderNode = (node: Nullable<Node>): node is HTMLElement => !!node && isElement(node) && node.getAttribute(DATA_SCREEN_READERS_ATTR) !== null;

const IS_PATH_PART_SELF = /^\.$/;
const IS_PATH_PART_TEXT = /^text\(\)\[(\d+)\]$/;
const IS_PATH_PART_ELEMENT = /\*\[name\(\)='(.+)'\]\[(\d+)\]/;

type MeasureTextLength = (node: Node) => number;

/**
 * Returns the length of the text a reader sees in this node, which leaves out screen reader labels.
 * XpathRangeSelectorV2 counts text offsets this way, because the labels change with what is on the page
 * (search results, which highlight is focused, highlight colors).
 */
export const getVisibleTextLength = (node: Node): number => {
  if (isScreenReaderNode(node)) {
    return 0;
  } else if (isText(node)) {
    return node.length;
  } else {
    return Array.from(node.childNodes).reduce((length, child) => length + getVisibleTextLength(child), 0);
  }
};

/**
 * Returns the length of all text in this node, including screen reader labels. XpathRangeSelector counts text
 * offsets this way.
 */
export const getTextLengthCountingScreenReaderText = (node: Node) => (node.textContent || '').length;

/**
 * Returns the text node inside a highlight that holds the given offset, and the offset into that text node.
 * The offset counts only text a reader sees, so screen reader labels are skipped.
 */
const findVisibleTextInHighlight = (highlight: Node, offset: number): [Node | null, number] => {
  for (const child of Array.from(highlight.childNodes)) {
    if (isScreenReaderNode(child)) {
      continue;
    }
    const length = getVisibleTextLength(child);
    if (offset <= length) {
      return isText(child) ? [child, offset] : findVisibleTextInHighlight(child, offset);
    }
    offset -= length;
  }
  return [null, offset];
};

const getMaxOffset = (node: Node) => {
  if (isText(node)) {
    return node.length;
  } else {
    return node.childNodes.length;
  }
};

const recurseBackwardsThroughText = (current: Node, container: Node, resultOffset: number, getTextLength: MeasureTextLength): [Node, number] => {
  // we don't count the current, we count the previous
  const previous = current.previousSibling;

  if (previous && isTextOrTextHighlightOrScreenReaderNode(previous)) {
    return recurseBackwardsThroughText(previous, container, resultOffset + getTextLength(previous), getTextLength);
  } else if (current.parentNode && isTextHighlightOrScreenReaderNode(current.parentNode)) {
    return recurseBackwardsThroughText(current.parentNode, container, resultOffset, getTextLength);
  } else {
    return [current, resultOffset];
  }
};

const resolveTextHighlightsToTextOffset = (element: Node, offset: number, container: Node, getTextLength: MeasureTextLength): [Node, number] => {
  // this won't catch things that are right at the tail of the container, which is good, because we
  // want to contiue using element offset if possible
  if (isElement(element) && isTextOrTextHighlightOrScreenReaderNode(element.childNodes[offset])) {
    return recurseBackwardsThroughText(element.childNodes[offset], container, 0, getTextLength);
    // however, if the element, is a highlgiht, then we should float
  } else if (isTextHighlightOrScreenReaderNode(element)) {
    return recurseBackwardsThroughText(element, container, getTextLength(element), getTextLength);
    // preserve the offset if the elment is text
  } else if (isText(element)) {
    return recurseBackwardsThroughText(element, container, offset, getTextLength);
  } else {
    return [element, offset];
  }
};

const floatThroughText = (element: Node, offset: number, container: Node): [Node, number] => {
  if (isTextOrTextHighlightOrScreenReaderNode(element) && offset === 0 && element.parentNode && element.parentNode !== container) {
    return floatThroughText(element.parentNode, nodeIndex(element.parentNode.childNodes, element), container);
  } else if (isTextOrTextHighlightOrScreenReaderNode(element) && offset === getMaxOffset(element) && element.parentNode && element.parentNode !== container) {
    return floatThroughText(element.parentNode, nodeIndex(element.parentNode.childNodes, element) + 1, container);
  } else if (
    isTextOrTextHighlight(element)
    && (offset + 1) === getMaxOffset(element)
    && isElement(element.childNodes[offset])
    && isScreenReaderNode(element.childNodes[offset])
    && element.parentNode
    && element.parentNode !== container
  ) {
    return floatThroughText(element.parentNode, nodeIndex(element.parentNode.childNodes, element) + 1, container);
  } else {
    return [element, offset];
  }
};

const resolveToNextElementOffsetIfPossible = (element: Node, offset: number) => {
  if (isTextOrTextHighlightOrScreenReaderNode(element) && element.parentNode && offset === getMaxOffset(element) && (!element.nextSibling || !isHighlightOrScreenReaderNode(element.nextSibling))) {
    return [element.parentNode, nodeIndex(element.parentNode.childNodes, element) + 1] as const;
  }

  return [element, offset] as const;
};

const resolveToPreviousElementOffsetIfPossible = (element: Node, offset: number) => {

  if (isTextOrTextHighlightOrScreenReaderNode(element) && element.parentNode && offset === 0 && (!element.previousSibling || !isHighlightOrScreenReaderNode(element.previousSibling))) {
    return [element.parentNode, nodeIndex(element.parentNode.childNodes, element)] as const;
  }

  return [element, offset] as const;
};

// kinda copied from https://developer.mozilla.org/en-US/docs/Web/XPath/Snippets#getXPathForElement
export function getXPathForElement(
  targetElement: Node,
  offset: number,
  reference: HTMLElement,
  getTextLength: MeasureTextLength = getVisibleTextLength
): [string, number] {
  [targetElement, offset] = floatThroughText(targetElement, offset, reference);
  [targetElement, offset] = resolveToNextElementOffsetIfPossible(targetElement, offset);
  [targetElement, offset] = resolveTextHighlightsToTextOffset(targetElement, offset, reference, getTextLength);
  [targetElement, offset] = resolveToPreviousElementOffsetIfPossible(targetElement, offset);

  let xpath = '';
  let pos
    , element = targetElement.previousSibling!
    , focus = targetElement;

  // for element targets, highlight children might be artifically
  // inflating the range offset, fix.
  if (isElement(focus)) {
    let search: Node | null = focus.childNodes[offset - 1];

    while (search) {
      if (isTextOrTextHighlight(search)) {
        search = search.previousSibling;

        while (isTextOrTextHighlight(search!)) {
          offset--;
          search = search!.previousSibling;
        }
      }
      search = search ? search.previousSibling : null;
    }
  }

  while (focus !== reference) {
    pos = 1;

    while (element) {
      // highlights in text change the number of nodes in the nodelist,
      // compensate by gobbling adjacent highlights and text
      if (isTextOrTextHighlightOrScreenReaderNode(focus) && isTextOrTextHighlightOrScreenReaderNode(element)) {
        while (isTextOrTextHighlightOrScreenReaderNode(element)) {
          element = element.previousSibling!;
        }
        pos += 1;
      } else {
        if (isElementNotHighlight(focus) && isElementNotHighlight(element) && (element as Node).nodeName === (focus as Node).nodeName) {
          pos += 1;
        }
        element = element.previousSibling!;
      }
    }

    if (isText(focus) || isTextHighlightOrScreenReaderNode(focus)) {
      xpath = 'text()[' + pos + ']' + '/' + xpath;
    } else if (!isHighlightOrScreenReaderNode(focus)) {
      xpath = '*[name()=\'' + focus.nodeName.toLowerCase() + '\'][' + pos + ']' + '/' + xpath;
    }

    focus = focus.parentNode!;
    element = focus.previousSibling!;
  }

  xpath = './' + xpath;
  xpath = xpath.replace(/\/$/, '');
  return [xpath, offset];
}

export function getFirstByXPath(
  path: string,
  offset: number,
  referenceElement: HTMLElement,
  getTextLength: MeasureTextLength = getVisibleTextLength,
  findTextInsideHighlights = true
): [HTMLElement | null, number] {
  const parts = path.split('/');

  let node: HTMLElement | null = referenceElement;
  let part = parts.shift();

  while (node && part) {
    node = followPart(node, part);
    part = parts.shift();
  }

  // the part following is greedy, so walk back to the first matching
  // textish node before computing offset
  while (isTextOrTextHighlightOrScreenReaderNode(node!) && isTextOrTextHighlightOrScreenReaderNode(node!.previousSibling!)) {
    node = node!.previousSibling as HTMLElement;
  }
  // highligts split up text nodes that should be treated as one, iterate through
  // until we find the text node that the offset specifies, modifying the offset
  // as we go. prefer leaving highlights if we have the option to deal with
  // adjacent highlights.
  while ((isTextHighlightOrScreenReaderNode(node!) && offset >= getTextLength(node!)) || (isText(node!) && offset > getTextLength(node!))) {
    offset -= getTextLength(node!);
    node = isTextOrTextHighlightOrScreenReaderNode(node!.nextSibling!) ? node!.nextSibling as HTMLElement : null;
  }

  // The point is inside another highlight, such as a search result drawn after this location was saved.
  // XpathRangeSelector turns this off and keeps returning null here as it always has.
  if (node && isTextHighlight(node) && findTextInsideHighlights) {
    [node, offset] = findVisibleTextInHighlight(node, offset) as [HTMLElement | null, number];
  }

  // for element targets, highlight children might be artifically
  // inflating the range offset, fix.
  if (node && isElement(node)) {
    let search: Node | null = node.childNodes[0];
    let offsetElementsFound = 0;
    let modifyOffset = 0;

    while (search && offsetElementsFound < offset) {
      offsetElementsFound++;

      if (isTextOrTextHighlightOrScreenReaderNode(search)) {
        search = search.nextSibling;

        while (isTextOrTextHighlightOrScreenReaderNode(search)) {
          modifyOffset++;
          search = search!.nextSibling;
        }
      } else {
        search = search.nextSibling;
      }
    }

    offset+=modifyOffset;
  }

  if (node && isHighlightOrScreenReaderNode(node)) {
    node = null;
  }

  if (isElement(node!) && (node as Node).childNodes.length < offset) {
    node = null;
  }

  return [node, offset];
}

function followPart(node: Node, part: string) {

  const findFirst = (nodeList: NodeList, predicate: (node: Node) => boolean) =>
    Array.prototype.find.call(nodeList, (node: Node) => predicate(node));
  const findFirstAfter = (nodeList: NodeList, afterThis: Node, predicate: (node: Node) => boolean) => findFirst(
    Array.prototype.slice.call(nodeList, Array.prototype.indexOf.call(nodeList, afterThis) + 1) as unknown as NodeList,
    predicate
  );

  if (IS_PATH_PART_SELF.test(part)) {
    return node;
  }
  if (IS_PATH_PART_TEXT.test(part)) {
    let [, index] = part.match(IS_PATH_PART_TEXT) as any;
    let text = findFirst(node.childNodes, isTextOrTextHighlightOrScreenReaderNode);

    while (text && index > 1) {
      let search = text;

      while (isTextOrTextHighlightOrScreenReaderNode(search)) {
        search = search.nextSibling;
      }

      index--;

      if (search) {
        text = findFirstAfter(node.childNodes, search, isTextOrTextHighlightOrScreenReaderNode);
      } else {
        text = search;
      }

    }

    return text;
  }
  if (IS_PATH_PART_ELEMENT.test(part)) {
    let [, type, index] = part.match(IS_PATH_PART_ELEMENT) as any;
    const nodeMatches = (node: Node) => isElement(node) && node.nodeName.toLowerCase() === type.toLowerCase() && !isHighlightOrScreenReaderNode(node);
    let element = findFirst(node.childNodes, nodeMatches);

    while (element && index > 1) {
      index--;
      element = findFirstAfter(node.childNodes, element, nodeMatches);
    }

    return element;
  }
}
