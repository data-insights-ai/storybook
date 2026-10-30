/**
 * WCAG 1.4.3 for every piece of visible text, measured where it is painted.
 *
 * Axe measures text at one point and leaves a node "incomplete" when it
 * cannot model what is behind it (an SVG under every chart label, a
 * pseudo-element, an overlap, a lone symbol); the story test fails on axe
 * violations only. This check runs beside it on all text, aria-hidden text
 * included. Each line of text is sampled at its start, middle and end. At
 * each point the paint stack is read with `elementsFromPoint`: the layers
 * below the text are composited down to the first opaque one (an SVG shape
 * by its stroke and its fill, each only where it covers the point), the
 * layers above it are composited over both the text and its ground, and the
 * worst point counts.
 *
 * It fails, rather than skips, when it cannot measure: text filled with a
 * gradient or pattern; a gradient, pattern, background image, `<img>`,
 * SVG `<image>`, canvas or video under or over the text; a point where the
 * text is not what the hit test returns (a `clip-path`, which is not
 * modelled, ends here); and text that cannot be scrolled into view.
 *
 * Not measured, because it is not shown: `display: none`, `visibility:
 * hidden`, opacity 0, `.di-sr`, a line with no size, the part of a line
 * that its own box or an ancestor clips with `overflow` (what is left a
 * pixel wide or less is the visually hidden pattern), the part beyond the
 * document's top or left edge, which no scroll reaches, and a point an
 * opaque layer covers. Inactive content is out, as in WCAG: disabled
 * controls, a control or composite input group marked `aria-disabled`,
 * `[inert]`, and what an open modal dialog makes inert (a popover shown
 * above it is still measured).
 */

export type ContrastFinding = {
  element: string;
  text: string;
  reason: string;
  foreground: string;
  background: string;
  ratio: number;
  expected: number;
};

type Rgba = { r: number; g: number; b: number; a: number };
type Paint = Rgba | string | null;

const sample = new OffscreenCanvas(1, 1).getContext("2d", { willReadFrequently: true })!;

/** Any CSS colour the browser computes (rgb, color(), oklch, keywords) through the canvas, which speaks all of them. */
function parse(colour: string): Rgba | null {
  if (!colour || colour === "none") return null;
  sample.clearRect(0, 0, 1, 1);
  sample.fillStyle = "rgba(0, 0, 0, 0)";
  sample.fillStyle = colour;
  sample.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = sample.getImageData(0, 0, 1, 1).data;
  return { r, g, b, a: a / 255 };
}

const isPaintServer = (value: string) => value.startsWith("url(");

function over(top: Rgba, bottom: Rgba): Rgba {
  const a = top.a + bottom.a * (1 - top.a);
  if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
  const mix = (t: number, b: number) => (t * top.a + b * bottom.a * (1 - top.a)) / a;
  return { r: mix(top.r, bottom.r), g: mix(top.g, bottom.g), b: mix(top.b, bottom.b), a };
}

