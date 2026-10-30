import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import "./docs.css";

/** A Direction A documentation page: a claim as its headline, then sections. */
export function DocPage({ kicker, title, claim, children }: { kicker: string; title: string; claim: string; children: ReactNode }) {
  return (
    <main>
    <article className="doc-a">
      <header className="doc-a-head">
        <h1 className="doc-a-title">
          <span>{kicker}</span> {title}
        </h1>
        <p className="doc-a-claim">{claim}</p>
      </header>
      {children}
    </article>
    </main>
  );
}

export function DocSection({ title, lede, children }: { title: string; lede?: string; children: ReactNode }) {
  return (
    <section className="doc-a-section">
      <h2 className="doc-a-h2">{title}</h2>
      {lede ? <p className="doc-a-lede">{lede}</p> : null}
      {children}
    </section>
  );
}

/** A rule shown twice: how it is meant, and the way it goes wrong. */
export function DoDont({ doText, dontText, children }: { doText: string; dontText: string; children: [ReactNode, ReactNode] }) {
  return (
    <div className="doc-a-dodont">
      <figure className="doc-a-do">
        <div className="doc-a-specimen">{children[0]}</div>
        <figcaption>
          <strong>Do</strong> {doText}
        </figcaption>
      </figure>
      <figure className="doc-a-dont">
        <div className="doc-a-specimen">{children[1]}</div>
        <figcaption>
          <strong>Don’t</strong> {dontText}
        </figcaption>
      </figure>
    </div>
  );
}

function luminance(rgb: number[]) {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function parse(colour: string) {
  const m = colour.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0];
  return m.slice(0, 3);
}

/**
 * One colour role, with its value and its contrast against the ground it
 * is meant for, measured in the browser from the live tokens.
 */
export function Swatch({ token, on = "--di-layer-surface", role, mark = false }: { token: string; on?: string; role: string; /** A mark, not text: the role is written in text colour. */ mark?: boolean }) {
  const chip = useRef<HTMLSpanElement>(null);
  const ground = useRef<HTMLDivElement>(null);
  const [reading, setReading] = useState("");
  useLayoutEffect(() => {
    if (!chip.current || !ground.current) return;
    const fg = getComputedStyle(chip.current).backgroundColor;
    const bg = getComputedStyle(ground.current).backgroundColor;
    const a = luminance(parse(fg));
    const b = luminance(parse(bg));
    const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    setReading(`${ratio.toFixed(2)}:1`);
  });
  return (
    <div className="doc-a-swatch" ref={ground} style={{ background: `var(${on})` }}>
      <span ref={chip} className="doc-a-chip" style={{ background: `var(${token})` }} />
      <span className="doc-a-swatch-text" style={{ color: mark ? "var(--di-text)" : `var(${token})` }}>
        {role}
      </span>
      <code>{token}</code>
      <span className="doc-a-ratio">{reading} on {on.replace("--di-layer-", "")}</span>
    </div>
  );
}
