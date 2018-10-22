import {DATA_ATTR} from '../../injectHighlightWrappers';

const findElementChild = node => Array.prototype.find.call(node.childNodes, node => node.nodeType === 1);
const isHighlight = node => node && node.getAttribute && node.getAttribute(DATA_ATTR) !== null;
const isTextHighlight = node => isHighlight(node) && !findElementChild(node);
const isText = node => node && node.nodeType === 3;
const isElement = node => node && node.nodeType === 1;
const isTextOrElement = node => isText(node) || isElement(node);

const IS_PATH_PART_SELF = /^\.$/;
const IS_PATH_PART_TEXT = /^text\(\)\[(\d+)\]$/;
const IS_PATH_PART_ELEMENT = /\*\[name\(\)='(.+)'\]\[(\d)\]/;

// kinda copied from https://developer.mozilla.org/en-US/docs/Web/XPath/Snippets#getXPathForElement
export function getXPathForElement(targetElement, offset, reference) {
  let xpath = '';
  let pos
    , element = targetElement.previousSibling
    , focus = targetElement;

  // for a text target, highlights might have broken up the text node,
  // look for preceeding nodes that need to be combined into this one
  // and modify the range offset accordingly
  if (isText(focus) && isTextHighlight(element)) {
    while(element && (isText(element) || isTextHighlight(element))) {
      offset += element.textContent.length;
      element = element.previousSibling;
    }
  // for element targets, highlight children might be artifically
  // inflating the range offset, fix.
  } else if (isElement(focus)) {
    offset -= Array.prototype.filter.call(Array.prototype.slice.call(focus.childNodes, 0, offset), isHighlight).length;
  }

  while(focus !== reference) {
    pos = 1;

    while(element) {
      // highlights in text change the number of nodes in the nodelist,
      // compensate by gobbling adjacent highlights and text
      if (isText(focus) && isTextHighlight(element)) {
        while(element && (isText(element) || isTextHighlight(element))) {
          element = element.previousSibling;
        }
      }
      if (element) {
        if (isTextOrElement(element) && !isHighlight(element) && element.nodeName === focus.nodeName) { // If it is ELEMENT_NODE or TEXT_NODE of the same name
          pos += 1;
        }

        element = element.previousSibling;
      }
    }

    if (isText(focus)) {
      xpath = "text()["+pos+']'+'/'+xpath;
    } else {
      xpath = "*[name()='"+focus.nodeName.toLowerCase()+"']["+pos+']'+'/'+xpath;
    }

    focus = focus.parentNode;
    element = focus.previousSibling;

  }

  xpath = './' + xpath;
  xpath = xpath.replace(/\/$/, '');
  return [xpath, offset];
}

export function getFirstByXPath(path, offset, referenceElement) {
  const parts = path.split('/');

  let node = referenceElement;
  let part = parts.shift();

  while (node && part) {
    node = followPart(node, part);
    part = parts.shift();
  }

  const highlightOrText = node => isHighlight(node) || isText(node);

  // highligts split up text nodes that should be treated as one, iterate through
  // until we find the text node that the offset specifies, modifying the offset
  // as we go. prefer leaving highlights if we have the option to deal with
  // adjacent highlights.
  while ((isHighlight(node) && offset >= node.textContent.length) || (isText(node) && offset > node.textContent.length)) {
    offset -= node.textContent.length;
    node = highlightOrText(node.nextSibling) ? node.nextSibling : null;
  }

  if (node && isHighlight(node)) {
    node = null;
  }

  if (isElement(node) && node.childNodes.length < offset) {
    node = null;
  }

  return [node, offset];
}

function followPart(node, part) {

  const findFirst = (nodeList, predicate) =>
    Array.prototype.find.call(nodeList, node => predicate(node) && !isHighlight(node));
  const findFirstAfter = (nodeList, afterThis, predicate) => findFirst(
    Array.prototype.slice.call(nodeList, Array.prototype.indexOf.call(nodeList, afterThis) + 1),
    predicate
  );

  if (IS_PATH_PART_SELF.test(part)) {
    return node;
  }
  if (IS_PATH_PART_TEXT.test(part)) {
    let [, index] = part.match(IS_PATH_PART_TEXT);
    let text = findFirst(node.childNodes, isText);

    while (text && index > 1) {
      let search = text;

      while (search && (isText(search) || isHighlight(search))) {
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
    let [, type, index] = part.match(IS_PATH_PART_ELEMENT);
    const nodeMatches = node => isElement(node) && node.nodeName.toLowerCase() === type.toLowerCase();
    let element = findFirst(node.childNodes, nodeMatches);

    while (element && index > 1) {
      index--;
      element = findFirstAfter(node.childNodes, element, nodeMatches);
    }

    return element;
  }
}