function luminance({ r, g, b }: Rgba) {
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function ratio(a: Rgba, b: Rgba) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const hex = ({ r, g, b }: Rgba) => "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

function opacity(element: Element) {
  let value = 1;
  for (let node: Element | null = element; node; node = node.parentElement) {
    value *= parseFloat(getComputedStyle(node).opacity);
  }
  return value;
}

function describe(element: Element) {
  const classes = element.getAttribute("class") ?? "";
  return `<${element.localName}${classes ? ` class="${classes}"` : ""}>`;
}

const isSvgText = (element: Element) => element instanceof SVGTextContentElement;

function foreground(element: Element): Rgba | string {
  const style = getComputedStyle(element);
  if (isSvgText(element)) {
    if (isPaintServer(style.fill)) return "text filled with a gradient or pattern";
    const fill = parse(style.fill) ?? { r: 0, g: 0, b: 0, a: 0 };
    return { ...fill, a: fill.a * parseFloat(style.fillOpacity) * opacity(element) };
  }
  if (style.backgroundClip === "text" || style.webkitTextFillColor !== style.color) {
    return "text filled with a background or a text-fill colour";
  }
  const colour = parse(style.color)!;
  return { ...colour, a: colour.a * opacity(element) };
}

/** What an SVG shape paints at a point: its stroke over its fill, each only where it covers the point. */
function shape(element: SVGGeometryElement, x: number, y: number): Paint {
  const style = getComputedStyle(element);
  const matrix = element.getScreenCTM();
  if (!matrix) return null;
  const point = new DOMPoint(x, y).matrixTransform(matrix.inverse());
  const alpha = opacity(element);
  let paint: Rgba | null = null;
  if (style.fill !== "none" && element.isPointInFill(point)) {
    if (isPaintServer(style.fill)) return `text over a gradient or pattern fill (${describe(element)})`;
    const fill = parse(style.fill)!;
    paint = { ...fill, a: fill.a * parseFloat(style.fillOpacity) * alpha };
  }
  if (style.stroke !== "none" && element.isPointInStroke(point)) {
    if (isPaintServer(style.stroke)) return `text over a gradient or pattern stroke (${describe(element)})`;
    const stroke = parse(style.stroke)!;
    const top = { ...stroke, a: stroke.a * parseFloat(style.strokeOpacity) * alpha };
    paint = paint ? over(top, paint) : top;
  }
  return paint && paint.a > 0 ? paint : null;
}

/** The paint one element lays at a point, or why it cannot be measured. */
function layer(element: Element, x: number, y: number): Paint {
  if (
    element instanceof HTMLImageElement ||
    element instanceof HTMLCanvasElement ||
    element instanceof HTMLVideoElement ||
    element instanceof SVGImageElement
  ) {
    return `text over an image (${describe(element)})`;
  }
  if (isSvgText(element)) return null;
  if (element instanceof SVGGeometryElement) return shape(element, x, y);
  if (element instanceof SVGElement && !(element instanceof SVGSVGElement)) return null;
  const style = getComputedStyle(element);
  if (style.backgroundImage !== "none") return `text over a background image or gradient (${describe(element)})`;
  const background = parse(style.backgroundColor);
  if (!background || background.a === 0) return null;
  return { ...background, a: background.a * opacity(element) };
}

function lineRects(element: Element) {
  const range = document.createRange();
  const rects: DOMRect[] = [];
  for (const child of element.childNodes) {
    if (child.nodeType !== Node.TEXT_NODE || !child.textContent?.trim()) continue;
    range.selectNodeContents(child);
    rects.push(...Array.from(range.getClientRects()).filter((r) => r.width > 0 && r.height > 0));
  }
  return rects;
}

type Box = { left: number; top: number; right: number; bottom: number };

/**
 * The part of a line its own box and its ancestors leave visible, where any of
 * them clips its overflow (a scroller has been scrolled to it already). A part
 * a pixel wide or less is the visually hidden pattern, and is not shown.
 */
function unclipped(element: Element, rect: Box): Box | null {
  // Nothing scrolls past the document's top or left edge, so what lies beyond them is never shown.
  let box = {
    left: Math.max(rect.left, -scrollX),
    top: Math.max(rect.top, -scrollY),
    right: rect.right,
    bottom: rect.bottom,
  };
  if (box.right - box.left <= 1 || box.bottom - box.top <= 1) return null;
  for (let node: Element | null = element; node; node = node.parentElement) {
    const style = getComputedStyle(node);
    const cuts = [style.overflowX, style.overflowY].some((v) => v !== "visible");
    if (!cuts) continue;
    const edge = node.getBoundingClientRect();
    box = {
      left: Math.max(box.left, edge.left),
      top: Math.max(box.top, edge.top),
      right: Math.min(box.right, edge.right),
      bottom: Math.min(box.bottom, edge.bottom),
    };
    if (box.right - box.left <= 1 || box.bottom - box.top <= 1) return null;
  }
  return box;
}

const positions = ["start", "center", "end"] as const;

function pointOf(box: Box, at: (typeof positions)[number]) {
  const inset = Math.min(2, (box.right - box.left) / 4);
  const x = at === "start" ? box.left + inset : at === "end" ? box.right - inset : (box.left + box.right) / 2;
  return { x, y: (box.top + box.bottom) / 2 };
}

const inView = (x: number, y: number) => x >= 0 && y >= 0 && x < innerWidth && y < innerHeight;

/** The box the hit test returns for the text: its own element, or the first ancestor with a box of its own. */
function hitTarget(element: Element) {
  let node: Element = element;
  while (node.parentElement && (getComputedStyle(node).display === "contents" || node instanceof SVGTSpanElement)) {
    node = node.parentElement;
  }
  return node;
}

type Measure = { fg: Rgba; bg: Rgba; ratio: number } | string | null;

/** One point: the text and its ground as the eye gets them there, or null where an opaque layer covers it. */
function measureAt(element: Element, fg: Rgba, x: number, y: number): Measure {
  const stack = document.elementsFromPoint(x, y);
  const target = hitTarget(element);
  const own = stack.findIndex((node) => node === element || node === target);
  if (own === -1) {
    const top = stack[0] ? describe(stack[0]) : "nothing";
    return `the text is not what is hit at (${Math.round(x)}, ${Math.round(y)}); the top is ${top}`;
  }
  const below: Rgba[] = [];
  for (const node of stack.slice(own)) {
    const paint = layer(node, x, y);
    if (typeof paint === "string") return paint;
    if (!paint) continue;
    below.push(paint);
    if (paint.a >= 1) break;
  }
  let bg: Rgba = { r: 255, g: 255, b: 255, a: 1 };
  for (const paint of below.reverse()) bg = over(paint, bg);
  let shown = over(fg, bg);
  const above = stack.slice(0, own).filter((node) => !element.contains(node));
  for (const node of above.reverse()) {
    const paint = layer(node, x, y);
    if (typeof paint === "string") return paint.replace("text over", "text under");
    if (!paint) continue;
    if (paint.a >= 1) return null;
    shown = over(paint, shown);
    bg = over(paint, bg);
  }
  return { fg: shown, bg, ratio: ratio(shown, bg) };
}

function large(element: Element) {
  const style = getComputedStyle(element);
  const px = parseFloat(style.fontSize);
  const bold = parseFloat(style.fontWeight) >= 700;
  return px >= 24 || (bold && px >= 18.66);
}

/* The controls WCAG means by an inactive user interface component, and the composite inputs that group them. */
const CONTROL =
  "button, input, select, textarea, a[href], [role='button'], [role='link'], [role='checkbox'], [role='radio'], " +
  "[role='switch'], [role='textbox'], [role='searchbox'], [role='combobox'], [role='listbox'], [role='option'], " +
  "[role='menuitem'], [role='menuitemcheckbox'], [role='menuitemradio'], [role='slider'], [role='spinbutton'], " +
  "[role='tab'], [role='treeitem'], [role='gridcell']";

function disabledControl(element: Element) {
  const marked = element.closest("[aria-disabled='true']");
  if (!marked) return false;
  if (marked.matches(CONTROL)) return true;
  const role = marked.getAttribute("role");
  return (role === "group" || role === "radiogroup") && marked.querySelector(CONTROL) !== null;
}

/** Content an open modal dialog makes inert: outside every modal and every popover shown above it. */
function behindModal(element: Element) {
  if (!document.querySelector(":modal")) return false;
  return !element.closest(":modal, :popover-open");
}

function inactive(element: Element) {
  if (element.closest("[inert], :disabled") || disabledControl(element) || behindModal(element)) return true;
  const label = element.closest("label");
  const control = label?.control ?? null;
  return control !== null && (control as HTMLInputElement).disabled;
}

function candidates(root: Element) {
  const found: Element[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const parent = node.parentElement;
    if (!parent || !node.textContent?.trim() || found.at(-1) === parent) continue;
    if (["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "OPTION", "TITLE", "TEXTAREA"].includes(parent.tagName)) continue;
    if (parent.closest("svg title, svg desc, svg defs")) continue;
    found.push(parent);
  }
  return found;
}

function shown(element: Element) {
  if (element.closest(".di-sr")) return false;
  if (!element.checkVisibility({ visibilityProperty: true, opacityProperty: true })) return false;
  return lineRects(element).length > 0;
}

/** Measures one element's text at every sample point; the worst one, or the reason it cannot be measured. */
function measure(element: Element): Omit<ContrastFinding, "element" | "text" | "expected"> | null {
  const fg = foreground(element);
  if (typeof fg === "string") return { reason: fg, foreground: "?", background: "?", ratio: 0 };
  element.scrollIntoView({ block: "nearest", inline: "nearest" });
  let worst: { fg: Rgba; bg: Rgba; ratio: number } | null = null;
  const lines = lineRects(element).length;
  for (let line = 0; line < lines; line++) {
    for (const at of positions) {
      let box = lineRects(element)[line] && unclipped(element, lineRects(element)[line]);
      if (!box) continue;
      let point = pointOf(box, at);
      if (!inView(point.x, point.y)) {
        element.scrollIntoView({ block: "center", inline: at });
        box = lineRects(element)[line] && unclipped(element, lineRects(element)[line]);
        if (!box) continue;
        point = pointOf(box, at);
        if (!inView(point.x, point.y)) {
          return {
            reason: `the text cannot be scrolled into view at its ${at}`,
            foreground: "?",
            background: "?",
            ratio: 0,
          };
        }
      }
      const result = measureAt(element, fg, point.x, point.y);
      if (typeof result === "string") return { reason: result, foreground: hex(fg), background: "?", ratio: 0 };
      if (result && (!worst || result.ratio < worst.ratio)) worst = result;
    }
  }
  if (!worst) return null;
  return {
    reason: "",
    foreground: hex(worst.fg),
    background: hex(worst.bg),
    ratio: Math.floor(worst.ratio * 100) / 100,
  };
}

export async function visibleContrast(root: Element): Promise<ContrastFinding[]> {
  // Paint is what the eye sees; pointer-events only decide what a click hits.
  const hits = document.createElement("style");
  hits.textContent = "* { pointer-events: auto !important; }";
  document.head.append(hits);
  try {
    const findings: ContrastFinding[] = [];
    for (const element of candidates(root)) {
      if (!element.isConnected || inactive(element) || !shown(element)) continue;
      const result = measure(element);
      if (!result) continue;
      const expected = large(element) ? 3 : 4.5;
      if (result.reason || result.ratio < expected) {
        findings.push({
          element: describe(element),
          text: (element.textContent ?? "").trim().slice(0, 40),
          expected,
          ...result,
        });
      }
    }
    return findings;
  } finally {
    hits.remove();
  }
}
