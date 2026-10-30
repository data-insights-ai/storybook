import { useLayoutEffect, useRef, type ReactNode } from "react";
import "./variants.css";

/** Wraps a screen in one variant of the proposal's type or composition. */
export function Variant({
  header,
  body,
  gold,
  children,
}: {
  header?: "a" | "b";
  body?: "plex" | "grotesk";
  gold?: "1" | "2";
  children: ReactNode;
}) {
  return (
    <div className="dir-a-variant" data-header={header} data-body={body} data-gold={gold}>
      {children}
    </div>
  );
}

type Option = { label: string; story: string };

/** Two variants side by side, as frames of their own stories: desktop scaled down, then phone at size. */
export function Compare({ title, lede, theme, options }: { title: string; lede: string; theme: string; options: Option[] }) {
  return (
    <main className="dir-a-compare">
      <header className="dir-a-compare-head">
        <p className="dir-a-label">Direction A · variants</p>
        <h1 className="dir-a-compare-title">{title}</h1>
        <p className="dir-a-muted">{lede}</p>
      </header>
      <section aria-label="Desktop, 1440" className="dir-a-compare-row">
        {options.map((o) => (
          <Frame key={o.story} option={o} theme={theme} width="1440" />
        ))}
      </section>
      <section aria-label="Phone, 390" className="dir-a-compare-row is-phone">
        {options.map((o) => (
          <Frame key={o.story} option={o} theme={theme} width="390" />
        ))}
      </section>
    </main>
  );
}

function Frame({ option, theme, width }: { option: Option; theme: string; width: string }) {
  const box = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el || width !== "1440") return;
    const fit = () => el.style.setProperty("--dir-a-scale", String(el.clientWidth / 1440));
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    return () => observer.disconnect();
  }, [width]);
  return (
    <figure className="dir-a-compare-cell">
      <figcaption className="dir-a-label">
        {option.label} · {width}
      </figcaption>
      <div ref={box} className="dir-a-compare-frame">
        <iframe
          title={`${option.label}, ${width} pixels wide`}
          src={`iframe.html?id=direction-a-variants--${option.story}&viewMode=story&globals=theme:${theme}`}
          loading="lazy"
        />
      </div>
    </figure>
  );
}
