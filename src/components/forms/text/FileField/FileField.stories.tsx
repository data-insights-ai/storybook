import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../../../actions/Button";
import { FileField } from "./FileField";
import { Toolbar } from "../../../layout/arrangement/Toolbar";

const meta = {
  title: "Forms/Text/FileField",
  component: FileField,
  tags: ["layer:form", "autodocs"],
  args: {
    id: "certificate",
    label: "Certificate",
    file: undefined,
    onFileChange: () => {},
    accept: ".pem,.crt",
    dropLabel: "Drop a certificate here",
    chooseLabel: "Choose file",
    emptyLabel: "No file chosen",
    clearLabel: "Remove file",
    wrongTypeLabel: "Choose a .pem or .crt file.",
    tooLargeLabel: "This file is too large.",
    hint: "PEM-encoded certificate of the collector.",
    hintTone: "neutral",
    labelTrack: "record",
    disabled: false,
    required: false,
  },
  argTypes: {
    hintTone: { control: "radio", options: ["neutral", "sealed", "error"] },
    labelTrack: { control: "radio", options: ["record", "prose"] },
    file: { control: false },
    onFileChange: { control: false },
  },
  decorators: [
    (Story, { parameters }) =>
      parameters.measure === false ? (
        <Story />
      ) : (
        <div style={{ maxWidth: 480 }}>
          <Story />
        </div>
      ),
  ],
  render: function Render(args) {
    const [file, setFile] = useState<File>();
    return <FileField {...args} file={file} onFileChange={setFile} />;
  },
} satisfies Meta<typeof FileField>;

export default meta;
type Story = StoryObj<typeof meta>;

const certificate = new File(["-----BEGIN CERTIFICATE-----"], "collector-eu-west.pem", { type: "application/x-pem-file" });

/**
 * One dashed area with a line about dropping and a button that opens the
 * picker. A chosen file is a row with its size and a remove button. Focus
 * moves to that button once a file is chosen and back to the choose button
 * once it is removed; the native input is hidden from assistive technology.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const choose = canvas.getByRole("button", { name: "Choose file Certificate" });
    await expect(choose).toHaveTextContent("Choose file");
    await expect(choose).toHaveAccessibleDescription("No file chosen PEM-encoded certificate of the collector.");
    await expect(canvas.getByRole("group", { name: "Certificate" })).toHaveAccessibleDescription("Drop a certificate here");
    const input = canvas.getByLabelText("Certificate", { selector: "input" });
    await expect(input).toHaveAttribute("aria-hidden", "true");
    // As after the picker: the choose button keeps focus while the file arrives.
    choose.focus();
    const picked = new DataTransfer();
    picked.items.add(certificate);
    (input as HTMLInputElement).files = picked.files;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await expect(canvas.getByText("collector-eu-west.pem")).toBeInTheDocument();
    await expect(canvas.getByText(/byte/)).toBeInTheDocument();
    const remove = canvas.getByRole("button", { name: "Remove file: collector-eu-west.pem" });
    await waitFor(() => expect(remove).toHaveFocus());
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(canvas.getByRole("button", { name: "Choose file Certificate" })).toHaveFocus());
  },
};

/** A file the field does not take is not passed on; the line under it says why. */
export const Refused: Story = {
  args: { maxBytes: 10, tooLargeLabel: "The file is larger than 10 bytes." },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Certificate", { selector: "input" });
    await userEvent.upload(input, new File(["x"], "notes.txt", { type: "text/plain" }), { applyAccept: false });
    await expect(canvas.getByText("Choose a .pem or .crt file.")).toBeInTheDocument();
    await userEvent.upload(input, certificate);
    await expect(canvas.getByText("The file is larger than 10 bytes.")).toBeInTheDocument();
    await expect(canvas.queryByText("collector-eu-west.pem")).toBeNull();
  },
};

export const WithError: Story = {
  args: { hint: "This file is not a certificate.", hintTone: "error" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Choose file Certificate" })).toHaveAccessibleDescription(
      "No file chosen This file is not a certificate.",
    );
  },
};

/** A chosen file: one row with its name, its size and the way to remove it. */
export const Chosen: Story = {
  args: { required: true },
  render: function Render(args) {
    const [file, setFile] = useState<File | undefined>(certificate);
    return <FileField {...args} file={file} onFileChange={setFile} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("collector-eu-west.pem")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Remove file: collector-eu-west.pem" })).toBeVisible();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const InAToolbar: Story = {
  parameters: { measure: false },
  render: function Render(args) {
    const [file, setFile] = useState<File>();
    return (
      <Toolbar>
        <FileField {...args} file={file} onFileChange={setFile} />
        <Button disabled={!file}>Upload</Button>
      </Toolbar>
    );
  },
};
