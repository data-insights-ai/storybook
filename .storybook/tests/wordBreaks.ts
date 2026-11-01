/**
 * Where a word breaks across lines inside an element: the character offsets
 * at which a new visual line starts within the word. An empty list is a word
 * on one line. Judged from the geometry, so it sees the break the browser
 * drew, hyphen or not.
 */
export function wordBreaks(root: Element, word: string): number[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const start = node.textContent!.indexOf(word);
    if (start < 0) continue;
    const range = document.createRange();
    const topOf = (i: number) => {
      range.setStart(node, start + i);
      range.setEnd(node, start + i + 1);
      // A range that starts at a soft break also returns an empty box at the end of the line before; the glyph is the widest.
      const boxes = Array.from(range.getClientRects());
      return boxes.reduce((wide, box) => (box.width > wide.width ? box : wide), boxes[0]).top;
    };
    const breaks: number[] = [];
    let line = topOf(0);
    for (let i = 1; i < word.length; i++) {
      const top = topOf(i);
      if (top > line + 2) breaks.push(i);
      line = top;
    }
    return breaks;
  }
  throw new Error(`"${word}" is not in the element`);
}
