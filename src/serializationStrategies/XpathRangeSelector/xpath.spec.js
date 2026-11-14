import {DATA_ATTR, DATA_SCREEN_READERS_ATTR} from '../../injectHighlightWrappers';
import * as xpath from './xpath';

const screenReaderNode = `<span ${DATA_SCREEN_READERS_ATTR}></span>`;

// These call the xpath functions the way XpathRangeSelector does: offsets count screen reader labels, and a point
// inside another highlight is not found.
const getXPathForElementCountingLabels = (node, offset, reference) =>
  xpath.getXPathForElement(node, offset, reference, xpath.getTextLengthCountingScreenReaderText);
const getFirstByXPathCountingLabels = (path, offset, reference) =>
  xpath.getFirstByXPath(path, offset, reference, xpath.getTextLengthCountingScreenReaderText, false);

describe('getXPathForElement', () => {
  it('creates path to self', () => {
    document.body.innerHTML = `
      <div id="reference"></div>
    `;

    const reference = document.getElementById('reference');
    const [result] = getXPathForElementCountingLabels(reference, 0, reference);
    expect(result).toEqual('.');
  });

  it('creates path to child element', () => {
    document.body.innerHTML = `
      <div id="reference">
        <div id="element"></div>
      </div>
    `;

    const reference = document.getElementById('reference');
    const element = document.getElementById('element');
    const [result] = getXPathForElementCountingLabels(element, 0, reference);
    expect(result).toEqual("./*[name()='div'][1]");
  });

  it('creates path to child text', () => {
    document.body.innerHTML = `
      <div id="reference">asdf</div>
    `;

    const reference = document.getElementById('reference');
    const text = reference.firstChild;
    const [result, offset] = getXPathForElementCountingLabels(text, 3, reference);

    expect(result).toEqual("./text()[1]");
    expect(offset).toEqual(3);
  });

  it('creates path to nested element', () => {
    document.body.innerHTML = `
      <div id="reference">
        <div></div>
        <span></span>
        <div></div>
        <div>
          <div>
            <section>
              <div id="element"></div>
            </section>
          </div>
        </div>
        <div></div>
      </div>
    `;

    const reference = document.getElementById('reference');
    const element = document.getElementById('element');
    const [result] = getXPathForElementCountingLabels(element, 0, reference);
    expect(result).toEqual("./*[name()='div'][3]/*[name()='div'][1]/*[name()='section'][1]/*[name()='div'][1]");
  });

  it('removes unnecesary text node (trailing)', () => {
    document.body.innerHTML = `
      <div id="reference">
        <div id="target">asdf</div>
      </div>
    `;

    const reference = document.getElementById('reference');
    const text = document.getElementById('target').childNodes[0];
    const [result, offset] = getXPathForElementCountingLabels(text, 4, reference);
    expect(result).toEqual("./*[name()='div'][1]");
    expect(offset).toEqual(1);
  });

  it('removes unnecesary text node (leading)', () => {
    document.body.innerHTML = `
      <div id="reference">
        <div id="target">asdf</div>
      </div>
    `;

    const reference = document.getElementById('reference');
    const text = document.getElementById('target').childNodes[0];
    const [result, offset] = getXPathForElementCountingLabels(text, 0, reference);
    expect(result).toEqual("./*[name()='div'][1]");
    expect(offset).toEqual(0);
  });

  it('creates path through nested text highlights (on trailing edge)', () => {
    document.body.innerHTML = `
      <div id="reference">
        <div></div>
        <div></div>
        <span></span>
        <div>
          werwerwerwer
          <div id="target1">
            <span id="target2" ${DATA_ATTR}>${screenReaderNode}<span id="target3" ${DATA_ATTR}>${screenReaderNode}asdfasdf${screenReaderNode}</span>${screenReaderNode}</span>
            qwer
            werewwer
          </div>
        </div>
        <div></div>
      </div>
    `;

    const reference = document.getElementById('reference');
    const expectedPath = "./*[name()='div'][3]/*[name()='div'][1]/text()[1]";
    const expectedOffset = 21;

    const target1 = document.getElementById('target1');
    const [result1, offset1] = getXPathForElementCountingLabels(target1, 2, reference);
    expect(result1).toEqual(expectedPath);
    expect(offset1).toEqual(expectedOffset);

    const target2 = document.getElementById('target2');
    const [result2, offset2] = getXPathForElementCountingLabels(target2, 2, reference);
    expect(result2).toEqual(expectedPath);
    expect(offset2).toEqual(expectedOffset);

    const target3 = document.getElementById('target3');
    const [result3, offset3] = getXPathForElementCountingLabels(target3, 2, reference);
    expect(result3).toEqual(expectedPath);
    expect(offset3).toEqual(expectedOffset);

    const [result4, offset4] = getXPathForElementCountingLabels(target3.childNodes[1], 8, reference);
    expect(result4).toEqual(expectedPath);
    expect(offset4).toEqual(expectedOffset);
  });

  it('creates path through nested text highlights (on leading edge)', () => {
    document.body.innerHTML = `
      <div id="reference">
        <div></div>
        <div></div>
        <span></span>
        <div>
          werwerwerwer
          <div id="target1">
            <span id="target2" ${DATA_ATTR}>${screenReaderNode}<span id="target3" ${DATA_ATTR}>${screenReaderNode}asdfasdf${screenReaderNode}</span>${screenReaderNode}</span>
            qwer
            werewwer
          </div>
        </div>
        <div></div>
      </div>
    `;

    const reference = document.getElementById('reference');
    const expectedPath = "./*[name()='div'][3]/*[name()='div'][1]/text()[1]";
    const expectedOffset = 13;

    const target1 = document.getElementById('target1');
    const [result1, offset1] = getXPathForElementCountingLabels(target1, 1, reference);
    expect(result1).toEqual(expectedPath);
    expect(offset1).toEqual(expectedOffset);

    const target2 = document.getElementById('target2');
    const [result2, offset2] = getXPathForElementCountingLabels(target2, 0, reference);
    expect(result2).toEqual(expectedPath);
    expect(offset2).toEqual(expectedOffset);

    const target3 = document.getElementById('target3');
    const [result3, offset3] = getXPathForElementCountingLabels(target3, 0, reference);
    expect(result3).toEqual(expectedPath);
    expect(offset3).toEqual(expectedOffset);

    const [result4, offset4] = getXPathForElementCountingLabels(target3.childNodes[0], 0, reference);
    expect(result4).toEqual(expectedPath);
    expect(offset4).toEqual(expectedOffset);
  });

  it('remove unnecessary text nodes with nested text highlights (on trailing edge)', () => {
    document.body.innerHTML = `
      <div id="reference">
        <div></div>
        <div></div>
        <span></span>
        <div>` +
          `<div id="target1">` +
            `<span id="target2" ${DATA_ATTR}>` +
              screenReaderNode +
              `<span id="target3" ${DATA_ATTR}>` +
                `${screenReaderNode}asdfasdf${screenReaderNode}` +
              `</span>` +
              screenReaderNode +
            `</span>` +
          `</div>` +
        `</div>` +
        `<div></div>
      </div>
    `;

    const reference = document.getElementById('reference');
    const expectedPath = "./*[name()='div'][3]/*[name()='div'][1]";
    const expectedOffset = 1;

    const target1 = document.getElementById('target1');
    const [result1, offset1] = getXPathForElementCountingLabels(target1, 1, reference);
    expect(result1).toEqual(expectedPath);
    expect(offset1).toEqual(expectedOffset);

    const target2 = document.getElementById('target2');
    const [result2, offset2] = getXPathForElementCountingLabels(target2, 3, reference);
    expect(result2).toEqual(expectedPath);
    expect(offset2).toEqual(expectedOffset);

    const target3 = document.getElementById('target3');
    const [result3, offset3] = getXPathForElementCountingLabels(target3, 3, reference);
    expect(result3).toEqual(expectedPath);
    expect(offset3).toEqual(expectedOffset);

    const [result4, offset4] = getXPathForElementCountingLabels(target3.childNodes[1], 8, reference);
    expect(result4).toEqual(expectedPath);
    expect(offset4).toEqual(expectedOffset);
  });

  it('remove unnecessary text nodes with nested text highlights (on leading edge)', () => {
    document.body.innerHTML = `
      <div id="reference">
        <div></div>
        <div></div>
        <span></span>
        <div><div id="target1"><span id="target2" ${DATA_ATTR}>${screenReaderNode}<span id="target3" ${DATA_ATTR}>${screenReaderNode}asdfasdf${screenReaderNode}</span>${screenReaderNode}</span></div></div>
        <div></div>
      </div>
    `;

    const reference = document.getElementById('reference');
    const expectedPath = "./*[name()='div'][3]/*[name()='div'][1]";
    const expectedOffset = 0;

    const target1 = document.getElementById('target1');
    const [result1, offset1] = getXPathForElementCountingLabels(target1, 0, reference);
    expect(result1).toEqual(expectedPath);
    expect(offset1).toEqual(expectedOffset);

    const target2 = document.getElementById('target2');
    const [result2, offset2] = getXPathForElementCountingLabels(target2, 0, reference);
    expect(result2).toEqual(expectedPath);
    expect(offset2).toEqual(expectedOffset);

    const target3 = document.getElementById('target3');
    const [result3, offset3] = getXPathForElementCountingLabels(target3, 0, reference);
    expect(result3).toEqual(expectedPath);
    expect(offset3).toEqual(expectedOffset);

    const [result4, offset4] = getXPathForElementCountingLabels(target3.childNodes[0], 0, reference);
    expect(result4).toEqual(expectedPath);
    expect(offset4).toEqual(expectedOffset);
  });

  it('creates path to nested text element', () => {
    document.body.innerHTML = `
      <div id="reference">
        <div></div>
        <div></div>
        <span></span>
        <div>
          werwerwerwer
          <div>
            qwer
            werewwer
            <section>asdfasdf<div id="target"></div>asdfasdfasfd</section>
          </div>
        </div>
        <div></div>
      </div>
    `;

    const reference = document.getElementById('reference');
    const text = document.getElementById('target').nextSibling;
    const [result, offset] = getXPathForElementCountingLabels(text, 0, reference);

    expect(result).toEqual("./*[name()='div'][3]/*[name()='div'][1]/*[name()='section'][1]");
    expect(offset).toEqual(2);
  });

  it('doesn\'t count highlights between elements', () => {
    document.body.innerHTML = `
      <div id="reference">
        <div></div>
        <span ${DATA_ATTR}>${screenReaderNode}${screenReaderNode}</span>
        <div></div>
        <span>
          werwerwerwer
          <div>
            qwer
            werewwer
            <section>asdfasdf<div id="target"></div>asdfasdfasfd</section>
          </div>
        </div>
        <div></div>
      </span>
    `;

    const reference = document.getElementById('reference');
    const text = document.getElementById('target').previousSibling;
    const [result, offset] = getXPathForElementCountingLabels(text, 0, reference);

    expect(result).toEqual("./*[name()='span'][1]/*[name()='div'][1]/*[name()='section'][1]");
    expect(offset).toEqual(0);
  });

  it('doesn\'t count highlights between previous text', () => {
    document.body.innerHTML = `
      <div id="reference">` +
        `qwer` +
        `<span ${DATA_ATTR}>` +
          screenReaderNode +
          `asdf` +
          screenReaderNode +
        `</span>` +
        `<div id="target"></div>` +
        `<span ${DATA_ATTR}>` +
          screenReaderNode +
          `as` +
          screenReaderNode +
        `</span>` +
        `asdfasdf` +
      `</div>
    `;

    const reference = document.getElementById('reference');
    const [result, offset] = getXPathForElementCountingLabels(reference, 4, reference);

    expect(result).toEqual("./text()[2]");
    expect(offset).toEqual(2);
  });

  it('does count highlights in offsets without adjacent text', () => {
    document.body.innerHTML = `
      <div id="reference">
        <div></div>
        <div></div>
        <div>
          werwerwerwer
          <div id="target"><span ${DATA_ATTR}>${screenReaderNode}asdf${screenReaderNode}</span></div>
        </div>
        <div></div>
      </div>
    `;

    const reference = document.getElementById('reference');
    const element = document.getElementById('target');
    const [result, offset] = getXPathForElementCountingLabels(element, 1, reference);

    expect(result).toEqual("./*[name()='div'][3]/*[name()='div'][1]");
    expect(offset).toEqual(1);
  });

  it('doesn\'t count highlights between current text', () => {
    document.body.innerHTML = `
      <div id="reference">
        <div></div>
        <div></div>
        <div>
          werwerwerwer
          <div>
            qwer <span ${DATA_ATTR}>${screenReaderNode}asdf${screenReaderNode}</span> werewwer
            <div id="target"></div>
            asdfasdf
          </div>
        </div>
        <div></div>
      </div>
    `;

    const reference = document.getElementById('reference');
    const text = document.getElementById('target').previousSibling;
    const [result] = getXPathForElementCountingLabels(text, 0, reference);

    expect(result).toEqual("./*[name()='div'][3]/*[name()='div'][1]/text()[1]");
  });

  it('modifies offset for text target when treating text nodes separated by highlight as one', () => {
    document.body.innerHTML = `
      <div id="reference">
        <div></div>
        <div></div>
        <div>
          werwerwerwer
          <div>
            qwer <span ${DATA_ATTR}>${screenReaderNode}asdf${screenReaderNode}</span> werewwer
            <div id="target"></div>
            asdfasdf
          </div>
        </div>
        <div></div>
      </div>
    `;

    const reference = document.getElementById('reference');
    const text = document.getElementById('target').previousSibling;
    const [result, offset] = getXPathForElementCountingLabels(text, 0, reference);

    expect(result).toEqual("./*[name()='div'][3]/*[name()='div'][1]/text()[1]");
    expect(offset).toEqual(22);
  });

  it('doesn\'t modify offset when there are no highlights', () => {
    document.body.innerHTML = `
      <div id="reference">asdf</div>
    `;

    const reference = document.getElementById('reference');
    const text = reference.firstChild;
    const [result, offset] = getXPathForElementCountingLabels(text, 3, reference);

    expect(result).toEqual("./text()[1]");
    expect(offset).toEqual(3);
  });

  it('if target specifies the beginning of a highlight, move it ', () => {
    document.body.innerHTML = `
      <div id="reference">asdf<span></span>qwer <span ${DATA_ATTR}>${screenReaderNode}asdf${screenReaderNode}</span> werewwer</div>
    `;

    const reference = document.getElementById('reference');
    const [result, offset] = getXPathForElementCountingLabels(reference, 3, reference);

    expect(result).toEqual("./text()[2]");
    expect(offset).toEqual(5);
  });

  it('if target is between two highlights, move it ', () => {
    document.body.innerHTML = `
      <div id="reference">qwer <span ${DATA_ATTR}>${screenReaderNode}zxcv ${screenReaderNode}</span><span ${DATA_ATTR}>${screenReaderNode}asdf${screenReaderNode}</span> werewwer</div>
    `;

    const reference = document.getElementById('reference');
    const [result, offset] = getXPathForElementCountingLabels(reference, 2, reference);

    expect(result).toEqual("./text()[1]");
    expect(offset).toEqual(10);
  });

  it('if target specifies the end of a highlight, move it ', () => {
    document.body.innerHTML = `
      <div id="reference">qwer <span ${DATA_ATTR}>${screenReaderNode}asdf${screenReaderNode}</span> werewwer</div>
    `;

    const reference = document.getElementById('reference');
    const [result, offset] = getXPathForElementCountingLabels(reference, 2, reference);

    expect(result).toEqual("./text()[1]");
    expect(offset).toEqual(9);
  });

  it('modifies offset for element target when treating text nodes separated by highlight as one', () => {
    document.body.innerHTML = `
      <div id="reference">
        <div id="target">
          qwer <span ${DATA_ATTR}>asdf</span> werewwer
          <div></div>
        </div>
      </div>
    `;

    const reference = document.getElementById('reference');
    const element = document.getElementById('target');
    const [result, offset] = getXPathForElementCountingLabels(element, 3, reference);

    expect(result).toEqual("./*[name()='div'][1]");
    expect(offset).toEqual(1);
  });
});

