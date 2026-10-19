import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "./Button";
import { FileField } from "./FileField";
import { Toolbar } from "./Layout";

const meta = {
  title: "Forms/FileField",
  component: FileField,
  tags: ["autodocs"],
  args: {
    id: "certificate",
    label: "Certificate",
    file: undefined,
    onFileChange: () => {},
    accept: ".pem,.crt",
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
  render: function Render(args) {
    const [file, setFile] = useState<File>();
    return <FileField {...args} file={file} onFileChange={setFile} />;
  },
} satisfies Meta<typeof FileField>;

export default meta;
type Story = StoryObj<typeof meta>;

const certificate = new File(["-----BEGIN CERTIFICATE-----"], "collector-eu-west.pem", { type: "application/x-pem-file" });

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("No file chosen")).toBeInTheDocument();
    await userEvent.upload(canvas.getByLabelText("Certificate", { selector: "input" }), certificate);
    await expect(canvas.getByText("collector-eu-west.pem")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Remove file" }));
    await expect(canvas.getByText("No file chosen")).toBeInTheDocument();
  },
};

export const WithError: Story = {
  args: { hint: "This file is not a certificate.", hintTone: "error" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: /Choose file/ })).toHaveAccessibleDescription(
      "This file is not a certificate.",
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const InAToolbar: Story = {
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
