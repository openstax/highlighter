import Highlight from './Highlight';
import Highlighter from './Highlighter';
import { DATA_ATTR } from './injectHighlightWrappers';
import { adjacentTextSections, imageBetweenParagraphs, paragraphFigureAndCaption } from './injectHighlightWrappers.spec.data';

const messages: { [key: string]: string } = {
  'i18n:highlighter:highlight:end': 'End of highlight',
  'i18n:highlighter:highlight:start': 'Start of highlight',
};

describe('inject highlight wrappers for figure with caption', () => {
  let page: HTMLElement;
  let figure: HTMLElement;
  let img: HTMLElement;
  let p: HTMLElement;
  let textNode: Node;
  let span: HTMLElement;
  let captionTitle: HTMLElement;
  let captionContainer: HTMLElement;
  let captionTitleText: Node;
  let rangeDefaults: {};
  let mockMessages: (descriptor: { id: string }) => string;

  const highlightData = { id: 'some-highlight', content: 'asd', style: 'yellow' };

  beforeEach(() => {
    document.body.innerHTML = paragraphFigureAndCaption;
    page = document.getElementById('container')!;
    figure = document.getElementById('test-figure')!;
    img = document.getElementById('test-img')!;
    p = document.getElementById('test-p')!;
    textNode = p.childNodes[0];
    span = document.getElementById('test-span')!;
    captionContainer = document.getElementById('test-caption-container')!;
    captionTitle = document.getElementById('test-caption-title')!;
    captionTitleText = captionTitle.childNodes[0];

    Date.now = jest.fn();

    rangeDefaults = {
      setEndAfter: jest.fn(),
      setStartBefore: jest.fn(),
    };

    mockMessages = jest.fn((descriptor) => messages[descriptor.id]);
  });

  describe('for highlight starting on a <p> and ending on an <img>', () => {

    it('in chrome and safari', () => {
      const range: any = {
        ...rangeDefaults,
        collapsed: false,
        commonAncestorContainer: page,
        endContainer: span,
        endOffset: 2,
        startContainer: textNode,
        startOffset: 2,
      };
      const highlight = new Highlight(range, highlightData, {formatMessage: mockMessages});

      const highlighter = new Highlighter(page, {onClick: jest.fn(), formatMessage: mockMessages});
      highlighter.highlight(highlight);

      const highlightSpans = document.querySelectorAll(`[${DATA_ATTR}='true']`);

      highlightSpans.forEach((el) => {
        el.classList.add('highlight');
        expect(el).toMatchSnapshot();
      });
    });

    it('in firefox', () => {
      const range: any = {
        ...rangeDefaults,
        collapsed: false,
        commonAncestorContainer: page,
        endContainer: img,
        endOffset: 0,
        startContainer: textNode,
        startOffset: 2,
      };

      const highlight = new Highlight(range, highlightData, { formatMessage: mockMessages });

      const highlighter = new Highlighter(page, {onClick: jest.fn(), formatMessage: mockMessages});
      highlighter.highlight(highlight);

      const highlightSpans = document.querySelectorAll(`[${DATA_ATTR}='true']`);

      highlightSpans.forEach((el) => {
        expect(el).toMatchSnapshot();
      });
    });

  });

  describe('for highlight starting on an <img> and ending on the caption', () => {

    it('in chrome and safari', () => {
      const range: any = {
        ...rangeDefaults,
        collapsed: false,
        commonAncestorContainer: page,
        endContainer: captionTitleText,
        endOffset: 6,
        startContainer: textNode,
        startOffset: textNode.nodeValue!.length,
      };

      const highlight = new Highlight(range, highlightData, { formatMessage: mockMessages });

      const highlighter = new Highlighter(page, {onClick: jest.fn(), formatMessage: mockMessages});
      highlighter.highlight(highlight);

      const highlightSpans = document.querySelectorAll(`[${DATA_ATTR}='true']`);

      highlightSpans.forEach((el) => {
        expect(el).toMatchSnapshot();
      });
    });

    it('in firefox', () => {
      const range: any = {
        ...rangeDefaults,
        collapsed: false,
        commonAncestorContainer: figure,
        endContainer: captionTitleText,
        endOffset: 0,
        startContainer: img,
        startOffset: 0,
      };

      const highlight = new Highlight(range, highlightData, { formatMessage: mockMessages });

      const highlighter = new Highlighter(page, {onClick: jest.fn(), formatMessage: mockMessages});
      highlighter.highlight(highlight);

      const highlightSpans = document.querySelectorAll(`[${DATA_ATTR}='true']`);

      highlightSpans.forEach((el) => {
        expect(el).toMatchSnapshot();
      });
    });
  });

  describe('for highlight starting and ending on an <img>', () => {

    it('in chrome and safari', () => {
      const range: any = {
        ...rangeDefaults,
        collapsed: false,
        commonAncestorContainer: page,
        endContainer: span,
        endOffset: 2,
        startContainer: textNode,
        startOffset: textNode.nodeValue!.length,
      };
      const highlight = new Highlight(range, highlightData, { formatMessage: mockMessages });

      const highlighter = new Highlighter(page, {onClick: jest.fn(), formatMessage: mockMessages});
      highlighter.highlight(highlight);

      const highlightSpans = document.querySelectorAll(`[${DATA_ATTR}='true']`);

      highlightSpans.forEach((el) => {
        expect(el).toMatchSnapshot();
      });
    });

    it('in firefox', () => {
      const range: any = {
        ...rangeDefaults,
        collapsed: true,
        commonAncestorContainer: img,
        endContainer: img,
        endOffset: 0,
        startContainer: img,
        startOffset: 0,
      };

      const highlight = new Highlight(range, highlightData, { formatMessage: mockMessages });

      const highlighter = new Highlighter(page, {onClick: jest.fn(), formatMessage: mockMessages});
      highlighter.highlight(highlight);

      const highlightSpans = document.querySelectorAll(`[${DATA_ATTR}='true']`);

      highlightSpans.forEach((el) => {
        expect(el).toMatchSnapshot();
      });
    });
  });

  describe('for highlight starting/ending on an <img> where img is first element on page', () => {

    it('in chrome', () => {
      p.remove();

      const range: any = {
        ...rangeDefaults,
        collapsed: false,
        commonAncestorContainer: page,
        endContainer: captionContainer,
        endOffset: 0,
        startContainer: span,
        startOffset: 1,
      };

      const highlight = new Highlight(range, highlightData, { formatMessage: mockMessages });

      const highlighter = new Highlighter(page, {onClick: jest.fn(), formatMessage: mockMessages});
      highlighter.highlight(highlight);

      const highlightSpans = document.querySelectorAll(`[${DATA_ATTR}='true']`);

      highlightSpans.forEach((el) => {
        expect(el).toMatchSnapshot();
      });
    });

    it('in firefox', () => {
      p.remove();

      const range: any = {
        ...rangeDefaults,
        collapsed: true,
        commonAncestorContainer: img,
        endContainer: img,
        endOffset: 0,
        startContainer: img,
        startOffset: 0,
      };

      const highlight = new Highlight(range, highlightData, { formatMessage: mockMessages });

      const highlighter = new Highlighter(page, {onClick: jest.fn(), formatMessage: mockMessages});
      highlighter.highlight(highlight);

      const highlightSpans = document.querySelectorAll(`[${DATA_ATTR}='true']`);

      highlightSpans.forEach((el) => {
        expect(el).toMatchSnapshot();
      });
    });

    it('in safari', () => {
      p.remove();

      const range: any = {
        ...rangeDefaults,
        collapsed: false,
        commonAncestorContainer: page,
        endContainer: span,
        endOffset: 2,
        startContainer: page,
        startOffset: 0,
      };

      const highlight = new Highlight(range, highlightData, { formatMessage: mockMessages });

      const highlighter = new Highlighter(page, {onClick: jest.fn(), formatMessage: mockMessages});
      highlighter.highlight(highlight);

      const highlightSpans = document.querySelectorAll(`[${DATA_ATTR}='true']`);

      highlightSpans.forEach((el) => {
        expect(el).toMatchSnapshot();
      });
    });
  });
});

