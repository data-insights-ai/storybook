import { beforeEach } from "vitest";
import { commands } from "vitest/browser";

/*
 * The real pointer stays where an earlier story left it, and a control of the next story that lands under it shows
 * its hover (it did in CI, on Linux). Each story starts with the pointer off the page, as a person opening it would.
 */
beforeEach(async () => {
  await commands.parkPointer();
});

declare module "vitest/browser" {
  interface BrowserCommands {
    parkPointer: () => Promise<void>;
  }
}
