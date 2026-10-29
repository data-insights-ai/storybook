import { afterEach, describe, expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import "../../../../styles.css";
import { Select } from "./Select";
import { DataTable, TableBody, TableCell, TableColumn, TableHead, TableRow } from "../../../data/table/DataTable";

let root: Root | undefined;

function show(node: React.ReactNode) {
  const host = document.createElement("div");
  host.style.width = "320px";
  document.body.append(host);
  root = createRoot(host);
  flushSync(() => root!.render(node));
  return host;
}

afterEach(() => {
  root?.unmount();
  document.body.replaceChildren();
});

function background(token: string) {
  const probe = document.createElement("div");
  probe.style.background = `var(${token})`;
  document.body.append(probe);
  return getComputedStyle(probe).backgroundColor;
}

function windowSelect() {
  return show(
    <Select id="window" label="Window" defaultValue="24h">
      <option value="1h">last hour</option>
      <option value="24h">last 24 hours</option>
      <optgroup label="Longer">
        <option value="7d">last 7 days</option>
      </optgroup>
    </Select>,
  ).querySelector("select")!;
}

describe("select list under a pointer", () => {
  test("opens below the field, drawn like a ComboBox's, the choice on the page ground", async () => {
    const select = windowSelect();
    await userEvent.click(select);
    expect(select.matches(":open")).toBe(true);
    const field = select.getBoundingClientRect();
    const options = [...select.querySelectorAll("option")];
    const first = options[0].getBoundingClientRect();
    expect(first.top).toBeGreaterThanOrEqual(field.bottom);
    expect(first.height).toBeGreaterThanOrEqual(field.height);
    expect(getComputedStyle(options[1]).backgroundColor).toBe(background("--di-bg-page"));
    expect(getComputedStyle(options[2]).color).not.toBe(getComputedStyle(select.querySelector("optgroup")!).color);
  });

  test("keeps the chosen text centred in the closed field", () => {
    const select = windowSelect();
    expect(getComputedStyle(select).alignItems).toBe("center");
  });

  test("leaves a select in a table native, so its column keeps its width across choices", () => {
    const select = show(
      <DataTable caption="Members">
        <TableHead>
          <TableColumn>Role</TableColumn>
          <TableColumn>Person</TableColumn>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <Select id="role" label="Role" hideLabel defaultValue="a">
                <option value="a">Auditor</option>
                <option value="o">Operator of the second shift</option>
              </Select>
            </TableCell>
          </TableRow>
        </TableBody>
      </DataTable>,
    ).querySelector("select")!;
    const before = select.getBoundingClientRect().width;
    flushSync(() => {
      select.value = "o";
    });
    expect(select.getBoundingClientRect().width).toBe(before);
  });
});
