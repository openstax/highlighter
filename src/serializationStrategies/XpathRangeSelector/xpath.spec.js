import {DATA_ATTR} from '../../injectHighlightWrappers';
import * as xpath from './xpath';

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
    const [result] = xpath.getXPathForElement(text, 0, reference);

    expect(result).toEqual("./text()[1]");
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
    const text = document.getElementById('target').previousSibling;
    const [result] = xpath.getXPathForElement(text, 0, reference);

    expect(result).toEqual("./*[name()='div'][3]/*[name()='div'][1]/*[name()='section'][1]/text()[1]");
  });

  it('doesn\'t count highlights between elements', () => {
    document.body.innerHTML = `
      <div id="reference">
        <div></div>
        <span ${DATA_ATTR}></span>
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
    const [result] = xpath.getXPathForElement(text, 0, reference);

    expect(result).toEqual("./*[name()='span'][1]/*[name()='div'][1]/*[name()='section'][1]/text()[1]");
  });

  it('doesn\'t count highlights between previous text', () => {
    document.body.innerHTML = `
      <div id="reference">
        <div></div>
        <div></div>
        <div>
          werwerwerwer
          <div>
            qwer <span ${DATA_ATTR}>asdf</span> werewwer
            <div id="target"></div>
            asdfasdf
          </div>
        </div>
        <div></div>
      </div>
    `;

    const reference = document.getElementById('reference');
    const text = document.getElementById('target').nextSibling;
    const [result] = xpath.getXPathForElement(text, 0, reference);

    expect(result).toEqual("./*[name()='div'][3]/*[name()='div'][1]/text()[2]");
  });

  it('doesn\'t count highlights between current text', () => {
    document.body.innerHTML = `
      <div id="reference">
        <div></div>
        <div></div>
        <div>
          werwerwerwer
          <div>
            qwer <span ${DATA_ATTR}>asdf</span> werewwer
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
            qwer <span ${DATA_ATTR}>asdf</span> werewwer
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
    expect(offset).toEqual(2);
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
        <span ${DATA_ATTR}></span>
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

  it('doesn\'t count highlights between text', () => {
    document.body.innerHTML = `
      <div id="reference">
        <div></div>
        <div></div>
        <div>
          werwerwerwer
          <div>
            qwer <span ${DATA_ATTR}>asdf</span> werewwer
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
            qwer <span ${DATA_ATTR}>asdf</span> werewwer
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
        qwer <span ${DATA_ATTR}>asdf</span> werewwer
      </div>
    `;

    const reference = document.getElementById('reference');
    const [result] = xpath.getFirstByXPath("./text()[1]", 18, reference);

    expect(result.textContent.trim()).toEqual('werewwer');
  });

  it('if the offset specifies the start boundary of highlight and text, it returns the text', () => {
    document.body.innerHTML = `
      <div id="reference">
        qwer <span ${DATA_ATTR}>asdf</span> werewwer
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
