#!/usr/bin/env node
/*
 * Writes summary.html beside shots/ and contrast.json: each screen as Today
 * and Direction A, light and dark, 1440 and 390, with what changed and why,
 * the measured contrast and the open questions. Images are referenced as
 * shots/<name>.png, so the page publishes together with its files.
 *
 * Run: node scripts/direction-a/summary.mjs <dir with shots/ and contrast.json>
 */
import { readFileSync, writeFileSync } from "node:fs";

const dir = process.argv[2] ?? "dist/direction-a";
const contrast = JSON.parse(readFileSync(`${dir}/contrast.json`, "utf8"));

const screens = [
  {
    id: "soc-overview",
    title: "AI SOC · workspace overview",
    text: [
      "Today the page opens with a gold eyebrow, the noun “Production” and a lede that describes the interface; the news (“1 critical · 1 high”) sits in 12px mono under one of four equal tiles.",
      "Direction A names the page small in mono capitals and leads with a claim computed from the data: two things need you, and the words for the critical case are the one gold accent on the page.",
      "Under the claim, a ranked attention list of at most three items replaces the KPI grid; each says why it needs you and offers one action, and only the first carries the gold edge, with “Start here” in words.",
      "Detections become the one hero, on the luminous navy zone in both themes, with the open-case count set large beside it and severity on the shared scale.",
      "The remaining figures run in one unboxed row with mono labels above bright values, so a label can no longer be mistaken for its value.",
      "Devices and coverage keep a surface each, but the title of each block now states its finding (“3 of 12 tables are not arriving”) and the coverage block ends on a takeaway.",
      "Notifications, SIEM export and access, which needed three cards, are one quiet health line at the foot.",
      "The sidebar is a paper tone a step below the ground in daylight and the navy ground itself after dark, so the content is the heaviest thing on screen; the active item is marked in cornflower.",
    ],
  },
  {
    id: "soc-cases",
    title: "AI SOC · cases, list and detail",
    extra: "soc-case-open",
    text: [
      "Today the case list is a framed table, and a case opens as its own page with seven tabs, a triage rail that starts with four selects, and up to four nested boxes.",
      "Direction A keeps the list on the left and the open case on the right at all times, from about 900px of content width; the selected case is marked in cornflower, never gold.",
      "The list sorts by the shared severity scale, whose mark fills four steps as the level rises, so it reads without colour; the word stays in text colour.",
      "The case opens on the AI SOC’s verdict as its claim, and the action it asks for is the gold part of the sentence, followed by one filled button and two quieter ones.",
      "The proof (rule 14 and the path vpn-gw-01 → ws-fin-014 → srv-fs-02 → 192.0.2.88) is the one emphasised surface, ahead of any evidence.",
      "Figures, the five-phase story and the latest signals follow; the signals table sits directly on its surface with its head in the inset tone, one level deep instead of four.",
      "On a phone the list and the case take turns, with a way back to the list; the third phone capture shows the open case.",
    ],
  },
  {
    id: "portal-home",
    title: "Account portal · organization home",
    text: [
      "Today the page promises “what needs attention” and then shows a products panel holding one small outline button and five equal cards with charts, none of which says whether anything is wrong.",
      "Direction A answers the question in the claim: everything runs, and one decision is due, the Team add-on ending in 11 days with three of five seats.",
      "Opening a product, the main reason to visit, becomes the first block: large link rows instead of a small button in a wide panel.",
      "The licence that needs the decision is the one emphasised surface, with its deadline in the label and its consequence as the takeaway.",
      "The page’s one filled button is the action the claim asks for, renewing the add-on; links are plain underlines in text colour, no longer gold.",
      "Seats, members, triage runs and ingest move into one unboxed figure row; credit keeps a chart because its trend is the point, with the balance as a hero figure.",
      "Recent changes read as a list of what happened, with the time in mono at the right instead of a two-column fact table.",
    ],
  },
];

const questions = [
  "The page name is a small mono h1 and the claim is the largest text. Keep that, or make the claim itself the h1?",
  "After dark, gold #d9b45e sits fairly close to medium-severity amber #ffbe4d. Acceptable, or push medium further toward orange?",
  "Is attention list plus one navy hero the overview pattern for every product, including CVE Current and portal pages without a signature visual?",
  "Body goes from 13 to 14px, and Space Grotesk / JetBrains Mono become Sansation / IBM Plex. Adopt for the rework, or keep Space Grotesk for body text?",
  "Tables lose their own frame and sit on a surface, against today’s rule “a DataTable is its own frame”. Adopt?",
  "Which component group is reworked first on these tokens, and should the overrides block in direction-a.css move into the components then?",
];

const shot = (name, alt) => `<a href="shots/${name}.png" target="_blank"><img loading="lazy" alt="${alt}" src="shots/${name}.png"></a>`;

const pair = (s, theme, width) => `
  <div class="pair w${width}">
    <figure><figcaption>Today</figcaption>${shot(`${s.id}-today-${theme}-${width}`, `${s.title}, today, ${theme}, ${width}px`)}</figure>
    <figure><figcaption>Direction A</figcaption>${shot(`${s.id}-a-${theme}-${width}`, `${s.title}, Direction A, ${theme}, ${width}px`)}</figure>
    ${s.extra && width === 390 ? `<figure><figcaption>Direction A · case open</figcaption>${shot(`${s.extra}-a-${theme}-390`, `Open case on a phone, ${theme}`)}</figure>` : ""}
  </div>`;

const section = (s) => `
<section id="${s.id}">
  <h2>${s.title}</h2>
  <div class="why">${s.text.map((t) => `<p>${t}</p>`).join("")}</div>
  ${["light", "dark"].flatMap((theme) => [1440, 390].map((w) => `<h3>${theme === "light" ? "Light" : "Dark"} · ${w}px</h3>${pair(s, theme, w)}`)).join("")}
</section>`;

const rows = contrast
  .map((r) => `<tr><td>${r.theme}</td><td>${r.label}</td><td><span class="sw" style="background:${r.fg}"></span><code>${r.fg}</code></td><td><span class="sw" style="background:${r.bg}"></span><code>${r.bg}</code></td><td class="num">${r.ratio.toFixed(2)}:1</td><td class="num">${r.min}:1</td><td>${r.pass ? "pass" : "FAIL"}</td></tr>`)
  .join("");
const passed = contrast.filter((r) => r.pass).length;

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
<nav>${screens.map((s) => `<a href="#${s.id}">${s.title}</a>`).join("")}<a href="#contrast">Contrast</a><a href="#questions">Open questions</a></nav>
<div class="why">
<p><strong>What changed everywhere.</strong> Pages name themselves small and lead with a claim. Depth comes from tone, not borders, and a region has at most two visible levels. Gold marks only the one thing that matters in a view; warn has its own amber, the dark-mode primary button is paper-white, selection and focus are cornflower. Severity uses one shared five-step scale. Type has seven visible steps: Sansation for claim, hero figure and section; IBM Plex Sans for reading; IBM Plex Mono in capitals for labels. Navigation is a paper tone in daylight and the navy ground after dark, never the heaviest element.</p>
</div>
${screens.map(section).join("")}
<section id="contrast">
<h2>Contrast, measured</h2>
<p>Measured in the browser from the live Direction A tokens (alpha colours composited over their ground), WCAG 2.x formula. Text needs 4.5:1; marks, edges, borders and focus 3:1. ${passed} of ${contrast.length} pairs pass. axe-core found no violations on the Direction A stories in both themes at 1440 and 390 (the “region” rule off, as Storybook runs it, because a story is a fragment).</p>
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
