import { getContentPath } from './contentPath';
import Highlighter from './Highlighter';
import { adjacentTextSections } from './injectHighlightWrappers.spec.data';
import { IData as TextPositionData } from './serializationStrategies/TextPositionSelector';
import { IData as XpathRangeData } from './serializationStrategies/XpathRangeSelector';

describe('getContentPath', () => {
  describe('with XpathRangeSelector type', () => {
    it('creates a path of indexes', () => {
      document.body.innerHTML = `<div id="page">${adjacentTextSections}</div>`;

      const container = document.getElementById('page')!;
      const highlighter = new Highlighter(container, { formatMessage: jest.fn() });

      const result = getContentPath(
        {
          referenceElementId: 'test-container',
          // tslint:disable-next-line quotemark
          startContainer: "./*[name()='section'][1]/*[name()='div'][1]/*[name()='p'][1]/text()[1]",
          startOffset: 4,
          type: 'XpathRangeSelector',
        } as XpathRangeData,
        highlighter
      );

      expect(result).toEqual([3, 1, 1, 0, 4]);
    });

    it('handles adjacent text highlights', () => {
      document.body.innerHTML = `<div id="page">
      <div id="test-container">
        <p id="test-p">
          <span data-highlighted>A shortcut called</span> FOIL is sometimes used to find the product of two binomials.
        </p>
      </div>
      </div>`;

      const container = document.getElementById('test-container')!;
      const highlighter = new Highlighter(container, { formatMessage: jest.fn() });

      const range: any = {
        collapse: false,
        commonAncestorContainer: container,
        endContainer: './text()[1]',
        endOffset: 31,
        setEndAfter: jest.fn(),
        setStartBefore: jest.fn(),
        startContainer: './text()[1]',
        startOffset: 27,
      };

      const result = getContentPath(
        {
          referenceElementId: 'test-p',
          startContainer: range.startContainer,
          startOffset: range.startOffset,
          type: 'XpathRangeSelector',
        } as XpathRangeData,
        highlighter
      );

      expect(result).toEqual([0, 27]);
    });
  });

  describe('with TextPositionSelector type', () => {
    it('returns a simplified path and offset', () => {
      document.body.innerHTML = `<div id="page">
      <div id="test-container">
        A shortcut called FOIL is sometimes used to find the product of two binomials.
      </div>
      </div>`;

      const container = document.getElementById('page')!;
      const highlighter = new Highlighter(container, { formatMessage: jest.fn() });

      const result = getContentPath(
        {
          end: 11,
          referenceElementId: 'test-container',
          start: 3,
          type: 'TextPositionSelector',
        } as TextPositionData,
        highlighter
      );

      expect(result).toEqual([0, 3]);
    });
  });
});
