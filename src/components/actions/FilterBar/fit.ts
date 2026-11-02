export type FitItem = {
  name: string;
  /** The width it takes in the bar; for the item that grows, its least width. */
  width: number;
  keep: boolean;
  priority: number;
};

export type FitInput = {
  room: number;
  gap: number;
  items: readonly FitItem[];
  trigger: number;
  end: number;
  /** The trigger shows even with nothing folded, because the sheet holds fields of its own. */
  triggerAlways: boolean;
  folded: readonly string[];
  phone: boolean;
  /** How much more room a folded item needs before it comes back, so a bar on the edge does not flicker. */
  slack: number;
};

/** Below this width of its own the bar keeps only what it must: the kept items, the trigger and the end. */
export const phoneWidth = 480;
export const restoreSlack = 16;

/** The order items leave the bar in: the lowest priority first, and among equals the last written first. */
export function foldOrder(items: readonly FitItem[]): FitItem[] {
  return items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !item.keep)
    .sort((a, b) => a.item.priority - b.item.priority || b.index - a.index)
    .map(({ item }) => item);
}

/** The items to fold into the sheet, in the order they are written: the fewest that let the bar keep one row. */
export function fit(input: FitInput): string[] {
  const order = foldOrder(input.items);
  const written = (names: Set<string>) => input.items.filter((item) => names.has(item.name)).map((item) => item.name);
  if (input.phone) return written(new Set(order.map((item) => item.name)));
  const before = new Set(input.folded);
  let shown = 0;
  while (shown < order.length && before.has(order[shown].name)) shown++;
  for (let count = 0; count <= order.length; count++) {
    const folded = new Set(order.slice(0, count).map((item) => item.name));
    const parts = input.items.filter((item) => !folded.has(item.name)).map((item) => item.width);
    if (input.triggerAlways || count > 0) parts.push(input.trigger);
    if (input.end > 0) parts.push(input.end);
    const need = parts.reduce((sum, width) => sum + width, 0) + input.gap * Math.max(parts.length - 1, 0);
    const room = count < shown ? input.room - input.slack : input.room;
    if (need <= room) return written(folded);
  }
  return written(new Set(order.map((item) => item.name)));
}
