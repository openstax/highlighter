import * as serializer from '.';
import { createPage, expectSameRange, findText, PAGE_TEXT, rangeOver } from '../../test-utils/pageWithHighlights';

describe('serialize', () => {
  it('leaves out the labels of a search result before the start', () => {
    const page = createPage();
    page.drawSearchResult('meter');

    const data = serializer.serialize(rangeOver(page.reference, 'roughly'), page.reference);

    expect(data).toEqual({
      endContainer: './text()[1]',
      endOffset: PAGE_TEXT.indexOf('roughly') + 'roughly'.length,
      referenceElementId: 'reference',
      startContainer: './text()[1]',
      startOffset: PAGE_TEXT.indexOf('roughly'),
      type: 'XpathRangeSelectorV2',
    });
  });

  it('leaves out the labels of a search result inside the highlight', () => {
    const page = createPage();
    page.drawSearchResult('meter');
    const [startNode, startOffset] = findText(page.reference, 'Each');
    const [endNode, endOffset] = findText(page.reference, 'equals');
    const range = document.createRange();
    range.setStart(startNode, startOffset);
    range.setEnd(endNode, endOffset + 'equals'.length);

    const data = serializer.serialize(range, page.reference);

    expect(data.endContainer).toEqual('./text()[1]');
    expect(data.endOffset).toEqual(PAGE_TEXT.indexOf('equals') + 'equals'.length);
  });

  it('saves the same offsets while an earlier highlight is focused', () => {
    const page = createPage();
    page.drawUserHighlight('Each');
    const earlierHighlight = page.highlighter.getHighlight('user-Each');
    if (!earlierHighlight) {
      throw new Error('the earlier highlight was not drawn');
    }
    earlierHighlight.addFocusedStyles();

    const data = serializer.serialize(rangeOver(page.reference, 'three'), page.reference);

    expect(data.startOffset).toEqual(PAGE_TEXT.indexOf('three'));
  });
});

describe('load', () => {
  it('loads a highlight saved next to a search result on a page without it', () => {
    const pageWithSearch = createPage();
    pageWithSearch.drawSearchResult('meter');
    const data = serializer.serialize(rangeOver(pageWithSearch.reference, 'roughly'), pageWithSearch.reference);

    const page = createPage();

    expectSameRange(serializer.load(page.highlighter, data), rangeOver(page.reference, 'roughly'));
  });

  it('loads a highlight saved without search results on a page that has them', () => {
    const pageWithoutSearch = createPage();
    const data = serializer.serialize(rangeOver(pageWithoutSearch.reference, 'roughly'), pageWithoutSearch.reference);

    const page = createPage();
    page.drawSearchResult('meter');

    expectSameRange(serializer.load(page.highlighter, data), rangeOver(page.reference, 'roughly'));
  });

  it('loads a highlight saved before an earlier highlight in the same text was made', () => {
    const pageBefore = createPage();
    const data = serializer.serialize(rangeOver(pageBefore.reference, 'average'), pageBefore.reference);

    const page = createPage();
    page.drawUserHighlight('Each');

    expectSameRange(serializer.load(page.highlighter, data), rangeOver(page.reference, 'average'));
  });

  it('loads a highlight saved after an earlier highlight that was later deleted', () => {
    const pageWithEarlierHighlight = createPage();
    pageWithEarlierHighlight.drawUserHighlight('Each');
    const data = serializer.serialize(
      rangeOver(pageWithEarlierHighlight.reference, 'average'), pageWithEarlierHighlight.reference
    );

    const page = createPage();

    expectSameRange(serializer.load(page.highlighter, data), rangeOver(page.reference, 'average'));
  });

  it('loads a highlight that starts inside a search result drawn after it was saved', () => {
    const pageWithoutSearch = createPage();
    const [savedNode, savedOffset] = findText(pageWithoutSearch.reference, 'ter equals');
    const savedRange = document.createRange();
    savedRange.setStart(savedNode, savedOffset);
    savedRange.setEnd(savedNode, savedOffset + 'ter equals'.length);
    const data = serializer.serialize(savedRange, pageWithoutSearch.reference);

    const page = createPage();
    page.drawSearchResult('meter');
    const [hitNode, hitOffset] = findText(page.reference, 'meter');
    const [endNode, endOffset] = findText(page.reference, 'equals');
    const expected = document.createRange();
    expected.setStart(hitNode, hitOffset + 'me'.length);
    expected.setEnd(endNode, endOffset + 'equals'.length);

    expectSameRange(serializer.load(page.highlighter, data), expected);
  });

  it('loads a highlight that ends inside a search result drawn after it was saved', () => {
    const pageWithoutSearch = createPage();
    const [savedNode, savedOffset] = findText(pageWithoutSearch.reference, 'ch me');
    const savedRange = document.createRange();
    savedRange.setStart(savedNode, savedOffset);
    savedRange.setEnd(savedNode, savedOffset + 'ch me'.length);
    const data = serializer.serialize(savedRange, pageWithoutSearch.reference);

    const page = createPage();
    page.drawSearchResult('meter');
    const [startNode, startOffset] = findText(page.reference, 'ch ');
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
      const [endNode, endOffset] = findText(reference, 'equals');
      const result = document.createRange();
      result.setStart(hitNode, hitOffset + 'me'.length);
      result.setEnd(endNode, endOffset + 'equals'.length);
      return result;
    };
    const data = serializer.serialize(range(pageWithSearch.reference), pageWithSearch.reference);

    const page = createPage();
    page.drawSearchResult('meter');

    expectSameRange(serializer.load(page.highlighter, data), range(page.reference));
  });

  it('loads a highlight that starts inside a search result inside another highlight', () => {
    const pageBefore = createPage();
    const [savedNode, savedOffset] = findText(pageBefore.reference, 'ter equals roughly');
    const savedRange = document.createRange();
    savedRange.setStart(savedNode, savedOffset);
    savedRange.setEnd(savedNode, savedOffset + 'ter equals roughly'.length);
    const data = serializer.serialize(savedRange, pageBefore.reference);

    const page = createPage();
    page.drawUserHighlight('Each meter equals');
    page.drawSearchResult('meter');
    const [hitNode, hitOffset] = findText(page.reference, 'meter');
    const [endNode, endOffset] = findText(page.reference, 'roughly');
    const expected = document.createRange();
    expected.setStart(hitNode, hitOffset + 'me'.length);
    expected.setEnd(endNode, endOffset + 'roughly'.length);

    expect(page.reference.querySelector('[data-highlight-id="user-Each meter equals"] .search-highlight')).not.toBe(null);
    expectSameRange(serializer.load(page.highlighter, data), expected);
  });

  it('returns an empty range when the reference element is missing', () => {
    const page = createPage();
    const data = serializer.serialize(rangeOver(page.reference, 'roughly'), page.reference);

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
