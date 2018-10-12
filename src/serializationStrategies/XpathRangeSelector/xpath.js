// mostly copied from https://developer.mozilla.org/en-US/docs/Web/XPath/Snippets#getXPathForElement
export function getXPathForElement(el, reference) {
  var xpath = '';
  var pos, tempitem2;

  while(el !== reference) {
    pos = 0;
    tempitem2 = el;
    while(tempitem2) {
      if ([3, 1].indexOf(tempitem2.nodeType) !== -1 && tempitem2.nodeName === el.nodeName) { // If it is ELEMENT_NODE or TEXT_NODE of the same name
        pos += 1;
      }
      tempitem2 = tempitem2.previousSibling;
    }

    if (el.nodeType === 3 /* #text */) {
      xpath = "text()["+pos+']'+'/'+xpath;
    } else {
      xpath = "*[name()='"+el.nodeName.toLowerCase()+"']["+pos+']'+'/'+xpath;
    }

    el = el.parentNode;
  }
  xpath = './' + xpath;
  xpath = xpath.replace(/\/$/, '');
  return xpath;
}

export function getFirstByXPath(path, referenceElement) {
  return document.evaluate(path, referenceElement).iterateNext();
}