describe('inject highlight wrappers for img between paragraphs', () => {
  let section: HTMLElement;
  let p1: HTMLElement;
  let p2: HTMLElement;
  let textNode1: Node;
  let textNode2: Node;
  let rangeDefaults: {};
  let mockMessages: (descriptor: { id: string }) => string;

  const highlightData = { id: 'some-highlight', content: 'asd', style: 'yellow' };

  beforeEach(() => {
    document.body.innerHTML = imageBetweenParagraphs;
    section = document.getElementById('container')!;
    p1 = document.getElementById('test-p1')!;
    p2 = document.getElementById('test-p2')!;
    textNode1 = p1.childNodes[0];
    textNode2 = p2.childNodes[0];

    Date.now = jest.fn();

    rangeDefaults = {
      collapse: false,
      commonAncestorContainer: section,
      setEndAfter: jest.fn(),
      setStartBefore: jest.fn(),
    };

    mockMessages = jest.fn((descriptor) => messages[descriptor.id]);
  });

  it('in firefox', () => {
    const range: any = {
      ...rangeDefaults,
      endContainer: textNode2,
      endOffset: 0,
      startContainer: textNode1,
      startOffset: 117,
    };

    const highlight = new Highlight(range, highlightData, { formatMessage: mockMessages });

    const highlighter = new Highlighter(section, {onClick: jest.fn(), formatMessage: mockMessages});
    highlighter.highlight(highlight);

    const highlightSpans = document.querySelectorAll(`[${DATA_ATTR}='true']`);

    highlightSpans.forEach((el) => {
      expect(el).toMatchSnapshot();
    });
  });

  it('in chrome and safari', () => {
    const range: any = {
      ...rangeDefaults,
      endContainer: p2,
      endOffset: 0,
      startContainer: textNode1,
      startOffset: 117,
    };

    const highlight = new Highlight(range, highlightData, { formatMessage: mockMessages });

    const highlighter = new Highlighter(section, {onClick: jest.fn(), formatMessage: mockMessages});
    highlighter.highlight(highlight);

    const highlightSpans = document.querySelectorAll(`[${DATA_ATTR}='true']`);

    highlightSpans.forEach((el) => {
      expect(el).toMatchSnapshot();
    });
  });
});

