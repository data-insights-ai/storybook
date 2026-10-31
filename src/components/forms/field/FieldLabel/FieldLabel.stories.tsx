import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, within } from "storybook/test";
import { Button } from "../../../actions/Button";
import { Stack } from "../../../layout/arrange/Stack";
import { ComboBox } from "../../select/ComboBox";
import { DateRangePicker } from "../../dates/DateRangePicker";
import { SearchField } from "../../text/SearchField";
import { TextField } from "../../text/TextField";
import { DateField } from "../../dates/DateField";
import { TimeField } from "../../dates/TimeField";
import { MultiComboBox } from "../../select/MultiComboBox";
import { Select } from "../../select/Select";
import { FileField } from "../../text/FileField";
import { QuantityField } from "../../text/QuantityField";
import { TextArea } from "../../text/TextArea";
import { FieldHint } from "../FieldHint";
import { FieldLabel } from "./FieldLabel";
import { onPanel } from "../../../../../.storybook/onPanel";

const meta = {
  title: "Forms/Field/FieldLabel",
  component: FieldLabel,
  tags: ["layer:form", "autodocs"],
  args: { label: "Severity floor", labelTrack: "record", hideLabel: false, required: false },
  decorators: [
    onPanel("Alert rule"),
    (Story) => (
      <div style={{ maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FieldLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A control a product draws itself takes the same row above it and the
 * same line under it, so it reads as one of the fields beside it. Without
 * `htmlFor` the label is a span the control names itself by. A native
 * control (here a range) fills in the strong primary fill on a track in the
 * input border tone, in either theme; cornflower is only its focus ring.
 */
export const OwnControl: Story = {
  name: "Own control",
  render: (args) => (
    <div className="di-field">
      <FieldLabel {...args} id="floor-label" />
      <input
        type="range"
        style={{ width: "100%", margin: 0 }}
        aria-labelledby="floor-label"
        aria-describedby="floor-hint"
        min={1}
        max={4}
        defaultValue={3}
      />
      <FieldHint id="floor-hint" tone="neutral">
        Cases below high are filed without a notification.
      </FieldHint>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const slider = within(canvasElement).getByRole("slider", { name: "Severity floor" });
    await expect(slider).toBeVisible();
    const colour = (value: string) => {
      const probe = canvasElement.ownerDocument.createElement("i");
      probe.style.color = value;
      canvasElement.append(probe);
      const painted = getComputedStyle(probe).color;
      probe.remove();
      return painted;
    };
    const style = getComputedStyle(slider);
    await expect(style.accentColor).toBe(colour("var(--di-fill-strong)"));
    await expect(colour(style.getPropertyValue("--di-range-fill"))).toBe(colour("var(--di-fill-strong)"));
    await expect(colour(style.getPropertyValue("--di-range-track"))).toBe(colour("var(--di-border-input)"));
    for (const control of canvasElement.ownerDocument.querySelectorAll("input, progress, meter"))
      await expect(getComputedStyle(control).accentColor).not.toBe(colour("var(--di-select)"));
  },
};

/**
 * Every field draws this row, in German, where labels run a third longer:
 * a long label wraps under its own width, the required mark stays on its
 * last word, and errors, read-only and disabled read the same in each.
 */
export const EveryFieldGerman: Story = {
  name: "Every field, German",
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [file, setFile] = useState<File | undefined>();
    const [emails, setEmails] = useState(["nora.feld@data-insights.ai", "jonas.brandt@data-insights"]);
    const [seats, setSeats] = useState(25);
    const [day, setDay] = useState("2026-11-02");
    const [time, setTime] = useState("22:00");
    return (
      <Stack variant="form">
        <Select
          id="de-severity"
          label="Mindestschweregrad für Benachrichtigungen an das Bereitschaftsteam"
          required={true}
          defaultValue="high"
        >
          <option value="critical">Kritisch</option>
          <option value="high">Hoch</option>
          <option value="medium">Mittel</option>
        </Select>
        <TextArea
          id="de-ca"
          label="Zertifikat der Zertifizierungsstelle des Weiterleitungsservers"
          required={true}
          mono={true}
          rows={3}
          defaultValue="kein Zertifikat"
          hint="Das ist kein PEM-Zertifikat. Fügen Sie den vollständigen Block mit Anfangs- und Endzeile ein."
          hintTone="error"
        />
        <FileField
          id="de-cert"
          label="Client-Zertifikat des Sammlers"
          required={true}
          file={file}
          onFileChange={setFile}
          accept=".pem,.crt"
          dropLabel="Zertifikat hierher ziehen"
          chooseLabel="Datei auswählen"
          emptyLabel="Keine Datei ausgewählt"
          clearLabel="Datei entfernen"
          wrongTypeLabel="Wählen Sie eine .pem- oder .crt-Datei."
          tooLargeLabel="Die Datei ist zu groß."
        />
        <MultiComboBox
          id="de-invite"
          freeEntry
          label="E-Mail-Adressen der einzuladenden Personen"
          required={true}
          values={emails}
          onChange={setEmails}
          validate={(v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)}
          invalidLabel="keine E-Mail-Adresse"
          removeLabel={(v) => `${v} entfernen`}
          hint="1 Eintrag ist keine E-Mail-Adresse."
          hintTone="error"
        />
        <QuantityField
          id="de-seats"
          label="Anzahl der Arbeitsplätze"
          value={seats}
          onChange={setSeats}
          min={1}
          max={500}
          decrementLabel="Einen weniger"
          incrementLabel="Einen mehr"
          invalidHint="Geben Sie eine ganze Zahl von 1 bis 500 ein."
          disabled={true}
          hint="Vom Lizenzvertrag festgelegt."
        />
        <DateField
          id="de-from"
          label="Erster Tag der Aufbewahrungsfrist"
          locale="de-DE"
          value={day}
          onChange={setDay}
          readOnly={true}
        />
        <TimeField
          id="de-quiet"
          label="Beginn der Ruhezeit für Benachrichtigungen"
          locale="de-DE"
          value={time}
          onChange={setTime}
          required={true}
        />
      </Stack>
    );
  },
  play: async ({ canvasElement }) => {
    const marked = [...canvasElement.querySelectorAll(".di-field-label")].filter((label) =>
      getComputedStyle(label, "::after").content.includes("*"),
    );
    await expect(marked).toHaveLength(5);
    await expect(
      within(canvasElement).getByLabelText("Client-Zertifikat des Sammlers", { selector: "input" }),
    ).toBeRequired();
  },
};

const frames: [string, string][] = [
  ["text", "input.di-control"],
  ["search", ".di-search"],
  ["select", "select.di-control"],
  ["combo", ".di-combobox-control .di-control"],
  ["multi", ".di-token-field"],
  ["date", ".di-date-field .di-date-control"],
  ["time", ".di-time-field .di-date-control"],
  ["range", ".di-date-range"],
  ["quantity", ".di-quantity-step"],
  ["area", "textarea.di-control"],
];

/**
 * Every input frame beside a Button of the same size: one tone, one border,
 * one radius, one height in each density, and icons and keys centred in
 * the frame. The play measures it, so a frame that drifts fails here.
 */
export const FramesBesideAButton: Story = {
  name: "Frames beside a button",
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [text, setText] = useState("");
    const [combo, setCombo] = useState("");
    const [members, setMembers] = useState(["nora.feld@data-insights.ai"]);
    const [day, setDay] = useState("");
    const [time, setTime] = useState("");
    const [range, setRange] = useState({ preset: "24h" as const });
    const [seats, setSeats] = useState(5);
    const row = { display: "flex", alignItems: "flex-end", gap: "var(--di-gap-8)", flexWrap: "wrap" } as const;
    const cell = { flex: "1 1 14rem", minWidth: 0 } as const;
    return (
      <Stack variant="form">
        <div style={row} data-frame="text">
          <div style={cell}>
            <TextField
              id="f-text"
              label="Host"
              placeholder="mirror.example.net"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <Button variant="secondary">Apply</Button>
        </div>
        <div style={row} data-frame="search">
          <div style={cell}>
            <SearchField id="f-search" label="Search the register" placeholder="host, hash or operator" />
          </div>
          <Button variant="secondary">Apply</Button>
        </div>
        <div style={row} data-frame="select">
          <div style={cell}>
            <Select id="f-select" label="Severity floor" defaultValue="high">
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </Select>
          </div>
          <Button variant="secondary">Apply</Button>
        </div>
        <div style={row} data-frame="combo">
          <div style={cell}>
            <ComboBox
              id="f-combo"
              label="Operator"
              value={combo}
              onValueChange={setCombo}
              suggestions={[{ value: "nora", label: "Nora Feld" }]}
              toggleLabel="Show operators"
              placeholder="Name or id"
            />
          </div>
          <Button variant="secondary">Apply</Button>
        </div>
        <div style={row} data-frame="multi">
          <div style={cell}>
            <MultiComboBox
              id="f-multi"
              label="Recipients"
              freeEntry
              values={members}
              onChange={setMembers}
              removeLabel={(v) => `Remove ${v}`}
            />
          </div>
          <Button variant="secondary">Apply</Button>
        </div>
        <div style={row} data-frame="date">
          <div style={cell}>
            <DateField id="f-date" label="Valid from" value={day} onChange={setDay} />
          </div>
          <Button variant="secondary">Apply</Button>
        </div>
        <div style={row} data-frame="time">
          <div style={cell}>
            <TimeField id="f-time" label="Quiet from" value={time} onChange={setTime} />
          </div>
          <Button variant="secondary">Apply</Button>
        </div>
        <div style={row} data-frame="range">
          <div style={cell}>
            <DateRangePicker id="f-range" label="Period" value={range} onChange={() => setRange({ preset: "24h" })} />
          </div>
          <Button variant="secondary">Apply</Button>
        </div>
        <div style={row} data-frame="quantity">
          <QuantityField
            id="f-seats"
            label="Seats"
            value={seats}
            onChange={setSeats}
            min={1}
            max={50}
            decrementLabel="One fewer"
            incrementLabel="One more"
            invalidHint="Between 1 and 50 seats."
          />
          <Button variant="secondary">Apply</Button>
        </div>
        <div style={row} data-frame="area">
          <div style={cell}>
            <TextArea id="f-area" label="Note" placeholder="Why this host is trusted" />
          </div>
        </div>
      </Stack>
    );
  },
  play: async ({ canvasElement }) => {
    await Promise.all(document.getAnimations().map((a) => a.finished));
    const button = canvasElement.querySelector<HTMLElement>(".di-btn")!;
    const b = getComputedStyle(button);
    const height = Math.round(button.getBoundingClientRect().height);
    const first = canvasElement.querySelector<HTMLElement>(frames[0][1])!;
    // The pointer may rest on a frame (it does in CI), so the tone at rest comes from the token, not from a frame.
    const probe = document.createElement("div");
    probe.style.border = "1px solid var(--di-border-input)";
    canvasElement.append(probe);
    const reference = {
      borderTopColor: getComputedStyle(probe).borderTopColor,
      backgroundColor: getComputedStyle(first).backgroundColor,
    };
    probe.remove();
    const drift: string[] = [];
    for (const [name, selector] of frames) {
      const frame = canvasElement.querySelector<HTMLElement>(`[data-frame="${name}"] ${selector}`)!;
      const f = getComputedStyle(frame);
      const box = frame.getBoundingClientRect();
      if (f.borderTopLeftRadius !== b.borderTopLeftRadius) drift.push(`${name} radius ${f.borderTopLeftRadius}`);
      if (name !== "quantity" && f.borderTopColor !== reference.borderTopColor)
        drift.push(`${name} border ${f.borderTopColor}`);
      if (name !== "quantity" && f.backgroundColor !== reference.backgroundColor)
        drift.push(`${name} tone ${f.backgroundColor}`);
      if (name === "area") continue;
      if (Math.round(box.height) !== height) drift.push(`${name} height ${box.height} beside ${height}`);
      for (const mark of frame.querySelectorAll<Element>("svg, kbd")) {
        const m = mark.getBoundingClientRect();
        if (m.height === 0 || m.height >= box.height - 2) continue;
        const offset = m.top + m.height / 2 - (box.top + box.height / 2);
        if (Math.abs(offset) > 1) drift.push(`${name} ${mark.tagName} off centre ${offset.toFixed(1)}`);
      }
    }
    await expect(drift).toEqual([]);
  },
};
