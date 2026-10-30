import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileCheck2, Link2, Radio, Stamp } from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Spinner } from "../../../feedback/waiting/Spinner";
import { TextField } from "../../../forms/text/TextField";
import { Panel } from "../../../layout/page/Panel";
import { Stack } from "../../../layout/arrangement/Stack";
import { SealValue } from "../../../marks/status/SealValue";
import { Numbered, Stage, StageTrack, Stepper } from "./deprecated";
import { Step, StepFooter, StepIcon, Steps, type StepState } from "./Steps";

/**
 * The steps of one bounded process, in order. `progress` says where a reader
 * is in a flow, `list` is instructions they carry out, `cards` explains how
 * a process runs. Places to go are a `Sidebar` or a `TabNav`; pages of one
 * list are `Pagination`; items whose order means nothing get no number.
 */
const meta = {
  title: "Navigation/Sequence/Steps",
  component: Steps,
  tags: ["layer:block", "autodocs"],
  args: {
    label: "Source registration",
    variant: "progress",
    layout: "spread",
    stateLabels: { done: "Done", current: "Current step", upcoming: "Not started" },
    children: null,
  },
  argTypes: {
    label: { control: "text" },
    variant: { control: "inline-radio", options: ["progress", "list", "cards"] },
    layout: { control: "inline-radio", options: ["spread", "inline"] },
    tone: { control: "inline-radio", options: ["tonal", "ruled"] },
    stateLabels: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof Steps>;

export default meta;
type Story = StoryObj<typeof meta>;

const registration = ["Connect", "Verify", "Seal", "Publish"];

function progress(current: number, titles = registration) {
  return titles.map((title, i) => {
    const state: StepState = i < current ? "done" : i === current ? "current" : "upcoming";
    return <Step key={title} state={state} title={title} />;
  });
}

/** WCAG contrast of two computed rgb() colours. */
function contrast(a: string, b: string) {
  const lum = (colour: string) => {
    const [r, g, bl] = (colour.match(/[\d.]+/g) ?? []).map(Number).map((v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * The state reads without colour: a check where a step is done, a number
 * where it is not, a filled bullet and a heavier name for the current step,
 * and every bullet the same size whatever it holds.
 */
async function statesWithoutColour(canvasElement: HTMLElement) {
  const bullets = Array.from(canvasElement.querySelectorAll<HTMLElement>(".di-step-bullet"));
  for (const [i, bullet] of bullets.entries()) {
    const done = bullet.classList.contains("is-done");
    await expect(bullet.querySelector("svg") !== null).toBe(done);
    if (done) {
      const check = getComputedStyle(bullet.querySelector("svg")!).color;
      await expect(contrast(check, getComputedStyle(bullet).backgroundColor)).toBeGreaterThanOrEqual(3);
    }
    await expect(bullet.textContent).toBe(done ? "" : String(i + 1));
    const box = bullet.getBoundingClientRect();
    await expect([box.width, box.height]).toEqual([22, 22]);
  }
  const current = canvasElement.querySelector<HTMLElement>(".di-step-bullet.is-current");
  const upcoming = canvasElement.querySelector<HTMLElement>(".di-step-bullet.is-upcoming");
  if (current && upcoming) {
    await expect(getComputedStyle(current).backgroundColor).not.toBe(getComputedStyle(upcoming).backgroundColor);
    await expect(getComputedStyle(upcoming).borderColor).not.toBe(getComputedStyle(upcoming).backgroundColor);
    const weight = (selector: string) => Number(getComputedStyle(canvasElement.querySelector(selector)!).fontWeight);
    await expect(weight(".di-step-label.is-current")).toBeGreaterThan(weight(".di-step-label.is-upcoming"));
  }
}

/** Over the step it heads: where the reader is in a registration, with the current step's form under it. */
export const InAFlow: Story = {
  render: (args) => (
    <Stack gap={24}>
      <Steps {...args}>{progress(1)}</Steps>
      <Panel title="Verify">
        <TextField id="steps-fingerprint" label="Manifest fingerprint" mono placeholder="sha256:…" />
      </Panel>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole("list", { name: "Source registration" });
    await expect(list.tagName).toBe("OL");
    await expect(within(list).getAllByRole("listitem")[1]).toHaveAttribute("aria-current", "step");
    await expect(canvas.getByText("Current step")).toBeInTheDocument();
    await statesWithoutColour(canvasElement);
  },
};

/**
 * A set-up guide: instructions the reader carries out in order, each step on
 * its own tonal ground with what it needs inside, never a box in it.
 */
export const SetUpGuide: Story = {
  args: { variant: "list", tone: "tonal", label: "Connect the event hub" },
  render: (args) => (
    <Steps {...args}>
      <Step title="Create an app registration in the tenant that holds the logs." />
      <Step title="Grant it read access to the event hub namespace.">
        <TextField
          id="steps-namespace"
          label="Event hub namespace"
          mono
          placeholder="logs-prod.servicebus.windows.net"
        />
      </Step>
      <Step title="Paste its client secret here; it is stored encrypted and never shown again." />
    </Steps>
  ),
  play: async ({ canvasElement }) => {
    const rows = canvasElement.querySelectorAll<HTMLElement>(".di-step-row");
    await expect(rows).toHaveLength(3);
    await expect(rows[2].querySelector(".di-ordinal")?.textContent).toBe("03");
    await expect(rows[0].querySelector(".di-ordinal")).toHaveAttribute("aria-hidden", "true");
  },
};

/** Rows inside a surface: a playbook's steps, ruled, with no box of their own. */
export const InAPanel: Story = {
  args: { variant: "list", tone: "ruled", label: "What the playbook asks for" },
  render: (args) => (
    <Panel title="What the playbook asks for">
      <Steps {...args}>
        <Step title="Isolate the file server" />
        <Step title="Reset the service account's credentials" state="current" />
        <Step title="Revoke its sessions and tokens" />
      </Steps>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const rows = canvasElement.querySelectorAll(".di-step-row");
    await expect(rows).toHaveLength(3);
    await expect(getComputedStyle(rows[1]).borderTopStyle).toBe("solid");
    await expect(getComputedStyle(rows[0]).backgroundColor).toBe("rgba(0, 0, 0, 0)");
  },
};

/**
 * How a process runs, on an overview: each stage a card, the one that runs
 * now on navy, its closing line a slot that can hold a `Spinner` or a sealed
 * value.
 */
export const Pipeline: Story = {
  args: { variant: "cards", label: "Pipeline" },
  render: (args) => (
    <section aria-labelledby="steps-pipeline">
      {/* Cards sit under a section title on a screen; the story supplies it so the heading order stays valid. */}
      <h2 id="steps-pipeline" className="di-sr">
        Pipeline
      </h2>
      <Steps {...args}>
        <Step state="done" title="Connect">
          A source is named, reached and checked for a manifest.
          <StepIcon>
            <Link2 aria-hidden />
          </StepIcon>
          <StepFooter>≈ 30 seconds</StepFooter>
        </Step>
        <Step state="done" title="Ingest">
          Entries land in the register, unsealed and not yet citable.
          <StepIcon>
            <Radio aria-hidden />
          </StepIcon>
          <StepFooter>
            <SealValue stateLabel="Sealed">a4f9c21e</SealValue>
          </StepFooter>
        </Step>
        <Step state="current" title="Seal">
          Every entry gets a hash and a timestamp.
          <StepIcon>
            <Stamp aria-hidden />
          </StepIcon>
          <StepFooter>
            <Spinner label="sealing" />
          </StepFooter>
        </Step>
        <Step state="upcoming" title="Publish">
          The sealed extract can be cited and verified offline.
          <StepIcon>
            <FileCheck2 aria-hidden />
          </StepIcon>
          <StepFooter>on request</StepFooter>
        </Step>
      </Steps>
    </section>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole("heading", { level: 3 })).toHaveLength(4);
    const cards = canvasElement.querySelectorAll<HTMLElement>(".di-step-card");
    await expect(cards[2]).toHaveAttribute("aria-current", "step");
    await expect(getComputedStyle(cards[2]).backgroundColor).not.toBe(getComputedStyle(cards[1]).backgroundColor);
  },
};

export const FirstStep: Story = {
  render: (args) => <Steps {...args}>{progress(0)}</Steps>,
  play: async ({ canvasElement }) => statesWithoutColour(canvasElement),
};

export const LastStep: Story = {
  render: (args) => <Steps {...args}>{progress(3)}</Steps>,
  play: async ({ canvasElement }) => statesWithoutColour(canvasElement),
};

export const Complete: Story = {
  render: (args) => <Steps {...args}>{progress(4)}</Steps>,
  play: async ({ canvasElement }) => statesWithoutColour(canvasElement),
};

/** A completed step is a button that returns to it. */
export const Returnable: Story = {
  args: { onStep: fn() },
  render: (args) => <Steps {...args}>{progress(2)}</Steps>,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole("button");
    await expect(buttons).toHaveLength(2);
    await userEvent.click(buttons[0]);
    await expect(args.onStep).toHaveBeenCalledWith(0);
  },
};

/** The connector stops at the circle's edge: no line crosses a number, in any state or width. */
export const ConnectorsClearTheCircles: Story = {
  render: (args) => <Steps {...args}>{progress(2)}</Steps>,
  play: async ({ canvasElement }) => {
    const steps = Array.from(canvasElement.querySelectorAll<HTMLElement>(".di-step"));
    await expect(steps.length).toBeGreaterThan(1);
    for (const step of steps.slice(1)) {
      const line = getComputedStyle(step, "::before");
      if (line.position === "static") continue;
      const bullet = step.querySelector<HTMLElement>(".di-step-bullet")!.getBoundingClientRect();
      const previous = step
        .previousElementSibling!.querySelector<HTMLElement>(".di-step-bullet")!
        .getBoundingClientRect();
      const stepBox = step.getBoundingClientRect();
      await expect(stepBox.left + parseFloat(line.left)).toBeGreaterThanOrEqual(previous.right);
      await expect(stepBox.right - parseFloat(line.right)).toBeLessThanOrEqual(bullet.left);
    }
  },
};

/** Inline: one line from the left edge, each name beside its bullet, for a wide page. */
export const Inline: Story = {
  args: { layout: "inline" },
  render: (args) => <Steps {...args}>{progress(2)}</Steps>,
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector<HTMLElement>(".di-steps")!.getBoundingClientRect();
    const bullets = Array.from(canvasElement.querySelectorAll<HTMLElement>(".di-step-bullet")).map((b) =>
      b.getBoundingClientRect(),
    );
    await expect(Math.round(bullets[0].left)).toBe(Math.round(list.left));
    for (const bullet of bullets) await expect(Math.round(bullet.top)).toBe(Math.round(bullets[0].top));
    await expect(bullets[bullets.length - 1].left - bullets[0].left).toBeLessThan(600);
    await statesWithoutColour(canvasElement);
  },
};

const german = ["Datenquelle verbinden", "Berechtigungen überprüfen", "Einträge versiegeln", "Veröffentlichen"];

/**
 * Long German titles: spread titles wrap under their bullet, never into the
 * next step; inline titles stay on one line until the page is too narrow,
 * then only the current one keeps its name.
 */
export const LongGermanLabels: Story = {
  args: {
    label: "Registrierung der Datenquelle",
    stateLabels: { done: "Erledigt", current: "Aktueller Schritt", upcoming: "Nicht begonnen" },
  },
  render: (args) => (
    <Stack gap={32}>
      <h2 className="di-sr">Registrierung</h2>
      <Steps {...args}>{progress(1, german)}</Steps>
      <Steps {...args} layout="inline">
        {progress(1, german)}
      </Steps>
      <Steps variant="cards" label="Ablauf">
        {german.map((title, i) => (
          <Step key={title} title={title} state={i === 1 ? "current" : undefined}>
            Jeder Eintrag erhält einen Hashwert und einen Zeitstempel.
          </Step>
        ))}
      </Steps>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const spread = canvasElement.querySelector<HTMLElement>(".di-steps[data-layout='spread']")!;
    const labels = Array.from(spread.querySelectorAll<HTMLElement>(".di-step-label"))
      .map((l) => l.getBoundingClientRect())
      .filter((box) => box.width > 1);
    for (const [i, label] of labels.slice(1).entries()) {
      await expect(labels[i].right).toBeLessThanOrEqual(label.left + 1);
    }
    for (const label of labels) await expect(label.right).toBeLessThanOrEqual(spread.getBoundingClientRect().right + 1);
    await statesWithoutColour(canvasElement.querySelector<HTMLElement>(".di-steps")!);
  },
};

/** On a phone only the current step keeps its name; the bullets keep their size and their marks. */
export const Phone: Story = {
  globals: { viewport: { value: "phone", isRotated: false } },
  render: (args) => <Steps {...args}>{progress(2)}</Steps>,
  play: async ({ canvasElement }) => {
    await expect(window.innerWidth).toBe(390);
    await statesWithoutColour(canvasElement);
  },
};

/** Inline on a phone: the same bullets, one line. */
export const InlinePhone: Story = {
  args: { layout: "inline" },
  globals: { viewport: { value: "phone", isRotated: false } },
  render: (args) => <Steps {...args}>{progress(2)}</Steps>,
  play: async ({ canvasElement }) => {
    await expect(window.innerWidth).toBe(390);
    await statesWithoutColour(canvasElement);
  },
};

/**
 * Stepper, Numbered, Stage and StageTrack are deprecated (removed in 0.12) and
 * render `Steps`, so their callers keep working. A lone `Numbered` or
 * `Stage` is a list of one, never an orphan list item.
 */
export const DeprecatedNames: Story = {
  render: () => (
    <Stack gap={24}>
      <h2 className="di-sr">Deprecated names</h2>
      <Stepper
        label="Source registration"
        stateLabels={{ done: "Done", current: "Current step", upcoming: "Not started" }}
        steps={registration.map((label, i) => ({ label, state: i < 1 ? "done" : i === 1 ? "current" : "upcoming" }))}
      />
      <div>
        <Numbered index="01" variant="row">
          Isolate the file server
        </Numbered>
        <Numbered index="02" variant="row">
          Revoke its sessions and tokens
        </Numbered>
      </div>
      <StageTrack>
        <Stage step="01" title="Connect" body="A source is named, reached and checked for a manifest." />
        <Stage step="02" title="Seal" body="Every entry gets a hash and a timestamp." current={true} />
      </StageTrack>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    for (const item of Array.from(canvasElement.querySelectorAll("li"))) {
      await expect(item.parentElement?.tagName).toBe("OL");
    }
    const rows = canvasElement.querySelectorAll<HTMLElement>(".di-step-row");
    await expect(getComputedStyle(rows[1].parentElement!).borderTopStyle).toBe("solid");
    await expect(canvasElement.querySelectorAll(".di-step-card")).toHaveLength(2);
  },
};
