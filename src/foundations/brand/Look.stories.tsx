import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import {
  Button,
  DangerAction,
  DataTable,
  Fact,
  FactList,
  Notice,
  NoticeBody,
  NoticeIcon,
  NoticeText,
  NoticeTitle,
  SealValue,
  Stack,
  StatusPill,
  TableBody,
  TableCell,
  TableColumn,
  TableHead,
  TableRow,
  Toolbar,
} from "../../index";
import { Doc, Pair } from "../guide/Doc";
import "./Look.css";

function Key({ actions, allFilled = false }: { actions: string[]; allFilled?: boolean }) {
  return (
    <Stack gap={16}>
      <FactList layout="columns">
        <Fact label="Fingerprint" mono>
          a4f9c21e
        </Fact>
        <Fact label="Expires" mono>
          2026-11-05
        </Fact>
      </FactList>
      <Toolbar align="end">
        {actions.map((action, i) => (
          <Button key={action} variant={allFilled || i === actions.length - 1 ? "primary" : "secondary"}>
            {action}
          </Button>
        ))}
      </Toolbar>
    </Stack>
  );
}

function Collectors({ className }: { className?: string }) {
  return (
    <div className={className}>
      <DataTable caption={className ? "Collectors, tint only" : "Collectors"} indexed={false}>
        <TableHead>
          <TableColumn width="fill">Collector</TableColumn>
          <TableColumn>State</TableColumn>
        </TableHead>
        <TableBody>
          {["edge-gw-01", "edge-gw-02", "edge-gw-03"].map((name) => (
            <TableRow key={name} active={!className && name === "edge-gw-02"}>
              <TableCell mono>{name}</TableCell>
              <TableCell>
                <StatusPill tone="ok">running</StatusPill>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>
    </div>
  );
}

function Marks() {
  return (
    <Stack gap={8}>
      <SealValue state="sealed" stateLabel="Sealed">
        a4f9c21e
      </SealValue>
      <SealValue state="inferred" stateLabel="Inferred">
        7f3a99e0
      </SealValue>
    </Stack>
  );
}

function Failure({ title, body }: { title: string; body?: string }) {
  return (
    <Notice tone="danger">
      <NoticeIcon />
      <NoticeText>
        <div>
          <NoticeTitle>{title}</NoticeTitle>
          {body ? <NoticeBody>{body}</NoticeBody> : null}
        </div>
      </NoticeText>
    </Notice>
  );
}

function Question({ question, cancel, confirm }: { question: string; cancel: string; confirm: string }) {
  return (
    <Stack gap={16}>
      <p className="di-look-line">{question}</p>
      <Toolbar align="end">
        <Button variant="secondary">{cancel}</Button>
        <Button variant="danger">{confirm}</Button>
      </Toolbar>
    </Stack>
  );
}

function LookPage() {
  return (
    <Doc title="Our look" lede="Each rule built right and built wrong, from the same components.">
      <Pair
        title="One strongest element"
        caption="Three filled buttons: the eye has nowhere to land."
        good={<Key actions={["Export", "Rotate key"]} />}
        bad={<Key allFilled actions={["Export", "Revoke", "Rotate key"]} />}
      />
      <Pair
        title="Selection: tint plus edge"
        caption="The tint alone: on a bright screen the row gets lost."
        good={<Collectors />}
        bad={<Collectors className="di-look-tint-only" />}
      />
      <Pair
        title="Marks in ink, gold once"
        caption="Gold edge, gold marks, a gold button: none of them is the one thing."
        goodPanel={{ emphasis: true }}
        badPanel={{ emphasis: true }}
        good={<Marks />}
        bad={
          <div data-brand="">
            <Stack gap={16}>
              <Marks />
              <Toolbar>
                <Button variant="seal">Seal entry</Button>
              </Toolbar>
            </Stack>
          </div>
        }
      />
      <Pair
        title="Danger stays apart"
        caption="Delete beside Save in one weight: one slip removes four workspaces."
        goodPanel={{ tone: "danger" }}
        good={
          <DangerAction title="Delete organization" body="Its 4 workspaces and their data are removed.">
            <Button variant="danger">Delete</Button>
          </DangerAction>
        }
        bad={
          <Toolbar align="end">
            <Button variant="secondary">Delete organization</Button>
            <Button>Save</Button>
          </Toolbar>
        }
      />
      <Pair
        title="A ring with room"
        caption="Cut by its frame, the ring no longer shows where focus is."
        good={
          <div className="di-look-ring-room">
            <Button variant="secondary" tabIndex={-1} className="di-look-ring">
              Export
            </Button>
          </div>
        }
        bad={
          <div className="di-look-ring-cut">
            <Button variant="secondary" tabIndex={-1} className="di-look-ring">
              Export
            </Button>
          </div>
        }
      />
      <Pair
        title="Say what happened"
        caption="Says nothing: what failed, and what still works?"
        good={<Failure title="The export failed: the target refused the connection." body="Your data is unchanged." />}
        bad={<Failure title="Oops! Something went wrong." />}
      />
      <Pair
        title="German: Sie, and the object named"
        caption="Informal, and it never says what is deleted."
        good={
          <div lang="de">
            <Question
              question="Organisation Northwind löschen? Ihre 4 Arbeitsbereiche und deren Daten werden entfernt."
              cancel="Abbrechen"
              confirm="Organisation löschen"
            />
          </div>
        }
        bad={
          <div lang="de">
            <Question question="Bist du sicher?" cancel="Nein" confirm="Ja" />
          </div>
        }
      />
    </Doc>
  );
}

const meta = {
  title: "Foundations/Our look",
  tags: ["layer:foundation"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;

/** Every pair is a Do beside a Don't, and every Don't carries its one caption line. */
export const OurLook: StoryObj = {
  name: "Our look",
  render: () => <LookPage />,
  play: async ({ canvasElement }) => {
    const pairs = canvasElement.querySelectorAll(".di-doc-section");
    await expect(pairs.length).toBe(7);
    for (const pair of pairs) {
      await expect(pair.querySelectorAll(".di-panel")).not.toHaveLength(0);
      await expect(pair.querySelectorAll(".di-panel-note")).toHaveLength(1);
    }
  },
};
