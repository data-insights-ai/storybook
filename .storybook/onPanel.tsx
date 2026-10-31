import type { Decorator } from "@storybook/react-vite";
import { Panel } from "../src/components/layout/page/Panel";

/**
 * Shows a story's component on the surface it lives on in a product: a
 * panel, titled as a product would title it. For content components whose
 * stories would otherwise stand on the bare canvas (`tests/surfaces/canvas.ts`).
 */
export function onPanel(title = ""): Decorator {
  return (Story) => (
    <Panel title={title === "" ? undefined : title} heading={2}>
      <Story />
    </Panel>
  );
}
