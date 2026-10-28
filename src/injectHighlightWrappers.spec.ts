import Highlight from './Highlight';
import Highlighter from './Highlighter';
import { DATA_ATTR } from './injectHighlightWrappers';
import { adjacentTextSections, imageBetweenParagraphs, paragraphFigureAndCaption } from './injectHighlightWrappers.spec.data';

const messages: { [key: string]: string } = {
  'i18n:highlighter:highlight:end': 'End of highlight',
  'i18n:highlighter:highlight:start': 'Start of highlight',
  'i18n:highlighter:highlight:start-selected': 'Start of selected highlight',
};

const START_MESSAGE = messages['i18n:highlighter:highlight:start'];
const END_MESSAGE = messages['i18n:highlighter:highlight:end'];

const screenReaderSpans = (wrapper: Element) => Array.from(wrapper.querySelectorAll('[data-for-screenreaders]'));

/**
 * A highlight has one start span at the top of its first wrapper and one end span at the bottom of
 * its last wrapper. No other wrapper has either.
 */
const expectSpansOnlyAtTheEnds = (wrappers: NodeListOf<Element>) => {
  wrappers.forEach((wrapper) => {
    const spans = screenReaderSpans(wrapper);
    const starts = spans.filter((span) => span.textContent === START_MESSAGE);
    const ends = spans.filter((span) => span.textContent === END_MESSAGE);
    const isFirst = wrapper.classList.contains('first');
    const isLast = wrapper.classList.contains('last');

    expect(starts).toHaveLength(isFirst ? 1 : 0);
    expect(ends).toHaveLength(isLast ? 1 : 0);
    expect(spans).toHaveLength(starts.length + ends.length);

    if (isFirst) {
      expect(wrapper.firstElementChild).toBe(starts[0]);
    }
    if (isLast) {
      expect(wrapper.lastElementChild).toBe(ends[0]);
    }
  });
};

/**
 * Checks where the screen reader spans are, then snapshots the wrappers without them, so the
 * snapshots only change when the wrapping does. The spans themselves are tested in
 * "screen reader spans".
 */
const expectWrappers = (wrappers: NodeListOf<Element>) => {
  expectSpansOnlyAtTheEnds(wrappers);

  wrappers.forEach((wrapper) => {
    const copy = wrapper.cloneNode(true) as Element;

    screenReaderSpans(copy).forEach((span) => span.remove());
    copy.normalize();
    expect(copy).toMatchSnapshot();
  });
};

