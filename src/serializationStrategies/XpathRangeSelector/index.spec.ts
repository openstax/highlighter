import * as serializer from '.';
import Highlighter from '../../Highlighter';

describe('load', () => {
  it('returns a range', () => {
    document.body.innerHTML = `
      <div id="highlighter">
        <div id="referenceElement">
          asdfasdfasdlf aklsdfj l;dksfj as;ldfkjals;d fjas;ldkfj as;ldfkj
        </div>
      </div>
    `;

    const highligherEl = document.getElementById('highlighter')!;
    const highlighter = new Highlighter(highligherEl, { formatMessage: jest.fn() });
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

    const highligherEl = document.getElementById('highlighter')!;
    const highlighter = new Highlighter(highligherEl, { formatMessage: jest.fn() });
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

    const highligherEl = document.getElementById('highlighter')!;
    const highlighter = new Highlighter(highligherEl, { formatMessage: jest.fn() });
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

    const highligherEl = document.getElementById('highlighter')!;
    const highlighter = new Highlighter(highligherEl, { formatMessage: jest.fn() });
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

    const highligherEl = document.getElementById('highlighter')!;
    const highlighter = new Highlighter(highligherEl, { formatMessage: jest.fn() });
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