describe('inject highlight wrappers for text followed by section', () => {
  let section: HTMLElement;
  let heading: HTMLElement;
  let p: HTMLElement;
  let textNode1: Node;
  let textNode2: Node;
  let rangeDefaults: {};
  let mockMessages: (descriptor: { id: string }) => string;

  const highlightData = { id: 'some-highlight', content: 'asd', style: 'yellow' };

  beforeEach(() => {
    document.body.innerHTML = adjacentTextSections;
    section = document.getElementById('test-container')!;
    heading = document.getElementById('test-span')!;
    p = document.getElementById('test-p')!;
    textNode1 = heading.childNodes[0];
    textNode2 = p.childNodes[0];

    Date.now = jest.fn();

    rangeDefaults = {
      collapse: false,
      commonAncestorContainer: section,
      setEndAfter: jest.fn(),
      setStartBefore: jest.fn(),
    };

    mockMessages = jest.fn((descriptor) => messages[descriptor.id]);
  });

  it('in chrome and safari', () => {
    const range: any = {
      ...rangeDefaults,
      endContainer: p,
      endOffset: 0,
      startContainer: textNode1,
      startOffset: 0,
    };

    const highlight = new Highlight(range, highlightData, { formatMessage: mockMessages });

    const highlighter = new Highlighter(section, {onClick: jest.fn(), formatMessage: mockMessages});
    highlighter.highlight(highlight);

    const highlightSpans = document.querySelectorAll(`[${DATA_ATTR}='true']`);

    highlightSpans.forEach((el) => {
      expect(el).toMatchSnapshot();
    });
  });

  it('in firefox', () => {
    const range: any = {
      ...rangeDefaults,
      endContainer: textNode2,
      endOffset: 0,
      startContainer: textNode1,
      startOffset: 0,
    };

    const highlight = new Highlight(range, highlightData, { formatMessage: mockMessages });

    const highlighter = new Highlighter(section, {onClick: jest.fn(), formatMessage: mockMessages});
    highlighter.highlight(highlight);

    const highlightSpans = document.querySelectorAll(`[${DATA_ATTR}='true']`);

    highlightSpans.forEach((el) => {
      expect(el).toMatchSnapshot();
    });
  });
});
