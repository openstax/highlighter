// import injectHighlightWrappers from './injectHighlightWrappers';

describe('getXPathForElement', () => {
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

    // expect(result).toEqual("./*[name()='div'][3]/*[name()='div'][1]/*[name()='section'][1]/*[name()='div'][1]");
  });
});