describe('inject highlight wrappers for figure with caption', () => {
  let page: HTMLElement;
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
    img = document.getElementById('test-img')!;
    p = document.getElementById('test-p')!;
    textNode = p.childNodes[0];
    span = document.getElementById('test-span')!;
    captionContainer = document.getElementById('test-caption-container')!;
    captionTitle = document.getElementById('test-caption-title')!;
    captionTitleText = captionTitle.childNodes[0];

    Date.now = jest.fn();

    rangeDefaults = {
      collapse: false,
      commonAncestorContainer: page,
      setEndAfter: jest.fn(),
      setStartBefore: jest.fn(),
    };

    mockMessages = jest.fn((descriptor) => messages[descriptor.id]);
  });

  describe('for highlight ending on an <img>', () => {

    it('in chrome and safari', () => {
      const range: any = {
        ...rangeDefaults,
        endContainer: span,
        endOffset: 2,
        startContainer: textNode,
        startOffset: 2,
      };
      const highlight = new Highlight(range, highlightData, {formatMessage: mockMessages});

      const highlighter = new Highlighter(page, {onClick: jest.fn(), formatMessage: mockMessages});
      highlighter.highlight(highlight);

      const highlightSpans = document.querySelectorAll(`[${DATA_ATTR}='true']`);

      highlightSpans.forEach((el) => el.classList.add('highlight'));
      expectWrappers(highlightSpans);
    });

    it('in firefox', () => {
      const range: any = {
        ...rangeDefaults,
        endContainer: captionTitleText,
        endOffset: 0,
        startContainer: textNode,
        startOffset: 2,
      };

      const highlight = new Highlight(range, highlightData, { formatMessage: mockMessages });

      const highlighter = new Highlighter(page, {onClick: jest.fn(), formatMessage: mockMessages});
      highlighter.highlight(highlight);

      const highlightSpans = document.querySelectorAll(`[${DATA_ATTR}='true']`);

      expectWrappers(highlightSpans);
    });
  });

  describe('for highlight starting on an <img>', () => {

    it('in chrome and safari', () => {
      const range: any = {
        ...rangeDefaults,
        endContainer: captionTitleText,
        endOffset: 6,
        startContainer: textNode,
        startOffset: textNode.nodeValue!.length,
      };

      const highlight = new Highlight(range, highlightData, { formatMessage: mockMessages, tabbable: true });

      const highlighter = new Highlighter(page, {onClick: jest.fn(), formatMessage: mockMessages});
      highlighter.highlight(highlight);

      const highlightSpans = document.querySelectorAll(`[${DATA_ATTR}='true']`);

      expectWrappers(highlightSpans);
    });

    it('in firefox', () => {
      const range: any = {
        ...rangeDefaults,
        endContainer: captionTitleText,
        endOffset: 6,
        startContainer: textNode,
        startOffset: textNode.nodeValue!.length,
      };

      const highlight = new Highlight(range, highlightData, { formatMessage: mockMessages });

      const highlighter = new Highlighter(page, {onClick: jest.fn(), formatMessage: mockMessages});
      highlighter.highlight(highlight);

      const highlightSpans = document.querySelectorAll(`[${DATA_ATTR}='true']`);

      expectWrappers(highlightSpans);
    });
  });

  describe('for highlight starting on an <img> where img is first element on page', () => {

    it('in chrome', () => {
      p.remove();

      const range: any = {
        ...rangeDefaults,
        endContainer: captionContainer,
        endOffset: 0,
        startContainer: span,
        startOffset: 1,
      };

      const highlight = new Highlight(range, highlightData, { formatMessage: mockMessages });

      const highlighter = new Highlighter(page, {onClick: jest.fn(), formatMessage: mockMessages});
      highlighter.highlight(highlight);

      const highlightSpans = document.querySelectorAll(`[${DATA_ATTR}='true']`);

      expectWrappers(highlightSpans);
    });

    it('in firefox', () => {
      p.remove();

      const range: any = {
        ...rangeDefaults,
        endContainer: img,
        endOffset: 0,
        startContainer: img,
        startOffset: 0,
      };

      const highlight = new Highlight(range, highlightData, { formatMessage: mockMessages });

      const highlighter = new Highlighter(page, {onClick: jest.fn(), formatMessage: mockMessages});
      highlighter.highlight(highlight);

      const highlightSpans = document.querySelectorAll(`[${DATA_ATTR}='true']`);

      expectWrappers(highlightSpans);
    });

    it('in safari', () => {
      p.remove();

      const range: any = {
        ...rangeDefaults,
        endContainer: span,
        endOffset: 2,
        startContainer: page,
        startOffset: 0,
      };

      const highlight = new Highlight(range, highlightData, { formatMessage: mockMessages });

      const highlighter = new Highlighter(page, {onClick: jest.fn(), formatMessage: mockMessages});
      highlighter.highlight(highlight);

      const highlightSpans = document.querySelectorAll(`[${DATA_ATTR}='true']`);

      expectWrappers(highlightSpans);
    });
  });

  describe('for highlight starting and ending on an <img>', () => {

    it('in chrome and safari', () => {
      const range: any = {
        ...rangeDefaults,
        endContainer: span,
        endOffset: 2,
        startContainer: textNode,
        startOffset: textNode.nodeValue!.length,
      };
      const highlight = new Highlight(range, highlightData, { formatMessage: mockMessages });

      const highlighter = new Highlighter(page, {onClick: jest.fn(), formatMessage: mockMessages});
      highlighter.highlight(highlight);

      const highlightSpans = document.querySelectorAll(`[${DATA_ATTR}='true']`);

      expectWrappers(highlightSpans);
    });

    it('in firefox', () => {
      const range: any = {
        ...rangeDefaults,
        endContainer: img,
        endOffset: 0,
        startContainer: textNode,
        startOffset: textNode.nodeValue!.length,
      };

      const highlight = new Highlight(range, highlightData, { formatMessage: mockMessages });

      const highlighter = new Highlighter(page, {onClick: jest.fn(), formatMessage: mockMessages});
      highlighter.highlight(highlight);

      const highlightSpans = document.querySelectorAll(`[${DATA_ATTR}='true']`);

      expectWrappers(highlightSpans);
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

    expectWrappers(highlightSpans);
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

    expectWrappers(highlightSpans);
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

    expectWrappers(highlightSpans);
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

    expectWrappers(highlightSpans);
  });
});

