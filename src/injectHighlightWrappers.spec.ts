import Highlight from './Highlight';
import injectHighlightWrappers, { DATA_ATTR } from './injectHighlightWrappers';

// tslint:disable: max-line-length
const firefoxHTML = `
  <div id="reference" class="page-content">
    <div id="main-content">
      <div id="container" data-type="page">
        <p id="test-p">A hardware store sells 16-ft ladders and 24-ft ladders. A window is located 12 feet above the ground. A ladder needs to be purchased that will reach the window from a point on the ground 5 feet from the building.</p>
        <div class="os-figure" id="Figure_01_03_001">
          <figure data-id="Figure_01_03_001" class="small">
            <span data-type="media" id="fs-id1167339431507" data-alt="A right triangle with a base of 5 feet, a height of 12 feet, and a hypotenuse labeled c">\n
              <img id="test-img" src="/apps/archive/20210713.205645/resources/b1b5ba97150addc831c534413ca324a72c4e374b" data-media-type="image/jpg" alt="A right triangle with a base of 5 feet, a height of 12 feet, and a hypotenuse labeled c" id="3">\n
            </span>
          </figure>
          <div class="os-caption-container">
            <span class="os-title-label">Figure </span>
            <span class="os-number">1</span>
            <span class="os-divider"> </span>
            <span class="os-divider"> </span>
          </div>
        </div>
      </div>
    </div>
  </div>`;

const chromeHTML = `
  <div id="reference" class="page-content">
    <div id="main-content">
      <div id="container" data-type="page">
        <p id="test-p">A hardware store sells 16-ft ladders and 24-ft ladders. A window is located 12 feet above the ground. A ladder needs to be purchased that will reach the window from a point on the ground 5 feet from the building.</p>
        <div class="os-figure" id="Figure_01_03_001">
          <figure data-id="Figure_01_03_001" class="small">
            <span data-type="media" id="fs-id1167339431507" data-alt="A right triangle with a base of 5 feet, a height of 12 feet, and a hypotenuse labeled c">
              <img id="test-img" src="/apps/archive/20210713.205645/resources/b1b5ba97150addc831c534413ca324a72c4e374b" data-media-type="image/jpg" alt="A right triangle with a base of 5 feet, a height of 12 feet, and a hypotenuse labeled c" id="3">
            </span>
          </figure>
          <div class="os-caption-container">
            <span class="os-title-label">Figure </span>
            <span class="os-number">1</span>
            <span class="os-divider"> </span>
            <span class="os-divider"> </span>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

// const safariHTML = '';

describe('inject highlight wrappers in firefox', () => {

  it('for highlight ending on an <img>', () => {
    document.body.innerHTML = firefoxHTML;

    const page = document.getElementById('container')!;
    const img = document.getElementById('test-img')!;
    const p = document.getElementById('test-p')!;
    const textNode = p.childNodes[0];
    const range: any = {
      collapse: false,
      commonAncestorContainer: page,
      endContainer: img,
      endOffset: 0,
      setEndAfter: jest.fn(),
      setStartBefore: jest.fn(),
      startContainer: textNode,
      startOffset: 17,
    };

    const highlight = new Highlight(range, { id: 'some-highlight', content: 'asd', style: 'yellow' }, { formatMessage: jest.fn() });

    injectHighlightWrappers(highlight);
    const highlightSpans = document.querySelectorAll(`[${DATA_ATTR}='true']`);

    expect(highlightSpans[0].innerHTML).toMatchSnapshot();
    expect(highlightSpans[1].innerHTML).toMatchSnapshot();
  });
});

describe('inject highlight wrappers in chrome', () => {

  it('for highlight ending on an <img>', () => {
    document.body.innerHTML = chromeHTML;

    const page = document.getElementById('container')!;
    const img = document.getElementById('test-img')!;
    const p = document.getElementById('test-p')!;
    const textNode = p.childNodes[0];
    const range: any = {
      collapse: false,
      commonAncestorContainer: page,
      endContainer: img,
      endOffset: 0,
      setEndAfter: jest.fn(),
      setStartBefore: jest.fn(),
      startContainer: textNode,
      startOffset: 17,
    };

    const highlight = new Highlight(range, { id: 'some-highlight', content: 'asd', style: 'yellow' }, { formatMessage: jest.fn() });

    injectHighlightWrappers(highlight);
    const highlightSpans = document.querySelectorAll(`[${DATA_ATTR}='true']`);

    expect(highlightSpans[0].innerHTML).toMatchSnapshot();
    expect(highlightSpans[1].innerHTML).toMatchSnapshot();
  });
});
