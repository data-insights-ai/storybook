import { afterEach, expect, test } from "vitest";
import "../../../styles/styles.css";
import "./EventTimeline.css";

afterEach(() => document.body.replaceChildren());

// The readout is measured to place it, so a width the stage's edge squeezes would move it and squeeze it again,
// without end (React stops it as "Maximum update depth exceeded").
test("a readout keeps its width wherever it sits on the stage", () => {
  const stage = document.createElement("div");
  stage.style.cssText = "position: relative; width: 600px; height: 100px; container-type: inline-size;";
  const readout = document.createElement("div");
  readout.className = "di-timeline-readout";
  readout.textContent =
    "Sign-in from a new device on srv-dc-01.corp.example.com by anna.berger@example.com · 3 records";
  stage.append(readout);
  document.body.append(stage);

  readout.style.left = "0px";
  const free = readout.offsetWidth;
  readout.style.left = "400px";
  expect(readout.offsetWidth).toBe(free);
});
