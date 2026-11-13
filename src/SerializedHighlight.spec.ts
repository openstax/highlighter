import Highlight from './Highlight';
import { rangeContentsString } from './rangeContents';
import * as XpathRangeSelector from './serializationStrategies/XpathRangeSelector';
import * as XpathRangeSelectorV2 from './serializationStrategies/XpathRangeSelectorV2';
import SerializedHighlight from './SerializedHighlight';
import { createPage, PAGE_TEXT, rangeOver, USER_LABELS_LENGTH } from './test-utils/pageWithHighlights';

describe('saving a new highlight', () => {
  it('saves an XpathRangeSelectorV2 location', () => {
    const page = createPage();
    const highlight = new Highlight(
      rangeOver(page.reference, 'cccc'), { content: 'cccc', id: 'new', style: 'yellow' }, page.highlighter.getHighlightOptions()
    );

    const payload = highlight.serialize(page.reference).getApiPayload(page.highlighter, highlight);

    expect(payload.locationStrategies).toEqual([{
      end_container: './text()[1]',
      end_offset: PAGE_TEXT.indexOf('cccc') + 'cccc'.length,
      start_container: './text()[1]',
      start_offset: PAGE_TEXT.indexOf('cccc'),
      type: 'XpathRangeSelectorV2',
    }]);
  });
});

describe('migrating an XpathRangeSelector location', () => {
  // Saves 'kkkk' the way older versions did, while an earlier highlight was on the page.
  const savedAfterEarlierHighlight = () => {
    const page = createPage();
    page.drawUserHighlight('aaaa');
    const range = rangeOver(page.reference, 'kkkk');

    return new SerializedHighlight({
      ...XpathRangeSelector.serialize(range, page.reference),
      content: rangeContentsString(range, true),
      id: 'older',
      style: 'yellow',
    });
  };

  it('saved the older offsets counting the labels', () => {
    expect(savedAfterEarlierHighlight().data).toMatchObject({
      startOffset: PAGE_TEXT.indexOf('kkkk') + USER_LABELS_LENGTH,
    });
  });

  it('migrates a highlight whose location finds its saved content', () => {
    const serialized = savedAfterEarlierHighlight();
    const page = createPage();
    page.drawUserHighlight('aaaa');

    expect(serialized.shouldMigrateLocation(page.highlighter)).toBe(true);
  });

  it('migrates a highlight over a word with text after it', () => {
    const savingPage = createPage();
    savingPage.drawUserHighlight('aaaa');
    const range = rangeOver(savingPage.reference, 'jjjj');
    const serialized = new SerializedHighlight({
      ...XpathRangeSelector.serialize(range, savingPage.reference),
      // Older versions saved one character past the end of a range inside a single text node.
      content: 'jjjj ',
      id: 'older',
      style: 'yellow',
    });
    const page = createPage();
    page.drawUserHighlight('aaaa');

    expect(serialized.shouldMigrateLocation(page.highlighter)).toBe(true);
  });

  it('migrates a highlight that starts at the beginning of the paragraph', () => {
    const savingPage = createPage();
    const range = rangeOver(savingPage.reference, 'aaaa');
    const serialized = new SerializedHighlight({
      ...XpathRangeSelector.serialize(range, savingPage.reference),
      // Older versions saved one character past the end of a range inside a single text node.
      content: 'aaaa ',
      id: 'older',
      style: 'yellow',
    });
    const page = createPage();

    expect(serialized.data).toMatchObject({ startContainer: '.', startOffset: 0 });
    expect(serialized.shouldMigrateLocation(page.highlighter)).toBe(true);
  });

  it('does not migrate a highlight whose location finds other text', () => {
    const serialized = savedAfterEarlierHighlight();
    // The earlier highlight was deleted, so the saved offsets point past 'kkkk'.
    const page = createPage();

    expect(serialized.shouldMigrateLocation(page.highlighter)).toBe(false);
  });

  it('does not migrate a highlight whose location cannot be found', () => {
    const serialized = new SerializedHighlight({
      ...savedAfterEarlierHighlight().data,
      startOffset: PAGE_TEXT.length + USER_LABELS_LENGTH + 1,
    });
    const page = createPage();

    expect(serialized.shouldMigrateLocation(page.highlighter)).toBe(false);
  });

  it('does not migrate an XpathRangeSelectorV2 location', () => {
    const page = createPage();
    const range = rangeOver(page.reference, 'kkkk');
    const serialized = new SerializedHighlight({
      ...XpathRangeSelectorV2.serialize(range, page.reference),
      content: rangeContentsString(range),
      id: 'newer',
      style: 'yellow',
    });

    expect(serialized.shouldMigrateLocation(page.highlighter)).toBe(false);
  });

  it('saves the new location from the highlight after it is on the page', () => {
    const serialized = savedAfterEarlierHighlight();
    const page = createPage();
    page.drawUserHighlight('aaaa');
    const expectedLocation = XpathRangeSelectorV2.serialize(rangeOver(page.reference, 'kkkk'), page.reference);

    page.highlighter.highlight(serialized);
    const loaded = page.highlighter.getHighlight('older');
    if (!loaded) {
      throw new Error('the older highlight did not load');
    }

    expect(loaded.serialize().data).toMatchObject(expectedLocation);
  });
});
