import {DATA_ATTR, DATA_SCREEN_READERS_ATTR} from '../../injectHighlightWrappers';
import * as xpath from './xpath';

const screenReaderNode = `<span ${DATA_ATTR} ${DATA_SCREEN_READERS_ATTR}></span>`;

describe('getXPathForElement', () => {
  it('creates path to self', () => {
    document.body.innerHTML = `
      <div id="reference"></div>
    `;

    const reference = document.getElementById('reference');
    const [result] = xpath.getXPathForElement(reference, 0, reference);
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
    const [result] = xpath.getXPathForElement(element, 0, reference);
    expect(result).toEqual("./*[name()='div'][1]");
  });

  it('creates path to child text', () => {
    document.body.innerHTML = `
      <div id="reference">asdf</div>
    `;

    const reference = document.getElementById('reference');
    const text = reference.firstChild;
    const [result, offset] = xpath.getXPathForElement(text, 3, reference);

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
    const [result] = xpath.getXPathForElement(element, 0, reference);
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
    const [result, offset] = xpath.getXPathForElement(text, 4, reference);
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
    const [result, offset] = xpath.getXPathForElement(text, 0, reference);
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
    const [result1, offset1] = xpath.getXPathForElement(target1, 2, reference);
    expect(result1).toEqual(expectedPath);
    expect(offset1).toEqual(expectedOffset);

    const target2 = document.getElementById('target2');
    const [result2, offset2] = xpath.getXPathForElement(target2, 2, reference);
    expect(result2).toEqual(expectedPath);
    expect(offset2).toEqual(expectedOffset);

    const target3 = document.getElementById('target3');
    const [result3, offset3] = xpath.getXPathForElement(target3, 2, reference);
    expect(result3).toEqual(expectedPath);
    expect(offset3).toEqual(expectedOffset);

    const [result4, offset4] = xpath.getXPathForElement(target3.childNodes[1], 8, reference);
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
    const [result1, offset1] = xpath.getXPathForElement(target1, 1, reference);
    expect(result1).toEqual(expectedPath);
    expect(offset1).toEqual(expectedOffset);

    const target2 = document.getElementById('target2');
    const [result2, offset2] = xpath.getXPathForElement(target2, 0, reference);
    expect(result2).toEqual(expectedPath);
    expect(offset2).toEqual(expectedOffset);

    const target3 = document.getElementById('target3');
    const [result3, offset3] = xpath.getXPathForElement(target3, 0, reference);
    expect(result3).toEqual(expectedPath);
    expect(offset3).toEqual(expectedOffset);

    const [result4, offset4] = xpath.getXPathForElement(target3.childNodes[0], 0, reference);
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
    const [result1, offset1] = xpath.getXPathForElement(target1, 1, reference);
    expect(result1).toEqual(expectedPath);
    expect(offset1).toEqual(expectedOffset);

    const target2 = document.getElementById('target2');
    const [result2, offset2] = xpath.getXPathForElement(target2, 3, reference);
    expect(result2).toEqual(expectedPath);
    expect(offset2).toEqual(expectedOffset);

    const target3 = document.getElementById('target3');
    const [result3, offset3] = xpath.getXPathForElement(target3, 3, reference);
    expect(result3).toEqual(expectedPath);
    expect(offset3).toEqual(expectedOffset);

    const [result4, offset4] = xpath.getXPathForElement(target3.childNodes[1], 8, reference);
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
    const [result1, offset1] = xpath.getXPathForElement(target1, 0, reference);
    expect(result1).toEqual(expectedPath);
    expect(offset1).toEqual(expectedOffset);

    const target2 = document.getElementById('target2');
    const [result2, offset2] = xpath.getXPathForElement(target2, 0, reference);
    expect(result2).toEqual(expectedPath);
    expect(offset2).toEqual(expectedOffset);

    const target3 = document.getElementById('target3');
    const [result3, offset3] = xpath.getXPathForElement(target3, 0, reference);
    expect(result3).toEqual(expectedPath);
    expect(offset3).toEqual(expectedOffset);

    const [result4, offset4] = xpath.getXPathForElement(target3.childNodes[0], 0, reference);
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
    const [result, offset] = xpath.getXPathForElement(text, 0, reference);

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
    const [result, offset] = xpath.getXPathForElement(text, 0, reference);

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
    const [result, offset] = xpath.getXPathForElement(reference, 4, reference);

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
    const [result, offset] = xpath.getXPathForElement(element, 1, reference);

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
    const [result] = xpath.getXPathForElement(text, 0, reference);

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
    const [result, offset] = xpath.getXPathForElement(text, 0, reference);

    expect(result).toEqual("./*[name()='div'][3]/*[name()='div'][1]/text()[1]");
    expect(offset).toEqual(22);
  });

  it('doesn\'t modify offset when there are no highlights', () => {
    document.body.innerHTML = `
      <div id="reference">asdf</div>
    `;

    const reference = document.getElementById('reference');
    const text = reference.firstChild;
    const [result, offset] = xpath.getXPathForElement(text, 3, reference);

    expect(result).toEqual("./text()[1]");
    expect(offset).toEqual(3);
  });

  it('if target specifies the beginning of a highlight, move it ', () => {
    document.body.innerHTML = `
      <div id="reference">asdf<span></span>qwer <span ${DATA_ATTR}>${screenReaderNode}asdf${screenReaderNode}</span> werewwer</div>
    `;

    const reference = document.getElementById('reference');
    const [result, offset] = xpath.getXPathForElement(reference, 3, reference);

    expect(result).toEqual("./text()[2]");
    expect(offset).toEqual(5);
  });

  it('if target is between two highlights, move it ', () => {
    document.body.innerHTML = `
      <div id="reference">qwer <span ${DATA_ATTR}>${screenReaderNode}zxcv ${screenReaderNode}</span><span ${DATA_ATTR}>${screenReaderNode}asdf${screenReaderNode}</span> werewwer</div>
    `;

    const reference = document.getElementById('reference');
    const [result, offset] = xpath.getXPathForElement(reference, 2, reference);

    expect(result).toEqual("./text()[1]");
    expect(offset).toEqual(10);
  });

  it('if target specifies the end of a highlight, move it ', () => {
    document.body.innerHTML = `
      <div id="reference">qwer <span ${DATA_ATTR}>${screenReaderNode}asdf${screenReaderNode}</span> werewwer</div>
    `;

    const reference = document.getElementById('reference');
    const [result, offset] = xpath.getXPathForElement(reference, 2, reference);

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
    const [result, offset] = xpath.getXPathForElement(element, 3, reference);

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
    const [result] = xpath.getFirstByXPath('.', 0, reference);

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
    const [result] = xpath.getFirstByXPath("./*[name()='div'][1]", 0, reference);

    expect(result).toEqual(target);
  });

  it('resolves path to child text', () => {
    document.body.innerHTML = `
      <div id="reference">asdf</div>
    `;

    const reference = document.getElementById('reference');
    const target = reference.firstChild;
    const [result] = xpath.getFirstByXPath("./text()[1]", 0, reference);

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
    const [result] = xpath.getFirstByXPath("./*[name()='div'][52]/*[name()='div'][1]/*[name()='section'][1]/*[name()='div'][1]", 0, reference);

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
    const [result] = xpath.getFirstByXPath("./*[name()='div'][3]/*[name()='div'][1]/*[name()='section'][1]/text()[1]", 0, reference);

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
    const [result] = xpath.getFirstByXPath("./*[name()='span'][1]/*[name()='div'][1]/*[name()='section'][1]/text()[1]", 0, reference);

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
    const [result, offset] = xpath.getFirstByXPath(".", 1, reference);

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
    const [result, offset] = xpath.getFirstByXPath(".", 3, reference);

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
    const [result, offset] = xpath.getFirstByXPath(".", 2, reference);

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
    const [result] = xpath.getFirstByXPath("./*[name()='div'][3]/*[name()='div'][1]/text()[2]", 0, reference);

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
    const [result, offset] = xpath.getFirstByXPath("./*[name()='div'][3]/*[name()='div'][1]/text()[1]", 23, reference);

    expect(result.textContent.trim()).toEqual('werewwer');
    expect(offset).toEqual(1);
  });

  it('a nonexistant offset should return null', () => {
    document.body.innerHTML = `
      <div id="reference">asdf<span>asdf</span>qwerqwerqwerqwer</div>
    `;

    const reference = document.getElementById('reference');
    const [result] = xpath.getFirstByXPath("./text()[1]", 10, reference);

    expect(result).toEqual(null);
  });

  it('if the offset specifies the end boundary of highlight and text, it returns the text', () => {
    document.body.innerHTML = `
      <div id="reference">
        qwer <span ${DATA_ATTR}>${screenReaderNode}asdf${screenReaderNode}</span> werewwer
      </div>
    `;

    const reference = document.getElementById('reference');
    const [result] = xpath.getFirstByXPath("./text()[1]", 18, reference);

    expect(result.textContent.trim()).toEqual('werewwer');
  });

  it('if the offset specifies the start boundary of highlight and text, it returns the text', () => {
    document.body.innerHTML = `
      <div id="reference">
        qwer <span ${DATA_ATTR}>${screenReaderNode}asdf${screenReaderNode}</span> werewwer
      </div>
    `;

    const reference = document.getElementById('reference');
    const [result] = xpath.getFirstByXPath("./text()[1]", 14, reference);

    expect(result.textContent.trim()).toEqual('qwer');
  });

  it('returns null if the requested text node does not exist', () => {
    document.body.innerHTML = `
      <div id="reference">
        qwer
      </div>
    `;

    const reference = document.getElementById('reference');
    const [result] = xpath.getFirstByXPath("./text()[4]", 0, reference);

    expect(result).toEqual(null);
  });

  it('returns null if the requested text offset does not exist', () => {
    document.body.innerHTML = `
      <div id="reference">qwer</div>
    `;

    const reference = document.getElementById('reference');
    const [result] = xpath.getFirstByXPath("./text()[1]", 5, reference);

    expect(result).toEqual(null);
  });

  it('returns if the requested text offset does exist', () => {
    document.body.innerHTML = `
      <div id="reference">qwer</div>
    `;

    const reference = document.getElementById('reference');
    const [result] = xpath.getFirstByXPath("./text()[1]", 4, reference);

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
    const [result] = xpath.getFirstByXPath("./*[name()='div'][2]", 1, reference);

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
    const [result] = xpath.getFirstByXPath("./*[name()='div'][2]", 0, reference);

    expect(result).not.toEqual(null);
  });
});
