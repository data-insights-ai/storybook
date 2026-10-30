// The chart's text is mono, so a label's width follows from its length.
export const textWidth = (text: string, fontPx: number) => text.length * fontPx * 0.6;

export type Side = "right" | "left";

// Left to right, a label sits right of its mark, or left of it where it would
// run off the plot, and only where it overprints no label already placed.
export function placeLabels(
  marks: { x: number; width: number }[],
  plotWidth: number,
  reserved: [number, number][] = [],
): (Side | undefined)[] {
  const taken = [...reserved];
  return marks.map(({ x, width }) => {
    const side: Side = x + width <= plotWidth ? "right" : "left";
    const span: [number, number] = side === "right" ? [x, x + width] : [x - width, x];
    if (span[0] < 0 || taken.some(([from, to]) => span[0] < to && from < span[1])) {
      return undefined;
    }
    taken.push(span);
    return side;
  });
}

// Left to right, each item at least `distance` past the last one kept.
export function spaceOut<T extends { x: number }>(items: T[], distance: number): T[] {
  const kept: T[] = [];
  for (const item of items) {
    const last = kept.at(-1);
    if (!last || item.x - last.x >= distance) {
      kept.push(item);
    }
  }
  return kept;
}
