export default class Highlight {
  public range: Range;
  public content: string;

  constructor(range: Range, content: string) {
    this.range = range;
    this.content = content;
  }

  public intersects(range: Range): boolean {
    if (!range) {
      return false;
    }
    return this.range.compareBoundaryPoints(Range.START_TO_END, range) !== -1
      && this.range.compareBoundaryPoints(Range.END_TO_START, range) !== 1;
  }
}
