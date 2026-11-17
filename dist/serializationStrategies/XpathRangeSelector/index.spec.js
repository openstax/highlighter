"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serializer = require(".");
const Highlighter_1 = require("../../Highlighter");
describe('load', () => {
    it('returns a range', () => {
        document.body.innerHTML = `
      <div id="highlighter">
        <div id="referenceElement">
          asdfasdfasdlf aklsdfj l;dksfj as;ldfkjals;d fjas;ldkfj as;ldfkj
        </div>
      </div>
    `;
        const highligherEl = document.getElementById('highlighter');
        const highlighter = new Highlighter_1.default(highligherEl, { formatMessage: jest.fn() });
        const result = serializer.load(highlighter, {
            endContainer: './text()[1]',
            endOffset: 10,
            referenceElementId: 'referenceElement',
            startContainer: './text()[1]',
            startOffset: 0,
            type: 'XpathRangeSelector',
        });
        expect(result).toBeInstanceOf(Range);
    });
});
describe('isLoadable', () => {
    it('returns true', () => {
        document.body.innerHTML = `
      <div id="highlighter">
        <div id="referenceElement">
          asdfasdfasdlf aklsdfj l;dksfj as;ldfkjals;d fjas;ldkfj as;ldfkj
        </div>
      </div>
    `;
        const highligherEl = document.getElementById('highlighter');
        const highlighter = new Highlighter_1.default(highligherEl, { formatMessage: jest.fn() });
        const result = serializer.isLoadable(highlighter, {
            endContainer: './text()[1]',
            endOffset: 10,
            referenceElementId: 'referenceElement',
            startContainer: './text()[1]',
            startOffset: 0,
            type: 'XpathRangeSelector',
        });
        expect(result).toEqual(true);
    });
    it('returns false when reference element cant be found', () => {
        document.body.innerHTML = `
      <div id="highlighter">
        <div id="referenceElement">
          asdfasdfasdlf aklsdfj l;dksfj as;ldfkjals;d fjas;ldkfj as;ldfkj
        </div>
      </div>
    `;
        const highligherEl = document.getElementById('highlighter');
        const highlighter = new Highlighter_1.default(highligherEl, { formatMessage: jest.fn() });
        const result = serializer.isLoadable(highlighter, {
            endContainer: './text()[1]',
            endOffset: 10,
            referenceElementId: 'doesnt exist',
            startContainer: './text()[1]',
            startOffset: 0,
            type: 'XpathRangeSelector',
        });
        expect(result).toEqual(false);
    });
    it('returns false when start container cant be found', () => {
        document.body.innerHTML = `
      <div id="highlighter">
        <div id="referenceElement">
          asdfasdfasdlf aklsdfj l;dksfj as;ldfkjals;d fjas;ldkfj as;ldfkj
        </div>
      </div>
    `;
        const highligherEl = document.getElementById('highlighter');
        const highlighter = new Highlighter_1.default(highligherEl, { formatMessage: jest.fn() });
        const result = serializer.isLoadable(highlighter, {
            endContainer: './text()[1]',
            endOffset: 10,
            referenceElementId: 'referenceElement',
            startContainer: './text()[8]',
            startOffset: 0,
            type: 'XpathRangeSelector',
        });
        expect(result).toEqual(false);
    });
    it('returns false when end container cant be found', () => {
        document.body.innerHTML = `
      <div id="highlighter">
        <div id="referenceElement">
          asdfasdfasdlf aklsdfj l;dksfj as;ldfkjals;d fjas;ldkfj as;ldfkj
        </div>
      </div>
    `;
        const highligherEl = document.getElementById('highlighter');
        const highlighter = new Highlighter_1.default(highligherEl, { formatMessage: jest.fn() });
        const result = serializer.isLoadable(highlighter, {
            endContainer: './text()[8]',
            endOffset: 10,
            referenceElementId: 'referenceElement',
            startContainer: './text()[0]',
            startOffset: 0,
            type: 'XpathRangeSelector',
        });
        expect(result).toEqual(false);
    });
});
//# sourceMappingURL=index.spec.js.map