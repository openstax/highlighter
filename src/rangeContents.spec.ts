import { rangeContentsString } from './rangeContents';
import { createPage, rangeOver } from './test-utils/pageWithHighlights';

describe('rangeContentsString', () => {
  it('returns the text of a range inside a single text node', () => {
    const page = createPage();

    expect(rangeContentsString(rangeOver(page.reference, 'jjjj'))).toEqual('jjjj');
  });

  it('adds the character after the end when asked to, like content saved by older versions', () => {
    const page = createPage();

    expect(rangeContentsString(rangeOver(page.reference, 'jjjj'), true)).toEqual('jjjj ');
  });
});