describe('screen reader spans', () => {
  const mockMessages = jest.fn((descriptor: { id: string }) => messages[descriptor.id]);

  /**
   * Highlights some text in the first paragraph. With `acrossElements` the highlight ends in the
   * figure that follows, so it gets more than one wrapper.
   */
  const highlightText = (options: { tabbable?: boolean, acrossElements?: boolean } = {}) => {
    document.body.innerHTML = paragraphFigureAndCaption;
    const page = document.getElementById('container')!;
    const textNode = document.getElementById('test-p')!.childNodes[0];
    const range: any = {
      collapse: false,
      commonAncestorContainer: page,
      endContainer: options.acrossElements ? document.getElementById('test-span')! : textNode,
      endOffset: options.acrossElements ? 2 : 6,
      setEndAfter: jest.fn(),
      setStartBefore: jest.fn(),
      startContainer: textNode,
      startOffset: 2,
    };
    const highlight = new Highlight(range, highlightData, { formatMessage: mockMessages, tabbable: options.tabbable });

    const highlighter = new Highlighter(page, { onClick: jest.fn(), formatMessage: mockMessages });

    highlighter.highlight(highlight);

    return { highlight, highlighter, spans: document.querySelectorAll('[data-for-screenreaders]') };
  };

  const highlightData = { id: 'some-highlight', content: 'asd', style: 'yellow' };

  // The only snapshots that keep the spans. The wrapper snapshots above leave them out so they only
  // change when the wrapping does; these pin the exact markup a screen reader gets.
  describe('markup', () => {
    const wrapper = () => document.querySelector(`[${DATA_ATTR}='true']`);

    it('when tabbable', () => {
      highlightText({ tabbable: true });

      expect(wrapper()).toMatchSnapshot();
    });

    it('when not tabbable', () => {
      highlightText();

      expect(wrapper()).toMatchSnapshot();
    });
  });

  it('names the start span, which can take focus, with its text', () => {
    const [start] = Array.from(highlightText({ tabbable: true }).spans);

    expect(start.textContent).toBe('Start of highlight');
    expect(start.getAttribute('role')).toBe('note');
    expect(start.getAttribute('aria-label')).toBe('Start of highlight');
    expect(start.getAttribute('tabindex')).toBe('0');
  });

  it('names the start span when it is not tabbable too', () => {
    const [start] = Array.from(highlightText().spans);

    expect(start.getAttribute('aria-label')).toBe('Start of highlight');
    expect(start.getAttribute('tabindex')).toBe('-1');
  });

  it('leaves the end span as plain text', () => {
    const [, end] = Array.from(highlightText({ tabbable: true }).spans);

    expect(end.textContent).toBe('End of highlight');
    expect(end.hasAttribute('role')).toBe(false);
    expect(end.hasAttribute('aria-label')).toBe(false);
  });

  describe('when the highlight is selected', () => {
    it('changes the start span\'s name along with its text', () => {
      const { highlight, spans } = highlightText({ tabbable: true });
      const [start] = Array.from(spans);

      highlight.addFocusedStyles();

      expect(start.textContent).toBe('Start of selected highlight');
      expect(start.getAttribute('aria-label')).toBe('Start of selected highlight');
    });

    it('puts the name back when the selection is cleared', () => {
      const { highlight, highlighter, spans } = highlightText({ tabbable: true });
      const [start] = Array.from(spans);

      highlight.addFocusedStyles();

      expect(start.getAttribute('aria-label')).toBe('Start of selected highlight');

      highlighter.clearFocusedStyles();

      expect(start.textContent).toBe('Start of highlight');
      expect(start.getAttribute('aria-label')).toBe('Start of highlight');
    });

    it('leaves the end span alone', () => {
      const { highlight, spans } = highlightText({ tabbable: true });
      const [, end] = Array.from(spans);

      highlight.addFocusedStyles();

      expect(end.textContent).toBe('End of highlight');
      expect(end.hasAttribute('aria-label')).toBe(false);
    });

    describe('across several wrappers', () => {
      const wrappers = () => Array.from(document.querySelectorAll(`[${DATA_ATTR}='true']`));

      it('changes only the start span, which is in the first wrapper', () => {
        const { highlight, spans } = highlightText({ tabbable: true, acrossElements: true });
        const [start, end] = Array.from(spans);

        expect(wrappers().length).toBeGreaterThan(1);
        expect(spans).toHaveLength(2);

        highlight.addFocusedStyles();

        expect(start.textContent).toBe('Start of selected highlight');
        expect(start.getAttribute('aria-label')).toBe('Start of selected highlight');
        expect(end.textContent).toBe('End of highlight');
        expect(end.hasAttribute('aria-label')).toBe(false);
        expect(wrappers().every((el) => el.getAttribute('aria-current') === 'true')).toBe(true);
      });

      it('puts the start span back when the selection is cleared', () => {
        const { highlight, highlighter, spans } = highlightText({ tabbable: true, acrossElements: true });
        const [start] = Array.from(spans);

        highlight.addFocusedStyles();
        highlighter.clearFocusedStyles();

        expect(start.textContent).toBe('Start of highlight');
        expect(start.getAttribute('aria-label')).toBe('Start of highlight');
        expect(wrappers().some((el) => el.hasAttribute('aria-current'))).toBe(false);
      });
    });
  });
});