describe('getFirstByXPath', () => {
  it('resolves path to self', () => {
    document.body.innerHTML = `
      <div id="reference"></div>
    `;

    const reference = document.getElementById('reference');
    const [result] = getFirstByXPathCountingLabels('.', 0, reference);

    expect(result).toEqual(reference);
  });

  it('resolves path to child element', () => {
    document.body.innerHTML = `
      <div id="reference">
        <div id="target"></div>
      </div>
    `;

    const reference = document.getElementById('reference');
    const target = document.getElementById('target');
    const [result] = getFirstByXPathCountingLabels("./*[name()='div'][1]", 0, reference);

    expect(result).toEqual(target);
  });

  it('resolves path to child text', () => {
    document.body.innerHTML = `
      <div id="reference">asdf</div>
    `;

    const reference = document.getElementById('reference');
    const target = reference.firstChild;
    const [result] = getFirstByXPathCountingLabels("./text()[1]", 0, reference);

    expect(result).toEqual(target);
    expect(result.textContent).toEqual('asdf');
  });

  it('resolves path to nested element', () => {
    document.body.innerHTML = `
      <div id="reference">
        <div></div>
        <span></span>
        ${'<div></div>'.repeat(50)}
        <div>
          <div>
            <section>
              <div id="target"></div>
            </section>
          </div>
        </div>
        <div></div>
      </div>
    `;

    const reference = document.getElementById('reference');
    const target = document.getElementById('target');
    const [result] = getFirstByXPathCountingLabels("./*[name()='div'][52]/*[name()='div'][1]/*[name()='section'][1]/*[name()='div'][1]", 0, reference);

    expect(result).toEqual(target);
  });

  it('resolves path to nested text element', () => {
    document.body.innerHTML = `
      <div id="reference">
        <div></div>
        <div></div>
        <span></span>
        <div>
          werwerwerwer
          <div>
            qwer
            werewwer
            <section>asdfasdf<div id="target"></div>asdfasdfasfd</section>
          </div>
        </div>
        <div></div>
      </div>
    `;

    const reference = document.getElementById('reference');
    const target = document.getElementById('target').previousSibling;
    const [result] = getFirstByXPathCountingLabels("./*[name()='div'][3]/*[name()='div'][1]/*[name()='section'][1]/text()[1]", 0, reference);

    expect(result).toEqual(target);
    expect(result.textContent).toEqual('asdfasdf');
  });

  it('doesn\'t count highlights between elements', () => {
    document.body.innerHTML = `
      <div id="reference">
        <div></div>
        <span ${DATA_ATTR}>${screenReaderNode}${screenReaderNode}</span>
        <div></div>
        <span>
          werwerwerwer
          <div>
            qwer
            werewwer
            <section>asdfasdf<div id="target"></div>asdfasdfasfd</section>
          </div>
        </div>
        <div></div>
      </span>
    `;

    const reference = document.getElementById('reference');
    const target = document.getElementById('target').previousSibling;
    const [result] = getFirstByXPathCountingLabels("./*[name()='span'][1]/*[name()='div'][1]/*[name()='section'][1]/text()[1]", 0, reference);

    expect(result).toEqual(target);
    expect(result.textContent).toEqual('asdfasdf');
  });

  it('modifies element offset to account for highlights', () => {
    document.body.innerHTML = `
      <div id="reference">
        qwer <span ${DATA_ATTR}>${screenReaderNode}zxcv${screenReaderNode}</span><span ${DATA_ATTR}>${screenReaderNode}asdf${screenReaderNode}</span> werewwer
      </div>
    `;

    const reference = document.getElementById('reference');
    const [result, offset] = getFirstByXPathCountingLabels(".", 1, reference);

    expect(result).toBe(reference);
    expect(offset).toEqual(4);
  });

  it('modifies element offset to account for highlights (with extra elements)', () => {
    document.body.innerHTML = `
      <div id="reference">
        qwer <span ${DATA_ATTR}>${screenReaderNode}zxcv${screenReaderNode}</span><span class="ASdf"></span><span ${DATA_ATTR}>${screenReaderNode}asdf${screenReaderNode}</span> werewwer
      </div>
    `;

    const reference = document.getElementById('reference');
    const [result, offset] = getFirstByXPathCountingLabels(".", 3, reference);

    expect(result).toBe(reference);
    expect(offset).toEqual(5);
  });

  it('doesn\'t over-modify element offset to account for highlights', () => {
    document.body.innerHTML = `
      <div id="reference">
        qwer <span ${DATA_ATTR}>${screenReaderNode}zxcv${screenReaderNode}</span><span class="ASdf"></span><span ${DATA_ATTR}>${screenReaderNode}asdf${screenReaderNode}</span><span ${DATA_ATTR}>${screenReaderNode}asdf${screenReaderNode}</span><span ${DATA_ATTR}>${screenReaderNode}asdf${screenReaderNode}</span> werewwer
      </div>
    `;

    const reference = document.getElementById('reference');
    const [result, offset] = getFirstByXPathCountingLabels(".", 2, reference);

    expect(result).toBe(reference);
    expect(offset).toEqual(3);
  });

  it('doesn\'t count highlights between text', () => {
    document.body.innerHTML = `
      <div id="reference">
        <div></div>
        <div></div>
        <div>
          werwerwerwer
          <div>
            qwer <span ${DATA_ATTR}>${screenReaderNode}asdf${screenReaderNode}</span> werewwer
            <div></div>
            asdfasdf
          </div>
        </div>
        <div></div>
      </div>
    `;

    const reference = document.getElementById('reference');
    const [result] = getFirstByXPathCountingLabels("./*[name()='div'][3]/*[name()='div'][1]/text()[2]", 0, reference);

    expect(result.textContent.trim()).toEqual('asdfasdf');
  });

  it('rolls over into subsequent text nodes if offset is too big when they are separated by highlights', () => {
    document.body.innerHTML = `
      <div id="reference">
        <div></div>
        <div></div>
        <div>
          werwerwerwer
          <div>
            qwer <span ${DATA_ATTR}>${screenReaderNode}asdf${screenReaderNode}</span> werewwer
            <div></div>
            asdfasdf
          </div>
        </div>
        <div></div>
      </div>
    `;

    const reference = document.getElementById('reference');
    const [result, offset] = getFirstByXPathCountingLabels("./*[name()='div'][3]/*[name()='div'][1]/text()[1]", 23, reference);

    expect(result.textContent.trim()).toEqual('werewwer');
    expect(offset).toEqual(1);
  });

  it('a nonexistant offset should return null', () => {
    document.body.innerHTML = `
      <div id="reference">asdf<span>asdf</span>qwerqwerqwerqwer</div>
    `;

    const reference = document.getElementById('reference');
    const [result] = getFirstByXPathCountingLabels("./text()[1]", 10, reference);

    expect(result).toEqual(null);
  });

  it('if the offset specifies the end boundary of highlight and text, it returns the text', () => {
    document.body.innerHTML = `
      <div id="reference">
        qwer <span ${DATA_ATTR}>${screenReaderNode}asdf${screenReaderNode}</span> werewwer
      </div>
    `;

    const reference = document.getElementById('reference');
    const [result] = getFirstByXPathCountingLabels("./text()[1]", 18, reference);

    expect(result.textContent.trim()).toEqual('werewwer');
  });

  it('if the offset specifies the start boundary of highlight and text, it returns the text', () => {
    document.body.innerHTML = `
      <div id="reference">
        qwer <span ${DATA_ATTR}>${screenReaderNode}asdf${screenReaderNode}</span> werewwer
      </div>
    `;

    const reference = document.getElementById('reference');
    const [result] = getFirstByXPathCountingLabels("./text()[1]", 14, reference);

    expect(result.textContent.trim()).toEqual('qwer');
  });

  it('returns null if the requested text node does not exist', () => {
    document.body.innerHTML = `
      <div id="reference">
        qwer
      </div>
    `;

    const reference = document.getElementById('reference');
    const [result] = getFirstByXPathCountingLabels("./text()[4]", 0, reference);

    expect(result).toEqual(null);
  });

  it('returns null if the requested text offset does not exist', () => {
    document.body.innerHTML = `
      <div id="reference">qwer</div>
    `;

    const reference = document.getElementById('reference');
    const [result] = getFirstByXPathCountingLabels("./text()[1]", 5, reference);

    expect(result).toEqual(null);
  });

  it('returns if the requested text offset does exist', () => {
    document.body.innerHTML = `
      <div id="reference">qwer</div>
    `;

    const reference = document.getElementById('reference');
    const [result] = getFirstByXPathCountingLabels("./text()[1]", 4, reference);

    expect(result).not.toEqual(null);
  });

  it('returns null if the requested element offset does not exist', () => {
    document.body.innerHTML = `
      <div id="reference">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    `;

    const reference = document.getElementById('reference');
    const [result] = getFirstByXPathCountingLabels("./*[name()='div'][2]", 1, reference);

    expect(result).toEqual(null);
  });

  it('returns if the requested element offset does exist', () => {
    document.body.innerHTML = `
      <div id="reference">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    `;

    const reference = document.getElementById('reference');
    const [result] = getFirstByXPathCountingLabels("./*[name()='div'][2]", 0, reference);

    expect(result).not.toEqual(null);
  });
});

