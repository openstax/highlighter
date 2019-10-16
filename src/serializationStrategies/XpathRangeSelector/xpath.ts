// tslint:disable
import {DATA_ATTR} from '../../injectHighlightWrappers';

const findNonTextChild = (node: Node) => Array.prototype.find.call(node.childNodes,
  (node: Node) => node.nodeType === Node.ELEMENT_NODE && !isTextHighlight(node)
);
const isHighlight = (node: Node): node is HTMLElement => node && (node as Element).getAttribute && (node as Element).getAttribute(DATA_ATTR) !== null;
const isTextHighlight = (node: Node): node is HTMLElement => isHighlight(node) && !findNonTextChild(node);
const isText = (node: Node): node is Text => node && node.nodeType === 3;
const isTextOrTextHighlight = (node: Node | HTMLElement) => isText(node) || isTextHighlight(node);
const isElement = (node: Node): node is HTMLElement => node && node.nodeType === 1;
const isElementNotHighlight = (node: Node) => isElement(node) && !isHighlight(node);

const IS_PATH_PART_SELF = /^\.$/;
const IS_PATH_PART_TEXT = /^text\(\)\[(\d+)\]$/;
const IS_PATH_PART_ELEMENT = /\*\[name\(\)='(.+)'\]\[(\d+)\]/;

// kinda copied from https://developer.mozilla.org/en-US/docs/Web/XPath/Snippets#getXPathForElement
export function getXPathForElement(targetElement: Node, offset: number, reference: HTMLElement): [string, number] {

  // if the range offset designates text or a text highlight we need to move the target
  // so text offset stuff will work
  if (isElement(targetElement) && isTextOrTextHighlight(targetElement.childNodes[offset])) {
    targetElement = targetElement.childNodes[offset];
    offset = 0;
  }

  let xpath = '';
  let pos
    , element = targetElement.previousSibling!
    , focus = targetElement;

  // for a text target, highlights might have broken up the text node,
  // look for preceeding nodes that need to be combined into this one
  // and modify the range offset accordingly. only have to look at one
  // previous sibling because text nodes cannot be siblings
  if (isText(focus) && isTextHighlight(element)) {
    while (isText(element) || isTextHighlight(element)) {
      offset += element.textContent!.length;
      element = element.previousSibling!;
    }
  // if target is text highlight, treat it like its text
  } else if (isTextHighlight(focus) && isTextOrTextHighlight(element)) {
    offset = 0;

    while (isText(element) || isTextHighlight(element)) {
      offset += element.textContent!.length;
      element = element.previousSibling!;
    }
  // for element targets, highlight children might be artifically
  // inflating the range offset, fix.
  } else if (isElement(focus)) {
    let search: Node | null = focus.childNodes[offset];

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
      if (isTextOrTextHighlight(focus) && isTextOrTextHighlight(element)) {
        while (isTextOrTextHighlight(element)) {
          element = element.previousSibling!;
        }
        pos += 1;
      } else {
        if (isElementNotHighlight(focus) && isElementNotHighlight(element) && element.nodeName === focus.nodeName) {
          pos += 1;
        }
        element = element.previousSibling!;
      }
    }

    if (isText(focus) || isTextHighlight(focus)) {
      xpath = 'text()[' + pos + ']' + '/' + xpath;
    } else if (!isHighlight(focus)) {
      xpath = '*[name()=\'' + focus.nodeName.toLowerCase() + '\'][' + pos + ']' + '/' + xpath;
    }

    focus = focus.parentNode!;
    element = focus.previousSibling!;
  }

  xpath = './' + xpath;
  xpath = xpath.replace(/\/$/, '');
  return [xpath, offset];
}

export function getFirstByXPath(path: string, offset: number, referenceElement: HTMLElement): [HTMLElement | null, number] {
  const parts = path.split('/');

  let node: HTMLElement | null = referenceElement;
  let part = parts.shift();

  while (node && part) {
    node = followPart(node, part);
    part = parts.shift();
  }

  // the part following is greedy, so walk back to the first matching
  // textish node before computing offset
  while (isTextOrTextHighlight(node!) && isTextOrTextHighlight(node!.previousSibling!)) {
    node = node!.previousSibling as HTMLElement;
  }
  // highligts split up text nodes that should be treated as one, iterate through
  // until we find the text node that the offset specifies, modifying the offset
  // as we go. prefer leaving highlights if we have the option to deal with
  // adjacent highlights.
  while ((isTextHighlight(node!) && offset >= node!.textContent!.length) || (isText(node!) && offset > node!.textContent!.length)) {
    offset -= node!.textContent!.length;
    node = isTextOrTextHighlight(node!.nextSibling!) ? node!.nextSibling as HTMLElement : null;
  }

  if (node && isHighlight(node)) {
    node = null;
  }

  if (isElement(node!) && node!.childNodes.length < offset) {
    node = null;
  }

  return [node, offset];
}

function followPart(node: Node, part: string) {

  const findFirst = (nodeList: NodeList, predicate: (node: Node) => boolean) =>
    Array.prototype.find.call(nodeList, (node: Node) => predicate(node) && !isHighlight(node));
  const findFirstAfter = (nodeList: NodeList, afterThis: Node, predicate: (node: Node) => boolean) => findFirst(
    Array.prototype.slice.call(nodeList, Array.prototype.indexOf.call(nodeList, afterThis) + 1),
    predicate
  );

  if (IS_PATH_PART_SELF.test(part)) {
    return node;
  }
  if (IS_PATH_PART_TEXT.test(part)) {
    let [, index] = part.match(IS_PATH_PART_TEXT) as any;
    let text = findFirst(node.childNodes, isText);

    while (text && index > 1) {
      let search = text;

      while (isTextOrTextHighlight(search)) {
        search = search.nextSibling;
      }

      index--;

      if (search) {
        text = findFirstAfter(node.childNodes, search, isText);
      } else {
        text = search;
      }

    }

    return text;
  }
  if (IS_PATH_PART_ELEMENT.test(part)) {
    let [, type, index] = part.match(IS_PATH_PART_ELEMENT) as any;
    const nodeMatches = (node: Node) => isElement(node) && node.nodeName.toLowerCase() === type.toLowerCase();
    let element = findFirst(node.childNodes, nodeMatches);

    while (element && index > 1) {
      index--;
      element = findFirstAfter(node.childNodes, element, nodeMatches);
    }

    return element;
  }
}
