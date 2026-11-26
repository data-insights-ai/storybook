/**
 * The widths a measured grid locks, from the widths its head settled on.
 * Those are fractions of a pixel, and the fixed layout can land a fraction
 * short of one, so the widest value of a column — the one that set it — is
 * cut with an ellipsis though it fits; how far short depends on how the
 * platform draws text. Each column is rounded up to a whole pixel. While the
 * grid fits its frame, the pixels that adds come off the column that can
 * spare them, the filling one or else the widest, so it still fits; a grid
 * that scrolls sideways just grows by them.
 */
export function wholeColumns(widths: number[], fill: number, overflowing: boolean): number[] {
  const whole = widths.map((width) => Math.ceil(width));
  if (overflowing || whole.length === 0) return whole;
  const gives = fill >= 0 && fill < widths.length ? fill : widest(widths);
  const total = widths.reduce((sum, width) => sum + width, 0);
  const others = whole.reduce((sum, width, i) => (i === gives ? sum : sum + width), 0);
  whole[gives] = Math.floor(total - others);
  return whole;
}

function widest(widths: number[]) {
  return widths.reduce((at, width, i) => (width > widths[at] ? i : at), 0);
}
