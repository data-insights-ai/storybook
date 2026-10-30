import axe from "axe-core";

/**
 * WCAG 1.4.3 for the text axe sees but cannot decide.
 *
 * Axe checks aria-hidden text too, but it leaves a node "incomplete" when
 * something it cannot model sits behind it: an SVG or image (every chart
 * label), a pseudo-element (the Stepper's connector), an overlap, a lone
 * symbol. The story test fails on violations only, so those nodes were never
 * measured. This measures each of them at the point where it is drawn: the
 * paint stack under the text, composited down to the first opaque layer.
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

const sample = new OffscreenCanvas(1, 1).getContext("2d", { willReadFrequently: true })!;

/** Any CSS colour the browser computes (rgb, color(), oklch, keywords) through the canvas, which speaks all of them. */
function parse(colour: string): Rgba | null {
  if (!colour || colour === "none" || colour.startsWith("url(")) return null;
  sample.clearRect(0, 0, 1, 1);
  sample.fillStyle = "rgba(0, 0, 0, 0)";
  sample.fillStyle = colour;
  sample.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = sample.getImageData(0, 0, 1, 1).data;
  return { r, g, b, a: a / 255 };
}

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

const isSvgText = (element: Element) => element instanceof SVGTextContentElement;

function foreground(element: Element): Rgba | null {
  const style = getComputedStyle(element);
  const colour = parse(isSvgText(element) ? style.fill : style.color);
  if (!colour) return null;
  const alpha = isSvgText(element) ? parseFloat(style.fillOpacity) : 1;
  return { ...colour, a: colour.a * alpha * opacity(element) };
}

/** The paint of one layer under the text, or a reason it cannot be measured. */
function layer(element: Element): Rgba | string | null {
  const style = getComputedStyle(element);
  if (element instanceof HTMLImageElement || element instanceof HTMLCanvasElement || element instanceof HTMLVideoElement) {
    return `text over <${element.localName}>`;
  }
  if (element instanceof SVGGraphicsElement && !(element instanceof SVGSVGElement) && !(element instanceof SVGGElement)) {
    if (isSvgText(element)) return null;
    if (style.fill.startsWith("url(")) return "text over a gradient or pattern fill";
    const fill = parse(style.fill);
    if (!fill || fill.a === 0) return null;
    return { ...fill, a: fill.a * parseFloat(style.fillOpacity) * opacity(element) };
  }
  if (style.backgroundImage !== "none") return "text over a background image or gradient";
  const background = parse(style.backgroundColor);
  if (!background || background.a === 0) return null;
  return { ...background, a: background.a * opacity(element) };
}

function textRect(element: Element) {
  const range = document.createRange();
  for (const child of element.childNodes) {
    if (child.nodeType !== Node.TEXT_NODE || !child.textContent?.trim()) continue;
    range.selectNodeContents(child);
    const rect = Array.from(range.getClientRects()).find((r) => r.width > 0 && r.height > 0);
    if (rect) return rect;
  }
  return null;
}

function visible(element: Element) {
  if (element.closest(".di-sr")) return false;
  if (!element.checkVisibility({ visibilityProperty: true, opacityProperty: true })) return false;
  return textRect(element) !== null;
}

/** Composites the stack under the text's centre down to the first opaque layer, then onto the page. */
function background(element: Element): Rgba | string | null {
  element.scrollIntoView({ block: "center", inline: "center" });
  const rect = textRect(element);
  if (!rect) return null;
  const stack = document.elementsFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
  const own = stack.findIndex((node) => node === element || node.contains(element));
  if (own === -1) return null;
  const layers: Rgba[] = [];
  for (const node of stack.slice(own)) {
    const paint = layer(node);
    if (typeof paint === "string") return paint;
    if (!paint) continue;
    layers.push(paint);
    if (paint.a >= 1) break;
  }
  let result: Rgba = { r: 255, g: 255, b: 255, a: 1 };
  for (const paint of layers.reverse()) result = over(paint, result);
  return result;
}

function large(element: Element) {
  const style = getComputedStyle(element);
  const px = parseFloat(style.fontSize);
  const bold = parseFloat(style.fontWeight) >= 700;
  return px >= 24 || (bold && px >= 18.66);
}

function describe(element: Element) {
  const classes = typeof element.className === "string" ? element.className : element.getAttribute("class") ?? "";
  return `<${element.localName}${classes ? ` class="${classes}"` : ""}>`;
}

/**
 * Measures the nodes axe left incomplete for color-contrast. Disabled and
 * inert controls stay out, as in axe and in WCAG (inactive components).
 */
export async function visibleContrast(root: Element): Promise<ContrastFinding[]> {
  const result = await axe.run(root, {
    runOnly: { type: "rule", values: ["color-contrast"] },
    resultTypes: ["incomplete"],
  });
  const elements = result.incomplete
    .flatMap((rule) => rule.nodes.map((node) => ({ node, reason: String(node.any[0]?.data?.messageKey ?? "") })))
    .map(({ node, reason }) => ({ element: document.querySelector(String(node.target[0])), reason }))
    .filter((entry): entry is { element: Element; reason: string } => entry.element !== null);

  // Paint is what the eye sees; pointer-events only decide what a click hits.
  const hits = document.createElement("style");
  hits.textContent = "* { pointer-events: auto !important; }";
  document.head.append(hits);
  try {
    const findings: ContrastFinding[] = [];
    for (const { element, reason } of elements) {
      if (!visible(element)) continue;
      const fg = foreground(element);
      const bg = background(element);
      if (!fg || bg === null) continue;
      const expected = large(element) ? 3 : 4.5;
      const text = (element.textContent ?? "").trim().slice(0, 40);
      if (typeof bg === "string") {
        findings.push({ element: describe(element), text, reason: bg, foreground: hex(fg), background: "?", ratio: 0, expected });
        continue;
      }
      const shown = over(fg, bg);
      const measured = ratio(shown, bg);
      if (measured < expected) {
        findings.push({
          element: describe(element),
          text,
          reason,
          foreground: hex(shown),
          background: hex(bg),
          ratio: Math.floor(measured * 100) / 100,
          expected,
        });
      }
    }
    return findings;
  } finally {
    hits.remove();
  }
}
