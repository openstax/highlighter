"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Highlight_1 = require("./Highlight");
const Highlighter_1 = require("./Highlighter");
const injectHighlightWrappers_1 = require("./injectHighlightWrappers");
const injectHighlightWrappers_spec_data_1 = require("./injectHighlightWrappers.spec.data");
const messages = {
    'i18n:highlighter:highlight:end': 'End of highlight',
    'i18n:highlighter:highlight:start': 'Start of highlight',
};
describe('inject highlight wrappers for figure with caption', () => {
    let page;
    let img;
    let p;
    let textNode;
    let span;
    let captionTitle;
    let captionContainer;
    let captionTitleText;
    let rangeDefaults;
    let mockMessages;
    const highlightData = { id: 'some-highlight', content: 'asd', style: 'yellow' };
    beforeEach(() => {
        document.body.innerHTML = injectHighlightWrappers_spec_data_1.paragraphFigureAndCaption;
        page = document.getElementById('container');
        img = document.getElementById('test-img');
        p = document.getElementById('test-p');
        textNode = p.childNodes[0];
        span = document.getElementById('test-span');
        captionContainer = document.getElementById('test-caption-container');
        captionTitle = document.getElementById('test-caption-title');
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
            const range = Object.assign({}, rangeDefaults, { endContainer: span, endOffset: 2, startContainer: textNode, startOffset: 2 });
            const highlight = new Highlight_1.default(range, highlightData, { formatMessage: mockMessages });
            const highlighter = new Highlighter_1.default(page, { onClick: jest.fn(), formatMessage: mockMessages });
            highlighter.highlight(highlight);
            const highlightSpans = document.querySelectorAll(`[${injectHighlightWrappers_1.DATA_ATTR}='true']`);
            highlightSpans.forEach((el) => {
                el.classList.add('highlight');
                expect(el).toMatchSnapshot();
            });
        });
        it('in firefox', () => {
            const range = Object.assign({}, rangeDefaults, { endContainer: captionTitleText, endOffset: 0, startContainer: textNode, startOffset: 2 });
            const highlight = new Highlight_1.default(range, highlightData, { formatMessage: mockMessages });
            const highlighter = new Highlighter_1.default(page, { onClick: jest.fn(), formatMessage: mockMessages });
            highlighter.highlight(highlight);
            const highlightSpans = document.querySelectorAll(`[${injectHighlightWrappers_1.DATA_ATTR}='true']`);
            highlightSpans.forEach((el) => {
                expect(el).toMatchSnapshot();
            });
        });
    });
    describe('for highlight starting on an <img>', () => {
        it('in chrome and safari', () => {
            const range = Object.assign({}, rangeDefaults, { endContainer: captionTitleText, endOffset: 6, startContainer: textNode, startOffset: textNode.nodeValue.length });
            const highlight = new Highlight_1.default(range, highlightData, { formatMessage: mockMessages });
            const highlighter = new Highlighter_1.default(page, { onClick: jest.fn(), formatMessage: mockMessages });
            highlighter.highlight(highlight);
            const highlightSpans = document.querySelectorAll(`[${injectHighlightWrappers_1.DATA_ATTR}='true']`);
            highlightSpans.forEach((el) => {
                expect(el).toMatchSnapshot();
            });
        });
        it('in firefox', () => {
            const range = Object.assign({}, rangeDefaults, { endContainer: captionTitleText, endOffset: 6, startContainer: textNode, startOffset: textNode.nodeValue.length });
            const highlight = new Highlight_1.default(range, highlightData, { formatMessage: mockMessages });
            const highlighter = new Highlighter_1.default(page, { onClick: jest.fn(), formatMessage: mockMessages });
            highlighter.highlight(highlight);
            const highlightSpans = document.querySelectorAll(`[${injectHighlightWrappers_1.DATA_ATTR}='true']`);
            highlightSpans.forEach((el) => {
                expect(el).toMatchSnapshot();
            });
        });
    });
    describe('for highlight starting on an <img> where img is first element on page', () => {
        it('in chrome', () => {
            p.remove();
            const range = Object.assign({}, rangeDefaults, { endContainer: captionContainer, endOffset: 0, startContainer: span, startOffset: 1 });
            const highlight = new Highlight_1.default(range, highlightData, { formatMessage: mockMessages });
            const highlighter = new Highlighter_1.default(page, { onClick: jest.fn(), formatMessage: mockMessages });
            highlighter.highlight(highlight);
            const highlightSpans = document.querySelectorAll(`[${injectHighlightWrappers_1.DATA_ATTR}='true']`);
            highlightSpans.forEach((el) => {
                expect(el).toMatchSnapshot();
            });
        });
        it('in firefox', () => {
            p.remove();
            const range = Object.assign({}, rangeDefaults, { endContainer: img, endOffset: 0, startContainer: img, startOffset: 0 });
            const highlight = new Highlight_1.default(range, highlightData, { formatMessage: mockMessages });
            const highlighter = new Highlighter_1.default(page, { onClick: jest.fn(), formatMessage: mockMessages });
            highlighter.highlight(highlight);
            const highlightSpans = document.querySelectorAll(`[${injectHighlightWrappers_1.DATA_ATTR}='true']`);
            highlightSpans.forEach((el) => {
                expect(el).toMatchSnapshot();
            });
        });
        it('in safari', () => {
            p.remove();
            const range = Object.assign({}, rangeDefaults, { endContainer: span, endOffset: 2, startContainer: page, startOffset: 0 });
            const highlight = new Highlight_1.default(range, highlightData, { formatMessage: mockMessages });
            const highlighter = new Highlighter_1.default(page, { onClick: jest.fn(), formatMessage: mockMessages });
            highlighter.highlight(highlight);
            const highlightSpans = document.querySelectorAll(`[${injectHighlightWrappers_1.DATA_ATTR}='true']`);
            highlightSpans.forEach((el) => {
                expect(el).toMatchSnapshot();
            });
        });
    });
    describe('for highlight starting and ending on an <img>', () => {
        it('in chrome and safari', () => {
            const range = Object.assign({}, rangeDefaults, { endContainer: span, endOffset: 2, startContainer: textNode, startOffset: textNode.nodeValue.length });
            const highlight = new Highlight_1.default(range, highlightData, { formatMessage: mockMessages });
            const highlighter = new Highlighter_1.default(page, { onClick: jest.fn(), formatMessage: mockMessages });
            highlighter.highlight(highlight);
            const highlightSpans = document.querySelectorAll(`[${injectHighlightWrappers_1.DATA_ATTR}='true']`);
            highlightSpans.forEach((el) => {
                expect(el).toMatchSnapshot();
            });
        });
        it('in firefox', () => {
            const range = Object.assign({}, rangeDefaults, { endContainer: img, endOffset: 0, startContainer: textNode, startOffset: textNode.nodeValue.length });
            const highlight = new Highlight_1.default(range, highlightData, { formatMessage: mockMessages });
            const highlighter = new Highlighter_1.default(page, { onClick: jest.fn(), formatMessage: mockMessages });
            highlighter.highlight(highlight);
            const highlightSpans = document.querySelectorAll(`[${injectHighlightWrappers_1.DATA_ATTR}='true']`);
            highlightSpans.forEach((el) => {
                expect(el).toMatchSnapshot();
            });
        });
    });
});
describe('inject highlight wrappers for img between paragraphs', () => {
    let section;
    let p1;
    let p2;
    let textNode1;
    let textNode2;
    let rangeDefaults;
    let mockMessages;
    const highlightData = { id: 'some-highlight', content: 'asd', style: 'yellow' };
    beforeEach(() => {
        document.body.innerHTML = injectHighlightWrappers_spec_data_1.imageBetweenParagraphs;
        section = document.getElementById('container');
        p1 = document.getElementById('test-p1');
        p2 = document.getElementById('test-p2');
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
        const range = Object.assign({}, rangeDefaults, { endContainer: textNode2, endOffset: 0, startContainer: textNode1, startOffset: 117 });
        const highlight = new Highlight_1.default(range, highlightData, { formatMessage: mockMessages });
        const highlighter = new Highlighter_1.default(section, { onClick: jest.fn(), formatMessage: mockMessages });
        highlighter.highlight(highlight);
        const highlightSpans = document.querySelectorAll(`[${injectHighlightWrappers_1.DATA_ATTR}='true']`);
        highlightSpans.forEach((el) => {
            expect(el).toMatchSnapshot();
        });
    });
    it('in chrome and safari', () => {
        const range = Object.assign({}, rangeDefaults, { endContainer: p2, endOffset: 0, startContainer: textNode1, startOffset: 117 });
        const highlight = new Highlight_1.default(range, highlightData, { formatMessage: mockMessages });
        const highlighter = new Highlighter_1.default(section, { onClick: jest.fn(), formatMessage: mockMessages });
        highlighter.highlight(highlight);
        const highlightSpans = document.querySelectorAll(`[${injectHighlightWrappers_1.DATA_ATTR}='true']`);
        highlightSpans.forEach((el) => {
            expect(el).toMatchSnapshot();
        });
    });
});
describe('inject highlight wrappers for text followed by section', () => {
    let section;
    let heading;
    let p;
    let textNode1;
    let textNode2;
    let rangeDefaults;
    let mockMessages;
    const highlightData = { id: 'some-highlight', content: 'asd', style: 'yellow' };
    beforeEach(() => {
        document.body.innerHTML = injectHighlightWrappers_spec_data_1.adjacentTextSections;
        section = document.getElementById('test-container');
        heading = document.getElementById('test-span');
        p = document.getElementById('test-p');
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
        const range = Object.assign({}, rangeDefaults, { endContainer: p, endOffset: 0, startContainer: textNode1, startOffset: 0 });
        const highlight = new Highlight_1.default(range, highlightData, { formatMessage: mockMessages });
        const highlighter = new Highlighter_1.default(section, { onClick: jest.fn(), formatMessage: mockMessages });
        highlighter.highlight(highlight);
        const highlightSpans = document.querySelectorAll(`[${injectHighlightWrappers_1.DATA_ATTR}='true']`);
        highlightSpans.forEach((el) => {
            expect(el).toMatchSnapshot();
        });
    });
    it('in firefox', () => {
        const range = Object.assign({}, rangeDefaults, { endContainer: textNode2, endOffset: 0, startContainer: textNode1, startOffset: 0 });
        const highlight = new Highlight_1.default(range, highlightData, { formatMessage: mockMessages });
        const highlighter = new Highlighter_1.default(section, { onClick: jest.fn(), formatMessage: mockMessages });
        highlighter.highlight(highlight);
        const highlightSpans = document.querySelectorAll(`[${injectHighlightWrappers_1.DATA_ATTR}='true']`);
        highlightSpans.forEach((el) => {
            expect(el).toMatchSnapshot();
        });
    });
});
//# sourceMappingURL=injectHighlightWrappers.spec.js.map