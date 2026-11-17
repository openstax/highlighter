import { rangeContentsString } from './rangeContents';
import { createPage, rangeOver } from './test-utils/pageWithHighlights';

describe('rangeContentsString', () => {
  it('returns the text of a range inside a single text node, without the character after it', () => {
    const page = createPage();

    expect(rangeContentsString(rangeOver(page.reference, 'average'))).toEqual('average');
  });
});
