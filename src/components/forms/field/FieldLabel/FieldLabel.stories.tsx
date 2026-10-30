import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, within } from "storybook/test";
import { FieldStack } from "../../../layout/arrangement/FieldStack";
import { DateField } from "../../dates/DateField";
import { TimeField } from "../../dates/TimeField";
import { Select } from "../../select/Select";
import { FileField } from "../../text/FileField";
import { QuantityField } from "../../text/QuantityField";
import { TextArea } from "../../text/TextArea";
import { TokenField } from "../../text/TokenField";
import { FieldHint } from "../FieldHint";
import { FieldLabel } from "./FieldLabel";

const meta = {
  title: "Forms/Field/FieldLabel",
  component: FieldLabel,
  tags: ["layer:form", "autodocs"],
  args: { label: "Severity floor", labelTrack: "record", hideLabel: false, required: false },
  decorators: [
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
 * `htmlFor` the label is a span the control names itself by.
 */
export const OwnControl: Story = {
  name: "Own control",
  render: (args) => (
    <div className="di-field">
      <FieldLabel {...args} id="floor-label" />
      <input
        type="range"
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
    await expect(within(canvasElement).getByRole("slider", { name: "Severity floor" })).toBeVisible();
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
      <FieldStack>
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
        <TokenField
          id="de-invite"
          label="E-Mail-Adressen der einzuladenden Personen"
          required={true}
          values={emails}
          onChange={setEmails}
          isValid={(v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)}
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
      </FieldStack>
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
