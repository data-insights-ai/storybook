const pressable = 'button, a[href], [role="button"], summary, tr.is-selectable';

/** The control a press landed on: a button, a link, a selectable row. */
export const pressedOf = (target: EventTarget | null) =>
  target instanceof Element ? target.closest<HTMLElement>(pressable) : null;

// What was pressed, not what has focus: Safari focuses no button on a click, and a row never takes focus.
let lastPress: { el: HTMLElement; at: number } | null = null;
let watchers = 0;
const notePress = (event: MouseEvent) => {
  const el = pressedOf(event.target);
  lastPress = el ? { el, at: performance.now() } : null;
};

/** Notes every press while a page is mounted, so a dialog that opens from one knows what opened it. */
export function watchPresses() {
  if (watchers++ === 0) document.addEventListener("click", notePress, true);
  return () => {
    if (--watchers > 0) return;
    document.removeEventListener("click", notePress, true);
    lastPress = null;
  };
}

/** The control pressed just now, once: a later dialog does not inherit it. */
export function takePress() {
  const press = lastPress;
  lastPress = null;
  return press && performance.now() - press.at < 1000 ? press.el : null;
}
