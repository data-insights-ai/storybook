import type { ReactNode } from "react";
import logo from "../../assets/logo.svg";
import mark from "../../assets/mark.svg";
import "./Guide.css";

export function Page({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  children: ReactNode;
}) {
  return (
    <article className="di-guide">
      <header className="di-guide-head">
        <p className="di-guide-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {lede ? <p className="di-guide-lede">{lede}</p> : null}
      </header>
      {children}
    </article>
  );
}

export function Facts({ children }: { children: ReactNode }) {
  return <dl className="di-guide-facts">{children}</dl>;
}

export function Fact({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="di-guide-fact">
      <dt>{term}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export function Pull({ children }: { children: ReactNode }) {
  return <blockquote className="di-guide-pull">{children}</blockquote>;
}

export function Section({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  children?: ReactNode;
}) {
  return (
    <section className="di-guide-section">
      {eyebrow ? <p className="di-guide-eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {lede ? <p className="di-guide-lede">{lede}</p> : null}
      {children}
    </section>
  );
}

export function Verdicts({ children }: { children: ReactNode }) {
  return <ol className="di-guide-verdicts">{children}</ol>;
}

export function Verdict({
  result,
  note,
  children,
}: {
  result: "pass" | "fail";
  note?: string;
  children: ReactNode;
}) {
  return (
    <li className={result === "pass" ? "is-pass" : "is-fail"}>
      <span>{result === "pass" ? "Pass" : "Fail"}</span>
      <p>{children}</p>
      {note ? <small>{note}</small> : null}
    </li>
  );
}

export function Rewrites({ children }: { children: ReactNode }) {
  return <div className="di-guide-rewrites">{children}</div>;
}

export function Rewrite({ before, after }: { before: string; after: string }) {
  return (
    <div className="di-guide-rewrite">
      <p>
        <span>Before</span>
        {before}
      </p>
      <p>
        <span>After</span>
        {after}
      </p>
    </div>
  );
}

export function Columns({ children }: { children: ReactNode }) {
  return <div className="di-guide-columns">{children}</div>;
}

export function Lines({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="di-guide-lines">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function Column({ title, words }: { title: string; words: string[] }) {
  return (
    <div className="di-guide-column">
      <h3>{title}</h3>
      <ul>
        {words.map((word) => (
          <li key={word}>{word}</li>
        ))}
      </ul>
    </div>
  );
}

export function Marks({ children }: { children: ReactNode }) {
  return <ul className="di-guide-marks">{children}</ul>;
}

export function Mark({
  mark,
  tone = "ink",
  children,
}: {
  mark: string;
  tone?: "ink" | "gold";
  children: ReactNode;
}) {
  return (
    <li>
      <span className={tone === "gold" ? "is-gold" : undefined}>{mark}</span>
      <p>{children}</p>
    </li>
  );
}

export function Lockups({ children }: { children: ReactNode }) {
  return <div className="di-guide-lockups">{children}</div>;
}

export function Lockup({
  title,
  detail,
  tone = "light",
  children,
}: {
  title: string;
  detail: string;
  tone?: "light" | "dark";
  children: ReactNode;
}) {
  return (
    <figure className={tone === "dark" ? "is-dark" : undefined}>
      <div>{children}</div>
      <figcaption>
        <strong>{title}</strong>
        <span>{detail}</span>
      </figcaption>
    </figure>
  );
}

const minimums = [
  { src: logo, height: 20, title: "Digital · 20 px height", detail: "UI, web, small cards" },
  { src: logo, height: 32, title: "Print · 10 mm height", detail: "Letterheads, cards" },
  { src: mark, height: 16, title: "Mark · 16 px / 6 mm", detail: "Favicons, avatars" },
] as const;

export function ClearSpace() {
  return (
    <div className="di-clear">
      <figure>
        <div className="di-clear-stage">
          <div className="di-clear-axis" aria-hidden>
            <span>X</span>
            <i />
          </div>
          <div className="di-clear-frame">
            <span>1X</span>
            <span>1X</span>
            <img src={logo} alt="" />
            <span>1X</span>
            <span>1X</span>
          </div>
        </div>
        <figcaption>X = mark cap height · min. clear space = 1 X on all sides</figcaption>
      </figure>
      <div className="di-clear-mins">
        <p>Minimum sizes</p>
        {minimums.map((item) => (
          <div key={item.title}>
            <img src={item.src} alt="" style={{ height: item.height }} />
            <p>
              <strong>{item.title}</strong>
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Rules({ children }: { children: ReactNode }) {
  return <ul className="di-guide-rules">{children}</ul>;
}

export function Rule({ children }: { children: ReactNode }) {
  return <li>{children}</li>;
}
