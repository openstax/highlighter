import * as serializer from '.';
import { createPage, expectSameRange, findText, PAGE_TEXT, rangeOver } from '../../test-utils/pageWithHighlights';

describe('serialize', () => {
  it('leaves out the labels of a search result before the start', () => {
    const page = createPage();
    page.drawSearchResult('meter');

    const data = serializer.serialize(rangeOver(page.reference, 'cccc'), page.reference);

    expect(data).toEqual({
      endContainer: './text()[1]',
      endOffset: PAGE_TEXT.indexOf('cccc') + 'cccc'.length,
      referenceElementId: 'reference',
      startContainer: './text()[1]',
      startOffset: PAGE_TEXT.indexOf('cccc'),
      type: 'XpathRangeSelectorV2',
    });
  });

  it('leaves out the labels of a search result inside the highlight', () => {
    const page = createPage();
    page.drawSearchResult('meter');
    const [startNode, startOffset] = findText(page.reference, 'aaaa');
    const [endNode, endOffset] = findText(page.reference, 'bbbb');
    const range = document.createRange();
    range.setStart(startNode, startOffset);
    range.setEnd(endNode, endOffset + 'bbbb'.length);

    const data = serializer.serialize(range, page.reference);

    expect(data.endContainer).toEqual('./text()[1]');
    expect(data.endOffset).toEqual(PAGE_TEXT.indexOf('bbbb') + 'bbbb'.length);
  });

  it('saves the same offsets while an earlier highlight is focused', () => {
    const page = createPage();
    page.drawUserHighlight('aaaa');
    const earlierHighlight = page.highlighter.getHighlight('user-aaaa');
    if (!earlierHighlight) {
      throw new Error('the earlier highlight was not drawn');
    }
    earlierHighlight.addFocusedStyles();

    const data = serializer.serialize(rangeOver(page.reference, 'dddd'), page.reference);

    expect(data.startOffset).toEqual(PAGE_TEXT.indexOf('dddd'));
  });
});

describe('load', () => {
  it('loads a highlight saved next to a search result on a page without it', () => {
    const pageWithSearch = createPage();
    pageWithSearch.drawSearchResult('meter');
    const data = serializer.serialize(rangeOver(pageWithSearch.reference, 'cccc'), pageWithSearch.reference);

    const page = createPage();

    expectSameRange(serializer.load(page.highlighter, data), rangeOver(page.reference, 'cccc'));
  });

  it('loads a highlight saved without search results on a page that has them', () => {
    const pageWithoutSearch = createPage();
    const data = serializer.serialize(rangeOver(pageWithoutSearch.reference, 'cccc'), pageWithoutSearch.reference);

    const page = createPage();
    page.drawSearchResult('meter');

    expectSameRange(serializer.load(page.highlighter, data), rangeOver(page.reference, 'cccc'));
  });

  it('loads a highlight saved before an earlier highlight in the same text was made', () => {
    const pageBefore = createPage();
    const data = serializer.serialize(rangeOver(pageBefore.reference, 'jjjj'), pageBefore.reference);

    const page = createPage();
    page.drawUserHighlight('aaaa');

    expectSameRange(serializer.load(page.highlighter, data), rangeOver(page.reference, 'jjjj'));
  });

  it('loads a highlight saved after an earlier highlight that was later deleted', () => {
    const pageWithEarlierHighlight = createPage();
    pageWithEarlierHighlight.drawUserHighlight('aaaa');
    const data = serializer.serialize(
      rangeOver(pageWithEarlierHighlight.reference, 'jjjj'), pageWithEarlierHighlight.reference
    );

    const page = createPage();

    expectSameRange(serializer.load(page.highlighter, data), rangeOver(page.reference, 'jjjj'));
  });

  it('returns an empty range when the reference element is missing', () => {
    const page = createPage();
    const data = serializer.serialize(rangeOver(page.reference, 'cccc'), page.reference);

    const range = serializer.load(page.highlighter, { ...data, referenceElementId: 'missing' });

    expect(range.startContainer).toBe(null);
  });
});

describe('isLoadable', () => {
  const data: serializer.IData = {
    endContainer: './text()[1]',
    endOffset: 4,
    referenceElementId: 'reference',
    startContainer: './text()[1]',
    startOffset: 0,
    type: 'XpathRangeSelectorV2',
  };

  it('returns true when both ends are found', () => {
    const page = createPage();

    expect(serializer.isLoadable(page.highlighter, data)).toBe(true);
  });

  it('returns false when the reference element is missing', () => {
    const page = createPage();

    expect(serializer.isLoadable(page.highlighter, { ...data, referenceElementId: 'missing' })).toBe(false);
  });

  it('returns false when an end is past the text', () => {
    const page = createPage();

    expect(serializer.isLoadable(page.highlighter, { ...data, endOffset: PAGE_TEXT.length + 1 })).toBe(false);
  });
});
