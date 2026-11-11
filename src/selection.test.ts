import { snapSelection } from './selection';

const snap = (text: string, start: number, end: number) => {
  document.body.innerHTML = '<p id="p"></p>';
  const node = document.createTextNode(text);
  document.getElementById('p')!.appendChild(node);

  const range = document.createRange();
  range.setStart(node, start);
  range.setEnd(node, end);

  // jsdom does not implement Selection, so fake the parts snapSelection uses
  const selection = {
    addRange: jest.fn(),
    anchorNode: node,
    anchorOffset: start,
    getRangeAt: () => range,
    rangeCount: 1,
    removeAllRanges: jest.fn(),
  } as unknown as Selection;

  const snapped = snapSelection(selection, { snapWords: true })!;
  return text.slice(snapped.startOffset, snapped.endOffset);
};

describe('snapSelection with snapWords', () => {
  const sentence = 'individuals who are being studied—ranging from';

  it('expands a partial word to the whole word', () => {
    expect(snap('individuals who are being studied', 28, 31)).toBe('studied');
  });

  it('does not extend past an em dash at the end of the selection', () => {
    const end = sentence.indexOf('—');
    expect(snap(sentence, sentence.indexOf('studied'), end)).toBe('studied');
  });

  it('does not extend before an em dash at the start of the selection', () => {
    const start = sentence.indexOf('—') + 1;
    expect(snap(sentence, start, start + 'ranging'.length)).toBe('ranging');
  });

  it('snaps a partial word next to an em dash without crossing it', () => {
    const dash = sentence.indexOf('—');
    expect(snap(sentence, dash - 3, dash - 1)).toBe('studied');
    expect(snap(sentence, dash + 2, dash + 4)).toBe('ranging');
  });

  it.each([['en dash', '–'], ['horizontal bar', '―']])('treats %s as a word break', (_, dash) => {
    const text = `studied${dash}ranging`;
    expect(snap(text, 0, 7)).toBe('studied');
    expect(snap(text, 8, 15)).toBe('ranging');
  });

  it('keeps ASCII hyphenated words together', () => {
    expect(snap('a well-known fact', 4, 6)).toBe('well-known');
  });
});
