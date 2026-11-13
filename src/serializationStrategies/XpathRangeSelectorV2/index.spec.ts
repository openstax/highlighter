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

  it('loads a highlight that starts inside a search result drawn after it was saved', () => {
    const pageWithoutSearch = createPage();
    const [savedNode, savedOffset] = findText(pageWithoutSearch.reference, 'ter bbbb');
    const savedRange = document.createRange();
    savedRange.setStart(savedNode, savedOffset);
    savedRange.setEnd(savedNode, savedOffset + 'ter bbbb'.length);
    const data = serializer.serialize(savedRange, pageWithoutSearch.reference);

    const page = createPage();
    page.drawSearchResult('meter');
    const [hitNode, hitOffset] = findText(page.reference, 'meter');
    const [endNode, endOffset] = findText(page.reference, 'bbbb');
    const expected = document.createRange();
    expected.setStart(hitNode, hitOffset + 'me'.length);
    expected.setEnd(endNode, endOffset + 'bbbb'.length);

    expectSameRange(serializer.load(page.highlighter, data), expected);
  });

  it('loads a highlight that ends inside a search result drawn after it was saved', () => {
    const pageWithoutSearch = createPage();
    const [savedNode, savedOffset] = findText(pageWithoutSearch.reference, 'aa me');
    const savedRange = document.createRange();
    savedRange.setStart(savedNode, savedOffset);
    savedRange.setEnd(savedNode, savedOffset + 'aa me'.length);
    const data = serializer.serialize(savedRange, pageWithoutSearch.reference);

    const page = createPage();
    page.drawSearchResult('meter');
    const [startNode, startOffset] = findText(page.reference, 'aa ');
    const [hitNode, hitOffset] = findText(page.reference, 'meter');
    const expected = document.createRange();
    expected.setStart(startNode, startOffset);
    expected.setEnd(hitNode, hitOffset + 'me'.length);

    expectSameRange(serializer.load(page.highlighter, data), expected);
  });

  it('loads a highlight that was saved and loaded starting inside the same search result', () => {
    const pageWithSearch = createPage();
    pageWithSearch.drawSearchResult('meter');
    const range = (reference: HTMLElement) => {
      const [hitNode, hitOffset] = findText(reference, 'meter');
      const [endNode, endOffset] = findText(reference, 'bbbb');
      const result = document.createRange();
      result.setStart(hitNode, hitOffset + 'me'.length);
      result.setEnd(endNode, endOffset + 'bbbb'.length);
      return result;
    };
    const data = serializer.serialize(range(pageWithSearch.reference), pageWithSearch.reference);

    const page = createPage();
    page.drawSearchResult('meter');

    expectSameRange(serializer.load(page.highlighter, data), range(page.reference));
  });

  it('loads a highlight that starts inside a search result inside another highlight', () => {
    const pageBefore = createPage();
    const [savedNode, savedOffset] = findText(pageBefore.reference, 'ter bbbb cccc');
    const savedRange = document.createRange();
    savedRange.setStart(savedNode, savedOffset);
    savedRange.setEnd(savedNode, savedOffset + 'ter bbbb cccc'.length);
    const data = serializer.serialize(savedRange, pageBefore.reference);

    const page = createPage();
    page.drawUserHighlight('aaaa meter bbbb');
    page.drawSearchResult('meter');
    const [hitNode, hitOffset] = findText(page.reference, 'meter');
    const [endNode, endOffset] = findText(page.reference, 'cccc');
    const expected = document.createRange();
    expected.setStart(hitNode, hitOffset + 'me'.length);
    expected.setEnd(endNode, endOffset + 'cccc'.length);

    expect(page.reference.querySelector('[data-highlight-id="user-aaaa meter bbbb"] .search-highlight')).not.toBe(null);
    expectSameRange(serializer.load(page.highlighter, data), expected);
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
