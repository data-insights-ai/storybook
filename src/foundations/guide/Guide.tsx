import type { ReactNode } from "react";
import { PageHeader } from "../../components/Heading";
import { SectionTitle } from "../../components/SectionTitle";
import logo from "../../assets/logo.svg";
import mark from "../../assets/mark.svg";
import "./Guide.css";

/*
 * What is left in this file is specimen: a verdict table, a before/after
 * rewrite, the lockup stages, the clear-space diagram. They document the
 * brand and nothing outside Foundations renders them.
 *
 * The page shell and the section heading are not specimen. They were the
 * marketing vocabulary drawn a second time, in a stylesheet no product can
 * import — so a page assembled from the package could not reach them and
 * had to approximate them. They are `PageHeader` and `SectionTitle` at
 * `tier="brand"` now, and these two wrappers only supply the landmark and
 * the measure.
 */
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
    /*
     * `sb-unstyled` is Storybook's own opt-out from the docs page's
     * typography, and a brand page needs it now that the header, the
     * section heading, the stated facts and the pull quote are published
     * components. Those live in `@layer components`, and the docs styles
     * are unlayered — an unlayered declaration beats every layered one
     * whatever its specificity, so without this the h1 came out at the
     * docs theme's 32px and the pull quote in a grey blockquote with a
     * blue rule. Opting out means this file owns the prose between the
     * sections too, which is where it should have been: the brand pages'
     * body copy was being sized by a Storybook theme.
     */
    <article className="di-guide sb-unstyled">
      <PageHeader tier="brand" eyebrow={eyebrow} title={title} lede={lede} />
      {children}
    </article>
  );
}

export function Section({
  eyebrow = "",
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
      <SectionTitle tier="brand" eyebrow={eyebrow} title={title} lede={lede} />
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