describe('text offsets next to a highlight with screen reader labels', () => {
  const START_LABEL = 'Start search result';
  const END_LABEL = 'End of search result';
  const labelledHighlight = (text) => `<span ${DATA_ATTR}>`
    + `<span ${DATA_SCREEN_READERS_ATTR}>${START_LABEL}</span>${text}<span ${DATA_SCREEN_READERS_ATTR}>${END_LABEL}</span>`
    + '</span>';
  const OFFSET_OF_ZXCV = 'qwer asdf '.length;
  const LABELS_LENGTH = START_LABEL.length + END_LABEL.length;

  beforeEach(() => {
    document.body.innerHTML = `<div id="reference">qwer ${labelledHighlight('asdf')} zxcv</div>`;
  });

  const textAfterHighlight = () => document.getElementById('reference').lastChild;

  it('counts the labels the way XpathRangeSelector does', () => {
    const reference = document.getElementById('reference');

    expect(getXPathForElementCountingLabels(textAfterHighlight(), 1, reference))
      .toEqual(['./text()[1]', OFFSET_OF_ZXCV + LABELS_LENGTH]);
    expect(getFirstByXPathCountingLabels('./text()[1]', OFFSET_OF_ZXCV + LABELS_LENGTH, reference))
      .toEqual([textAfterHighlight(), 1]);
  });

  it('does not find a point inside the highlight the way XpathRangeSelector does', () => {
    const reference = document.getElementById('reference');

    expect(getFirstByXPathCountingLabels('./text()[1]', 'qwer as'.length + START_LABEL.length, reference)[0])
      .toBe(null);
  });

  it('leaves the labels out by default', () => {
    const reference = document.getElementById('reference');

    expect(xpath.getXPathForElement(textAfterHighlight(), 1, reference))
      .toEqual(['./text()[1]', OFFSET_OF_ZXCV]);
    expect(xpath.getFirstByXPath('./text()[1]', OFFSET_OF_ZXCV, reference))
      .toEqual([textAfterHighlight(), 1]);
  });

  it('leaves the labels out of a point inside the highlight by default', () => {
    const reference = document.getElementById('reference');
    const highlightedText = reference.childNodes[1].childNodes[1];

    expect(xpath.getXPathForElement(highlightedText, 2, reference))
      .toEqual(['./text()[1]', 'qwer as'.length]);
  });

  it('finds a point inside the highlight by default, unless turned off', () => {
    const reference = document.getElementById('reference');
    const highlightedText = reference.childNodes[1].childNodes[1];

    expect(xpath.getFirstByXPath('./text()[1]', 'qwer as'.length, reference))
      .toEqual([highlightedText, 2]);
    expect(xpath.getFirstByXPath('./text()[1]', 'qwer as'.length, reference, xpath.getVisibleTextLength, false)[0])
      .toBe(null);
  });
});
