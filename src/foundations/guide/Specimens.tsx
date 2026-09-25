import logo from "../../assets/logo.svg";
import markInverse from "../../assets/mark-inverse.svg";
import "./Guide.css";
export { IconSet } from "./IconSet";

const misuses = [
  { tone: "is-skew", title: "Don’t stretch or skew.", detail: "Scale it uniformly." },
  { tone: "is-hue", title: "Don’t recolour.", detail: "Only navy and gold, or the inverse." },
  { tone: "is-ongold", title: "Don’t put it on gold.", detail: "The mark disappears. Inverse is for navy." },
  { tone: "is-shadow", title: "Don’t add a drop shadow.", detail: "The mark is flat." },
  { tone: "is-busy", title: "Don’t use a photograph.", detail: "Solid navy or ivory only." },
  { tone: "is-tilt", title: "Don’t rotate.", detail: "The mark stays horizontal." },
] as const;

export function Misuse() {
  return (
    <div className="di-misuse">
      {misuses.map((item) => (
        <figure key={item.title} className={item.tone}>
          <div>
            <img src={logo} alt="" />
          </div>
          <figcaption>
            <strong>{item.title}</strong>
            {item.detail}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function Motifs() {
  return (
    <div className="di-motifs">
      <figure>
        <svg viewBox="0 0 120 80" aria-hidden>
          <text x="60" y="58" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="400" fontSize="56" fill="var(--di-text)">
            [ ]
          </text>
        </svg>
        <figcaption>
          <strong>Brackets</strong>
          <span>
            Mark a temporal interval <em>[t<sub>0</sub>, t<sub>1</sub>]</em> — the window in which a claim holds. Never use for decorative enclosure.
          </span>
        </figcaption>
      </figure>
      <figure>
        <svg viewBox="0 0 120 80" aria-hidden>
          <g transform="translate(20 20)">
            <line x1="10" y1="10" x2="40" y2="40" stroke="var(--di-text)" strokeWidth="1" />
            <line x1="70" y1="10" x2="40" y2="40" stroke="var(--di-text)" strokeWidth="1" />
            <circle cx="10" cy="10" r="3" fill="var(--di-text)" />
            <circle cx="70" cy="10" r="3" fill="var(--di-text)" />
            <circle cx="40" cy="40" r="4" fill="var(--di-seal)" stroke="var(--di-text)" strokeWidth="1" />
          </g>
        </svg>
        <figcaption>
          <strong>Graph nodes</strong>
          <span>A simple triangle of nodes + edges. Use to visualize evidence chains. Never more than ~7 nodes in any one visual.</span>
        </figcaption>
      </figure>
      <figure>
        <svg viewBox="0 0 120 80" aria-hidden>
          <circle cx="60" cy="40" r="14" fill="var(--di-seal)" />
        </svg>
        <figcaption>
          <strong>The truth-tittle</strong>
          <span>A filled gold dot: this value is recorded and can be verified. Scarce by meaning, not by quota — a column of sealed rows is correct, a gold dot on something unsealed is not.</span>
        </figcaption>
      </figure>
      <figure>
        <svg viewBox="0 0 120 80" aria-hidden>
          <line x1="10" y1="40" x2="110" y2="40" stroke="var(--di-rule)" strokeWidth="1" strokeDasharray="2 4" />
          <text x="18" y="33" fontFamily="JetBrains Mono, monospace" fontSize="11" letterSpacing="0.04em" fill="var(--di-text-muted)">
            2026-09-18
          </text>
        </svg>
        <figcaption>
          <strong>Timestamps</strong>
          <span>Always ISO-8601. Always in the mono track, in <code>--di-text-muted</code>. Never in gold: gold is the seal beside a value, not the value itself.</span>
        </figcaption>
      </figure>
      <figure>
        <svg viewBox="0 0 120 80" aria-hidden>
          <text x="60" y="56" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="500" fontSize="44" fill="var(--di-seal-ink)">
            §
          </text>
        </svg>
        <figcaption>
          <strong>Section mark</strong>
          <span>Numbers a section of the record, in the mono track. <code>Eyebrow</code> sets it beside the seal and a rule to the edge.</span>
        </figcaption>
      </figure>
      <figure>
        <svg viewBox="0 0 120 80" aria-hidden>
          <circle cx="60" cy="40" r="12" fill="none" stroke="var(--di-ai-ring)" strokeWidth="3" />
        </svg>
        <figcaption>
          <strong>The hollow ring</strong>
          <span>
            The same gold, opened. A model inferred this and nothing has vouched for it yet — and the
            less certain mark is the <em>less</em> decorated one. Never a gradient, a glow or a sparkle.
          </span>
        </figcaption>
      </figure>
      <figure>
        <svg viewBox="0 0 120 80" aria-hidden>
          <g stroke="var(--di-rule-500)" strokeWidth="1">
            {[10, 26, 42, 58, 74, 90, 106].map((x) => (
              <line key={x} x1={x} y1="34" x2={x} y2="46" />
            ))}
          </g>
        </svg>
        <figcaption>
          <strong>The tick rule</strong>
          <span>
            An 8px pitch, and the only ornament in the system. It closes a header or a block that
            reports a measurement, and it earns its place by looking like an instrument.
          </span>
        </figcaption>
      </figure>
      <figure>
        <svg viewBox="0 0 120 80" aria-hidden>
          <path d="M 10 40 L 110 40" stroke="var(--di-rule)" strokeWidth="1" />
          <circle cx="30" cy="40" r="3" fill="var(--di-text)" />
          <circle cx="60" cy="40" r="3" fill="var(--di-text)" />
          <circle cx="90" cy="40" r="4" fill="var(--di-seal)" />
        </svg>
        <figcaption>
          <strong>Hairline rules</strong>
          <span><code>--di-rule</code>, 1px. The connective tissue of layout, and how depth is drawn. Never used for decoration — only to divide.</span>
        </figcaption>
      </figure>
    </div>
  );
}

export function Motion() {
  return (
    <div className="di-motion">
      <div>
        <h3>Under 200 ms.</h3>
        <p>Two durations, and no others: <code>--di-duration</code> is 120ms and <code>--di-duration-slow</code> is 200ms. Slower than that reads as decoration.</p>
        <div className="di-motion-scale" aria-hidden>
          <i />
          <span>0</span>
          <span>120</span>
          <span>200</span>
          <span>400 ms</span>
        </div>
      </div>
      <div>
        <h3>Ease-out. Never bounce.</h3>
        <p>The curve settles. No spring, no overshoot, no straight line. One thing moves at a time. A bracket arrives in a frame or two.</p>
        <div className="di-motion-curves" aria-hidden>
          <figure>
            <svg viewBox="0 0 120 64"><path d="M8 56 C 28 56 36 8 112 8" fill="none" stroke="var(--di-seal-ink)" strokeWidth="1.6" /></svg>
            <figcaption>Ease-out</figcaption>
          </figure>
          <figure>
            <svg viewBox="0 0 120 64"><path d="M8 56 C 46 56 62 4 84 18 S 108 10 112 8" fill="none" stroke="var(--di-status-danger-fg)" strokeWidth="1.6" /></svg>
            <figcaption>Spring</figcaption>
          </figure>
          <figure>
            <svg viewBox="0 0 120 64"><path d="M8 56 L112 8" fill="none" stroke="var(--di-status-danger-fg)" strokeWidth="1.6" /></svg>
            <figcaption>Linear</figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}

export function Cobrand() {
  return (
    <figure className="di-cobrand">
      <div>
        <img src={logo} alt="" />
        <i />
        <b>Partner</b>
      </div>
      <figcaption>Equal optical height. A vertical rule. One cap-height of air on either side. A shared baseline.</figcaption>
    </figure>
  );
}

export function Surfaces() {
  return (
    <div className="di-surfaces">
      <figure className="di-surface-web">
        <figcaption>Web · hero</figcaption>
        <div>
          <img src={logo} alt="" />
          <p>Provable AI</p>
          <strong>AI that proves what it knows.</strong>
          <span>Grounded in a temporal knowledge graph. Every answer cites its source.</span>
        </div>
      </figure>
      <figure className="di-surface-slide">
        <figcaption>Slide · title</figcaption>
        <div>
          <p>01 · Introduction</p>
          <strong>Provable AI for regulated decisions.</strong>
          <img src={markInverse} alt="" />
        </div>
      </figure>
      <figure className="di-surface-sign">
        <figcaption>Email · signature</figcaption>
        <div>
          <strong>Nora Feld</strong>
          <span>Operator · datAInsights</span>
          <i />
          <em>datAInsights GmbH</em>
          <a href="https://www.data-insights.ai">data-insights.ai</a>
        </div>
      </figure>
      <figure className="di-surface-avatar">
        <figcaption>Social · avatar</figcaption>
        <div>
          <img src={markInverse} alt="" />
          <span>96 × 96 · navy tile</span>
        </div>
      </figure>
    </div>
  );
}
