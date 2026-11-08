import { afterEach, expect, test } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import type { ReactNode } from "react";
import "../styles/styles.css";
import { AppShellContent } from "../components/shell/AppShellContent";
import { Figure } from "../components/figures/Figure";
import { FigureRow } from "../components/figures/FigureRow";
import { Notice, NoticeBody, NoticeText, NoticeTitle } from "../components/feedback/Notice";
import { Page } from "../components/layout/page/Page";
import { PageHeader, PageHeaderTitle } from "../components/layout/page/PageHeader";
import { Panel } from "../components/layout/page/Panel";
import { surfaceFindings, surfaceScript } from "./surfaces";

let root: Root | undefined;

function findings(node: ReactNode) {
  const host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  flushSync(() => root!.render(<AppShellContent>{node}</AppShellContent>));
  const inPage = surfaceFindings();
  expect(new Function(`return ${surfaceScript()}`)(), "the script a product runs finds the same").toEqual(inPage);
  return inPage;
}

afterEach(() => {
  root?.unmount();
  document.body.replaceChildren();
});

test("the page's frame and its surfaces stand on the ground; their content does not count", () => {
  expect(
    findings(
      <>
        <Page>
          <PageHeader>
            <PageHeaderTitle>Sources</PageHeaderTitle>
          </PageHeader>
          <Panel title="Feeds">Twelve feeds report.</Panel>
          <FigureRow label="Figures">
            <Figure label="Open" value="4" />
            <Figure label="Closed" value="12" />
          </FigureRow>
          <Notice variant="line">
            <NoticeBody>Prices exclude tax.</NoticeBody>
          </Notice>
          <Notice>
            <NoticeText>
              <NoticeTitle>Sync paused</NoticeTitle>
              <NoticeBody>Two feeds wait for a key.</NoticeBody>
            </NoticeText>
          </Notice>
        </Page>
        <footer>
          <p>Imprint</p>
        </footer>
      </>,
    ),
  ).toEqual([]);
});

test("a paragraph, a button, a footer figure row and a footer inside the page stand on the bare ground", () => {
  expect(
    findings(
      <>
        <Page>
          <FigureRow label="Figures" variant="footer">
            <Figure label="Open" value="4" />
          </FigureRow>
          <p className="lede">Nothing on a surface.</p>
          <button type="button" aria-label="Refresh" />
          <footer>Refunds within 14 days.</footer>
        </Page>
        <footer>Imprint</footer>
      </>,
    ),
  ).toEqual([
    'dt.di-figure-label "Open"',
    'dd.di-figure-value "4"',
    'p.lede "Nothing on a surface."',
    'button "Refresh"',
    'footer "Refunds within 14 days."',
  ]);
});

test("a footer that does not end main is content", () => {
  expect(
    findings(
      <>
        <footer>Imprint</footer>
        <Page>
          <Panel title="Feeds">Twelve feeds report.</Panel>
        </Page>
      </>,
    ),
  ).toEqual(['footer "Imprint"']);
});

test("what is hidden or clipped away is not shown", () => {
  expect(
    findings(
      <Page>
        <p hidden>Hidden</p>
        <p className="di-sr">Read aloud</p>
        <details>
          <summary className="di-surface">More</summary>
          <p>Folded</p>
        </details>
        <div style={{ overflow: "hidden", height: 0 }}>
          <p>Clipped</p>
        </div>
      </Page>,
    ),
  ).toEqual([]);
});
