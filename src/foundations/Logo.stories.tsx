import type { Meta, StoryObj } from "@storybook/react-vite";
import { cx } from "../cx";
import logo from "../assets/logo.svg";
import logoInverse from "../assets/logo-inverse.svg";
import logoMono from "../assets/logo-mono.svg";
import mark from "../assets/mark.svg";
import markInverse from "../assets/mark-inverse.svg";
import "./foundations.css";

const cells = [
  { title: "Primary", body: "Navy on ivory or paper. The default lockup.", src: logo, dark: false, mark: false },
  { title: "Inverse", body: "Ivory on navy. Sidebar, cover, dark fields.", src: logoInverse, dark: true, mark: false },
  { title: "Mono", body: "One colour, when the pair cannot be printed.", src: logoMono, dark: false, mark: false },
  { title: "Mark", body: "Symbol only, when the name is already in the sentence.", src: mark, dark: false, mark: true },
  { title: "Mark, inverse", body: "The same symbol on navy. The gold node is the tittle.", src: markInverse, dark: true, mark: true },
];

function Lockups() {
  return (
    <div style={{ maxWidth: 960 }}>
      <h1 className="di-block-title" style={{ fontSize: 32 }}>
        The mark, then the name.
      </h1>
      <p className="di-lede">
        Brackets hold a temporal interval. The nodes are an evidence chain. One of them is gold. That dot is the scarcest mark in the system.
      </p>
      <div className="di-logo-grid" style={{ marginTop: 20 }}>
        {cells.map((cell) => (
          <article key={cell.title} className="di-logo-cell">
            <div className={cx("di-logo-stage", cell.dark && "is-dark", cell.mark && "is-mark")}>
              <img src={cell.src} alt="datAInsights" />
            </div>
            <div className="di-logo-meta">
              <h2>{cell.title}</h2>
              <p>{cell.body}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

const meta = { title: "Foundations/Logo" } satisfies Meta;
export default meta;

export const Lockup: StoryObj = { render: () => <Lockups /> };
