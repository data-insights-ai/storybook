#!/usr/bin/env node
/*
 * Writes summary.html beside shots/, contrast.json and axe.json: each screen
 * as Today and Direction A, light and dark, 1440 and 390, with what changed
 * and why, the three variant comparisons, the measured contrast, the axe
 * result and the open questions. Images are referenced as shots/<name>.png,
 * so the page publishes together with its files.
 *
 * Run: node scripts/direction-a/summary.mjs <dir with shots/, contrast.json and axe.json>
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const dir = process.argv[2] ?? "dist/direction-a";
const contrast = JSON.parse(readFileSync(`${dir}/contrast.json`, "utf8"));
const axe = existsSync(`${dir}/axe.json`) ? JSON.parse(readFileSync(`${dir}/axe.json`, "utf8")) : [];

const screens = [
  {
    id: "soc-overview",
    title: "AI SOC · workspace overview",
    columns: [
      ["Today", "soc-overview-today"],
      ["Direction A", "soc-overview-a"],
    ],
    text: [
      "Today the page opens with a gold eyebrow, the noun “Production” and a lede that describes the interface; the news (“1 critical · 1 high”) sits in 12px mono under one of four equal tiles.",
      "Direction A’s head only orients (header H-c): the page name “Production” as a 28px Sansation h1 with its state “Needs attention” on the same line, and as of when, sources and “updates live” small at the right (under the name on a phone). No kicker, no claim sentence, no dotted rule, no header button.",
      "The point is the first block: “3 things need you” as its heading and the ranked items under it. Item 01 spans the row as the strongest element on the page, with the gold edge, “Start here” in words and the one filled button “Open case 4”; 02 and 03 share the row below with a link each.",
      "All cards share one indent: the rank sits in a fixed column on the baseline of the card’s first line, and severity marks stand on the baseline of their word.",
      "Detections are the one hero, on the luminous navy zone in both themes, with the open-case count beside the chart. Its supporting figures (new in 24 h, unassigned, time to acknowledge, time to resolve) close the hero as its footer under a fine rule, in the hero’s colours; a rule only separates two figures.",
      "Devices and coverage keep a surface each, their titles state the finding; notifications, SIEM export and access are one quiet health line at the foot.",
      "On a phone every heading breaks into balanced lines, meta lines break only between their items (never on a lone “·”), and item 01’s button runs full width.",
    ],
  },
  {
    id: "soc-cases",
    title: "AI SOC · cases, list and detail",
    extra: "soc-case-open",
    columns: [
      ["Today", "soc-cases-today"],
      ["Direction A", "soc-cases-a"],
    ],
    text: [
      "Today the case list is a framed table, and a case opens as its own page with seven tabs, a triage rail that starts with four selects, and up to four nested boxes.",
      "Direction A keeps the list on the left and the open case on the right from about 900px of content width; the selected case is marked in cornflower, never gold. The list sorts by the shared severity scale.",
      "The case head only orients: “Case 4 · leaked VPN credentials …” with severity and state, and the meta under it.",
      "The first block is the AI SOC’s verdict, the one emphasised surface: the verdict, what it asks for set large (“Isolate srv-fs-02 and reset svc-backup.”), the three actions, and the proof path vpn-gw-01 → ws-fin-014 → srv-fs-02 → 192.0.2.88.",
      "The case figures sit on a tonal strip (no hero on this page); then the five-phase story and the latest signals, the table directly on its surface.",
      "On a phone the list and the case take turns; the third capture shows the open case. Its actions stack at full width, host names never break at a hyphen, and the path’s arrows never start a line.",
    ],
  },
  {
    id: "portal-home",
    title: "Account portal · organization home, owner",
    columns: [
      ["Today", "portal-home-today"],
      ["All running (owner)", "portal-home-a-running"],
      ["Decision due (owner)", "portal-home-a-due"],
    ],
    text: [
      "Today the page promises “what needs attention” and then shows a products panel holding one small outline button and five equal cards with charts, none of which says whether anything is wrong.",
      "Direction A orders the page by why people come. The head only orients: the organization’s name, a “Decision due” state when there is one, as of when and the viewer’s role.",
      "The first block is the point. Normally it is one quiet line, “Everything is running”, with no gold anywhere. When a decision is due that the viewer can act on (a licence or add-on ending within 30 days, seats used up, a failed payment, an expiring sign-in certificate), it becomes “1 decision is due” with the single gold item and its button.",
      "Products come next, as large entry rows: one click into each product, the most common reason to visit.",
      "Licences are one quiet status line (“3 active · next renewal 12 March”) unless one is to decide. Cost is a normal surface: balance, use per day and ingest on a tonal strip, then the trend. The navy hero is gone from this page.",
      "Team and recent changes come last, as quiet lists without a surface.",
    ],
  },
  {
    id: "portal-roles",
    title: "Account portal · organization home, by role",
    columns: [
      ["Administrator", "portal-home-a-admin"],
      ["Billing administrator", "portal-home-a-billing"],
      ["Member", "portal-home-a-member"],
    ],
    text: [
      "What shows follows the account platform’s organization roles, in the page and in the sidebar, and the signed-in person matches the role.",
      "Administrator (Kim Ops): members, invitations, products and licences, sign-in, audit log, settings; no billing. The page shows the team and recent changes, no cost; the add-on renewal is a billing decision, so it does not appear and the page says everything runs.",
      "Billing administrator (Robin Billing): members (read only), products and licences, credits, billing. The page shows the due decision, licences and cost, and the team without management; no recent changes, since those are the audit log.",
      "Member (Sam Analyst): the organization only. The sidebar shows Overview and Products; the page shows the quiet line and the products, nothing about team, cost or licences, and no member count.",
    ],
  },
];

const variants = [
  {
    id: "variant-header",
    title: "Variant · header, H-c (default), H-a or H-b",
    story: "direction-a-variants--header-weight",
    columns: [
      ["H-c (default)", "variant-header-c"],
      ["H-a", "variant-header-a"],
      ["H-b", "variant-header-b"],
    ],
    text: [
      "H-a and H-b put a claim sentence in the head. It repeated the attention list almost word for word, stacked five strata (kicker, name, claim, meta, rule) before the content, and its header button duplicated item 01’s action.",
      "H-c, now the default on every Direction A screen: the head only orients (a 28px name, its state, as of when at the right), and the attention list under its own heading is the point, with item 01 carrying the action.",
      "H-a: a 20px name under a mono kicker, the claim up to 34px. H-b: a 28px name over a lighter 30px claim. Kept for comparison.",
    ],
  },
  {
    id: "variant-gold-overview",
    title: "Variant · gold in daylight, SOC overview",
    story: "direction-a-variants--gold-in-daylight",
    themes: ["light"],
    columns: [
      ["G-1 (as is)", "variant-gold-1-overview"],
      ["G-2", "variant-gold-2-overview"],
      ["G-3", "variant-gold-3-overview"],
    ],
    text: [
      "Light mode only; after dark gold on navy stays. To reach 4.5:1 on cream, gold text darkens to #7a5c0e, which reads as olive, and navy with brown on a yellowish cream looks like old paper.",
      "G-1: the proposal as is. G-2: gold is never text colour; the one thing keeps navy and gets a highlighter bar under its words, the gold edge and a gold bar under the rank stay, and the ground turns a cooler neutral (#f3f2ee, surface #fdfdfb, chrome #e9e8e3). G-3: as G-2 with no highlighter; gold is only item 01’s edge and rank bar, and “Start here” is navy on a small gold pill.",
      "The default is unchanged until one is picked.",
    ],
  },
  {
    id: "variant-gold-case",
    title: "Variant · gold in daylight, case detail",
    story: "direction-a-variants--gold-in-daylight",
    themes: ["light"],
    columns: [
      ["G-1 (as is)", "variant-gold-1-case"],
      ["G-2", "variant-gold-2-case"],
      ["G-3", "variant-gold-3-case"],
    ],
    text: ["On the case the gold words are what the verdict asks for. G-1 sets them in dark gold, G-2 in navy with the highlighter bar, G-3 in plain navy; the verdict surface keeps its gold edge in all three."],
  },
  {
    id: "variant-body",
    title: "Variant · body font (decided: IBM Plex Sans)",
    story: "direction-a-variants--body-font",
    columns: [
      ["Case · IBM Plex Sans", "variant-body-plex-case"],
      ["Case · Space Grotesk", "variant-body-grotesk-case"],
      ["Portal · IBM Plex Sans", "variant-body-plex-portal"],
      ["Portal · Space Grotesk", "variant-body-grotesk-portal"],
    ],
    text: ["Decided: IBM Plex Sans. At 14px the two hardly differ; Plex pairs with Plex Mono and stays calmer at small sizes. Kept as the record."],
  },
  {
    id: "variant-figures",
    title: "Variant · figure row (decided: hero footer where there is a hero, tonal strip elsewhere)",
    story: "direction-a-variants--figure-row-place",
    columns: [
      ["Hero footer", "variant-figures-hero"],
      ["Tonal strip", "variant-figures-strip"],
    ],
    text: [
      "Both work. The rule: where a page has a hero, its figures are the hero’s footer (the SOC overview); where there is none, they sit on a tonal strip (the portal home’s cost block, the case figures). Kept as the record.",
      "A rule only separates two figures: none before the first or after the last, and on a phone’s two columns only between the columns.",
    ],
  },
];

const questions = [
  "Gold in daylight: G-1, G-2 or G-3? And with G-2 or G-3, does the cooler paper replace the cream everywhere?",
  "Portal home: are 30 days the right horizon for a due decision, and which further decisions belong on the list (for example an unconfirmed domain, or an invitation about to expire)?",
  "Which component group is reworked first on these tokens, and should the overrides block in direction-a.css move into the components then?",
];

const settled = [
  "Header H-c: the head only orients; the attention list is the point.",
  "After dark, medium severity is orange #ff9d2e (high #ff7a3d), clearly apart from gold #d9b45e; all marks clear 3:1.",
  "Overview pattern: an attention list on every overview; the navy hero only where there is a signature visual. The portal home has none.",
  "Figure row: hero footer where there is a hero, tonal strip elsewhere; rules only between figures.",
  "Body: IBM Plex Sans at 14px.",
  "Tables sit on a surface without a frame of their own.",
];

const changes = [
  "Header H-c on every Direction A screen: name and state on one line, as of when at the right; no kicker, claim sentence, rule or header button. The point is the attention list under its own heading, item 01 full width with the action; nothing due is one quiet line.",
  "Figure row: the SOC overview’s figures are the hero’s footer; the case and portal figures sit on a tonal strip; rules only between figures.",
  "Attention cards: rank and first line share a baseline, every card has the same content indent, severity marks stand on the baseline of their word.",
  "Breaks: headings balance, reading text avoids a lone last word, meta lines break only between items and never on a lone “·”, buttons stack at full width on a phone, identifiers and path arrows never break badly.",
  "Portal home: rebuilt around a priority model and the real organization roles: all running and decision due for the owner, administrator, billing administrator and member, each with its own sidebar and signed-in person.",
  "Gold in daylight: three light-mode variants to choose from.",
];

const shot = (name, alt) => `<a href="shots/${name}.png" target="_blank"><img loading="lazy" alt="${alt}" src="shots/${name}.png"></a>`;

const pair = (s, theme, width) => `
  <div class="pair w${width}${s.columns.length > 2 ? " many" : ""}">
    ${s.columns.map(([caption, name]) => `<figure><figcaption>${caption}</figcaption>${shot(`${name}-${theme}-${width}`, `${s.title}, ${caption}, ${theme}, ${width}px`)}</figure>`).join("")}
    ${s.extra && width === 390 ? `<figure><figcaption>Direction A · case open</figcaption>${shot(`${s.extra}-a-${theme}-390`, `Open case on a phone, ${theme}`)}</figure>` : ""}
  </div>`;

const section = (s) => `
<section id="${s.id}">
  <h2>${s.title}</h2>
  <div class="why">${s.text.map((t) => `<p>${t}</p>`).join("")}${s.story ? `<p>Storybook: <code>?path=/story/${s.story}</code></p>` : ""}</div>
  ${(s.themes ?? ["light", "dark"]).flatMap((theme) => [1440, 390].map((w) => `<h3>${theme === "light" ? "Light" : "Dark"} · ${w}px</h3>${pair(s, theme, w)}`)).join("")}
</section>`;

const rows = contrast
  .map((r) => `<tr><td>${r.theme}</td><td>${r.label}</td><td><span class="sw" style="background:${r.fg}"></span><code>${r.fg}</code></td><td><span class="sw" style="background:${r.bg}"></span><code>${r.bg}</code></td><td class="num">${r.ratio.toFixed(2)}:1</td><td class="num">${r.min}:1</td><td>${r.pass ? "pass" : "FAIL"}</td></tr>`)
  .join("");
const passed = contrast.filter((r) => r.pass).length;
const failing = axe.filter((r) => r.violations.length);
const axeStories = new Set(axe.map((r) => r.id)).size;
const axeLine = !axe.length
  ? "axe-core was not run for this summary."
  : failing.length === 0
    ? `axe-core found no violations on the ${axeStories} Direction A stories, light and dark, at 1440 and 390 (${axe.length} runs; the “region” rule off, as Storybook runs it, because a story is a fragment).`
    : `axe-core found violations in ${failing.length} of ${axe.length} runs on ${axeStories} Direction A stories: ${[...new Set(failing.flatMap((r) => r.violations.map((v) => v.id)))].join(", ")}.`;

writeFileSync(
  `${dir}/summary.html`,
  `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Direction A comparison</title>
<style>
:root{--bg:#f1ede3;--surface:#fdfcf9;--text:#0a1f44;--muted:#3d4a66;--meta:#556076;--rule:rgba(10,31,68,.12);--one:#7a5c0e}
@media (prefers-color-scheme:dark){:root{--bg:#0a1f44;--surface:#0f2a57;--text:#f2f0e6;--muted:#c9d2e6;--meta:#a8b6d2;--rule:rgba(168,182,210,.2);--one:#e6c677}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:15px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:1400px;margin:0 auto;padding:32px 16px 96px}
.kicker{font:500 12px ui-monospace,Menlo,monospace;letter-spacing:.1em;text-transform:uppercase;color:var(--meta)}
h1{font-size:clamp(26px,4vw,38px);line-height:1.15;margin:8px 0 12px;max-width:28ch}h1 em{font-style:normal;color:var(--one)}
h2{font-size:26px;margin:72px 0 12px;padding-top:16px;border-top:1px solid var(--rule)}
h3{font:500 12px ui-monospace,Menlo,monospace;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin:32px 0 8px}
p,li{max-width:78ch}p{margin:0 0 10px}.lede{color:var(--muted);font-size:17px}
nav{display:flex;flex-wrap:wrap;gap:8px 20px;margin:20px 0}nav a{color:var(--text)}
.why{background:var(--surface);border-radius:12px;padding:20px 24px;max-width:900px}
.pair{display:grid;gap:16px;align-items:start}.pair.w1440{grid-template-columns:repeat(auto-fit,minmax(min(100%,520px),1fr))}.pair.w390{grid-template-columns:repeat(auto-fill,minmax(min(100%,260px),340px))}
figure{margin:0;min-width:0}figcaption{font:500 12px ui-monospace,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase;color:var(--meta);margin-bottom:6px}
figure img{display:block;width:100%;border-radius:8px;box-shadow:0 0 0 1px var(--rule)}
.pair.w1440 figure{max-height:1100px;overflow:auto;border-radius:8px}
table{border-collapse:collapse;width:100%;font-size:13px}th,td{text-align:left;padding:6px 8px;border-bottom:1px solid var(--rule)}th{font:500 11px ui-monospace,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
td.num{font-variant-numeric:tabular-nums;white-space:nowrap}.sw{display:inline-block;width:12px;height:12px;border-radius:3px;vertical-align:-1px;margin-right:6px;box-shadow:0 0 0 1px var(--rule)}
code{font:12px ui-monospace,Menlo,monospace}.scroll{overflow-x:auto}
</style></head><body><main>
<p class="kicker">Design system · Direction A “Briefing” · proposal, not released</p>
<h1>Three screens, rebuilt so each <em>says its point first</em>.</h1>
<p class="lede">Each screen as it is composed today (rebuilt from today’s components with the products’ mock data) and in Direction A, light and dark, at 1440px and 390px. Branch <code>direction-a</code> of the design system; Storybook section “Direction A”. Click an image for the full-size capture.</p>
<nav>${[...screens, ...variants].map((s) => `<a href="#${s.id}">${s.title}</a>`).join("")}<a href="#contrast">Contrast</a><a href="#questions">Open questions</a></nav>
<div class="why">
<p><strong>This round.</strong></p>
<ul>${changes.map((c) => `<li>${c}</li>`).join("")}</ul>
<p><strong>Settled.</strong></p>
<ul>${settled.map((c) => `<li>${c}</li>`).join("")}</ul>
</div>
<div class="why">
<p><strong>What changed everywhere.</strong> A page head only orients (name, state, as of when); the first block is the point, ranked, with the one action on its first item. Depth comes from tone, not borders, and a region has at most two visible levels. Gold marks only the one thing that matters in a view; warn has its own amber, the dark-mode primary button is paper-white, selection and focus are cornflower. Severity uses one shared five-step scale. Type has eight visible steps: Sansation for page name, hero figure and section; IBM Plex Sans for reading; IBM Plex Mono in capitals for labels. Navigation is a paper tone in daylight and the navy ground after dark, never the heaviest element.</p>
</div>
${screens.map(section).join("")}
${variants.map(section).join("")}
<section id="contrast">
<h2>Contrast, measured</h2>
<p>Measured in the browser from the live Direction A tokens (alpha colours composited over their ground; hero pairs inside the navy zone), WCAG 2.x formula. Text needs 4.5:1; marks, edges, borders and focus 3:1. ${passed} of ${contrast.length} pairs pass.</p>
<p>${axeLine}</p>
<div class="scroll"><table><thead><tr><th>Theme</th><th>Pair</th><th>Foreground</th><th>Background</th><th>Ratio</th><th>Needs</th><th>Result</th></tr></thead><tbody>${rows}</tbody></table></div>
</section>
<section id="questions">
<h2>Open questions</h2>
<ol>${questions.map((q) => `<li>${q}</li>`).join("")}</ol>
</section>
</main></body></html>
`,
);
console.log(`${dir}/summary.html`);
