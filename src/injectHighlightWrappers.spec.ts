import Highlight from './Highlight';
import injectHighlightWrappers, { DATA_ATTR } from './injectHighlightWrappers';

// tslint:disable: max-line-length
const testHTML = `
  <div id="reference" class="page-content">
    <div id="main-content">
      <div id="container" data-type="page">
        <p id="test-p">A hardware store sells 16-ft ladders and 24-ft ladders. A window is located 12 feet above the ground. A ladder needs to be purchased that will reach the window from a point on the ground 5 feet from the building.</p>
        <div class="os-figure" id="Figure_01_03_001">
          <figure data-id="Figure_01_03_001" class="small">
            <span id="test-span" data-type="media" id="fs-id1167339431507" data-alt="A right triangle with a base of 5 feet, a height of 12 feet, and a hypotenuse labeled c">
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

describe('inject highlight wrappers', () => {
  let page: HTMLElement;
  let img: HTMLElement;
  let p: HTMLElement;
  let textNode: Node;
  let span: HTMLElement;

  const highlightData = { id: 'some-highlight', content: 'asd', style: 'yellow' };

  beforeEach(() => {
    document.body.innerHTML = testHTML;
    page = document.getElementById('container')!;
    img = document.getElementById('test-img')!;
    p = document.getElementById('test-p')!;
    textNode = p.childNodes[0];
    span = document.getElementById('test-span')!;
  });

  describe('for highlight ending on an <img>', () => {

    it('in chrome and safari', () => {
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
      const highlight = new Highlight(range, highlightData, { formatMessage: jest.fn() });

      injectHighlightWrappers(highlight);
      const highlightSpans = document.querySelectorAll(`[${DATA_ATTR}='true']`);

      expect(highlightSpans[0].innerHTML).toMatchSnapshot();
      expect(highlightSpans[1].innerHTML).toMatchSnapshot();
    });

    it('in firefox', () => {
      // extra whitespace in firefox
      span.prepend('\n');
      span.append('\n');

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

      const highlight = new Highlight(range, highlightData, { formatMessage: jest.fn() });

      injectHighlightWrappers(highlight);
      const highlightSpans = document.querySelectorAll(`[${DATA_ATTR}='true']`);

      expect(highlightSpans[0].innerHTML).toMatchSnapshot();
      expect(highlightSpans[1].innerHTML).toMatchSnapshot();
    });
  });

  describe('for highlight beginning and ending on an <img>', () => {

    it('in chrome', () => {
      // const range: any = {
      //   collapse: false,
      //   commonAncestorContainer: page,
      //   endContainer: img,
      //   endOffset: 0,
      //   setEndAfter: jest.fn(),
      //   setStartBefore: jest.fn(),
      //   startContainer: textNode,
      //   startOffset: 17,
      // };
      // const highlight = new Highlight(range, highlightData, { formatMessage: jest.fn() });

      // injectHighlightWrappers(highlight);
      // const highlightSpans = document.querySelectorAll(`[${DATA_ATTR}='true']`);

      // expect(highlightSpans[0].innerHTML).toMatchSnapshot();
      // expect(highlightSpans[1].innerHTML).toMatchSnapshot();
    });

    it('in firefox', () => {
      // extra whitespace in firefox
      span.prepend('\n');
      span.append('\n');

      const range: any = {
        collapse: false,
        commonAncestorContainer: page,
        endContainer: img,
        endOffset: 0,
        setEndAfter: jest.fn(),
        setStartBefore: jest.fn(),
        startContainer: textNode,
        startOffset: textNode.nodeValue ? textNode.nodeValue.length : 0,
      };

      const highlight = new Highlight(range, highlightData, { formatMessage: jest.fn() });

      injectHighlightWrappers(highlight);
      const highlightSpans = document.querySelectorAll(`[${DATA_ATTR}='true']`);

      expect(highlightSpans[0].innerHTML).toMatchSnapshot();
    });
  });
});
