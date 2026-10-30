/**
 * The rows a toolbar's controls fall into, top to bottom, each a list of
 * the controls on it. A control whose centre is within 8px of the row's
 * belongs to it. Used by the stories to hold a toolbar to two rows on a
 * phone with no action alone on a row.
 */
export function toolbarRows(bar: Element): Element[][] {
  const controls = [...bar.querySelectorAll(":scope > *, :scope > .di-toolbar-end > *")].filter(
    (el) => !el.matches(".di-toolbar-end, .di-toolbar-note") && el.getBoundingClientRect().width > 0,
  );
  const centre = (el: Element) => {
    const box = el.getBoundingClientRect();
    return box.top + box.height / 2;
  };
  const rows: Element[][] = [];
  for (const el of controls.sort((a, b) => centre(a) - centre(b))) {
    const last = rows.at(-1);
    if (last && centre(el) - centre(last[0]) <= 8) last.push(el);
    else rows.push([el]);
  }
  return rows;
}
