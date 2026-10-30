import type { Meta, StoryObj } from "@storybook/react-vite";
import { Globe, ShieldCheck, Timer } from "lucide-react";
import { PrivacyBadge } from "./PrivacyBadge";

const meta = {
  title: "Inference/PrivacyBadge",
  component: PrivacyBadge,
  tags: ["layer:block", "status:deprecated"],
  args: { scope: "local", children: null },
} satisfies Meta<typeof PrivacyBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Deprecated: renders `StatusPill track="record" icon`, local `ok`, external `warn`, retention `neutral`. */
export const Every: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <PrivacyBadge scope="local">
        <ShieldCheck aria-hidden />
        local processing
      </PrivacyBadge>
      <PrivacyBadge scope="external">
        <Globe aria-hidden />
        model · eu-central
      </PrivacyBadge>
      <PrivacyBadge scope="retention">
        <Timer aria-hidden />
        retained 30 days
      </PrivacyBadge>
    </div>
  ),
};
