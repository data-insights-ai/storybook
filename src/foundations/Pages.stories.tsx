import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus } from "lucide-react";
import {
  Button,
  DangerAction,
  DataTable,
  Grid,
  PageHeader,
  PageHeaderAside,
  PageHeaderTitle,
  Panel,
  SearchField,
  Select,
  StatusPill,
  Step,
  Steps,
  TableBody,
  TableCell,
  TableColumn,
  TableHead,
  TableRow,
  Toolbar,
} from "../index";
import { Doc, DocSection, Rules } from "./guide/Doc";

const members = [
  { name: "Nora Feld", role: "Owner", state: "active" },
  { name: "Jonas Weber", role: "Analyst", state: "invited" },
];

function ListExample() {
  return (
    <section aria-label="Example: a list page" className="di-doc-section">
      <PageHeader level={2}>
        <PageHeaderTitle>Members</PageHeaderTitle>
        <PageHeaderAside>
          <Button>
            <Plus /> Invite people
          </Button>
        </PageHeaderAside>
      </PageHeader>
      <Toolbar role="search" label="Filter members">
        <SearchField id="pages-search" label="Search members" placeholder="Search members" shortcut="/" />
        <Select id="pages-role" label="Role" hideLabel mono={false} defaultValue="">
          <option value="">All roles</option>
          <option value="owner">Owner</option>
          <option value="analyst">Analyst</option>
        </Select>
      </Toolbar>
      <Panel padded={false}>
        <DataTable caption="Members" indexed={false} narrow="stack">
          <TableHead>
            <TableColumn width="fill">Name</TableColumn>
            <TableColumn>Role</TableColumn>
            <TableColumn>State</TableColumn>
          </TableHead>
          <TableBody>
            {members.map((m) => (
              <TableRow key={m.name}>
                <TableCell label="Name">{m.name}</TableCell>
                <TableCell label="Role">{m.role}</TableCell>
                <TableCell label="State">
                  <StatusPill tone={m.state === "active" ? "ok" : "neutral"}>{m.state}</StatusPill>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
      </Panel>
    </section>
  );
}

function PagesPage() {
  return (
    <Doc
      title="Pages"
      lede="A page has one job and shows it first. A list page finds and opens records; a detail page states one record and lets a reader change a part of it; a create flow makes a new one. Patterns/ has each one whole, on the product shell, with its empty, loading, error and German states."
    >
      <DocSection
        title="Where each action goes"
        lede="Write down who arrives, their three most frequent tasks and what they must see first. Nothing frequent below the fold, nothing destructive next to something routine."
      >
        <ListExample />
        <Rules>
          <li>The page's primary action sits in PageHeaderAside, top right.</li>
          <li>
            Actions on the whole list (export, a view switch) sit at the end of the list's Toolbar and apply the current
            search and filters.
          </li>
          <li>
            Actions on one row sit in the row: frequent safe ones in a row Toolbar on hover, all of them in the row's
            Menu. Opening the row is the row itself.
          </li>
          <li>Frequent actions have a key, shown beside the control: / search, n new, e edit.</li>
        </Rules>
      </DocSection>

      <DocSection
        title="List page"
        lede="The header with the primary action, a sticky search toolbar, then the table, or one empty Notice in its place."
      >
        <Rules>
          <li>
            Search and filters run on the server and live in the URL, so a link, a reload and Back show the same list.
          </li>
          <li>
            The list loads page by page and fetches the next page before the end. No pagination control, no Load more.
          </li>
          <li>
            The toolbar and the table head stay in view while the list scrolls; a long list scrolls inside its frame.
          </li>
          <li>
            Realtime entries appear in place in a sorted list; in a newest-first list they wait behind the “n new”
            notice while the reader is further down.
          </li>
          <li>
            The first load is a skeleton (Loading), not a spinner. An empty result names why and offers one way out.
          </li>
          <li>
            A row's detail or a form opens in a side Dialog. From 1280px the page keeps a side column and a medium
            dialog docks there; narrower, it covers the page. A confirmation stays a centred dialog.
          </li>
          <li>
            On a phone the toolbar has at most two rows: its end actions become icon buttons or fold into an overflow. A
            table stacks its rows or scrolls inside its frame, never the page.
          </li>
        </Rules>
      </DocSection>

      <DocSection
        title="Detail page"
        lede="The header with the way back, the status beside the name and the key facts; then DetailSections; the danger zone last."
      >
        <Panel tone="danger" title="Danger zone" heading={3}>
          <DangerAction
            title="Leave the organization"
            body="You lose access to its workspaces at once."
            note="You are the only owner. Make someone else an owner first."
          >
            <Button variant="danger" disabled>
              Leave
            </Button>
          </DangerAction>
          <DangerAction
            title="Delete the organization"
            body="Its 4 workspaces and their data are removed. This cannot be undone."
          >
            <Button variant="danger">Delete organization</Button>
          </DangerAction>
        </Panel>
        <Rules>
          <li>A section reads by default (a FactList); its Edit switches only that section into its form.</li>
          <li>Several switches in one section collect in a sticky Toolbar (unsaved changes) instead of saving each.</li>
          <li>
            A danger action states the consequence and has one danger button. Unavailable, it stays visible, disabled,
            with a note saying why.
          </li>
          <li>
            An irreversible action asks for the record's name in a ConfirmDialog, which carries the danger signal
            itself. What follows is a Toast with the audit id, never an Undo.
          </li>
        </Rules>
      </DocSection>

      <DocSection
        title="Create flow"
        lede="Choose the type, fill in the details, review, create. On its own page, or in a side Dialog when it is short."
      >
        <Panel title="Connect a source" heading={3}>
          <Steps label="Connect a source">
            <Step state="done" title="Type" />
            <Step state="current" title="Details" />
            <Step state="upcoming" title="Review" />
          </Steps>
        </Panel>
        <Rules>
          <li>
            The type is a ChoiceGroup of cards; the details a form; the review a FactList of what will be created.
          </li>
          <li>Enter moves on, Back keeps what was entered, Next stays disabled until the step is complete.</li>
          <li>After creating, land on the new record's detail page, with a toast.</li>
        </Rules>
      </DocSection>

      <DocSection
        title="Width and rhythm"
        lede="A page is as wide as what it holds. Space between blocks belongs to the page."
      >
        <Grid min="320px" gap={16}>
          <Rules>
            <li>list and detail: from 1280px the content leaves a side column of --di-rail-width (320px).</li>
            <li>full: an overview, the whole frame. form: one column of fields, 720px.</li>
            <li>Prose stays at 62 characters.</li>
          </Rules>
          <Rules>
            <li>
              Header to content 24, toolbar to its list 12, section to section 32, field to field 16. Page applies them.
            </li>
            <li>One h1 per page. No eyebrow repeated inside cards, empty states or dialogs.</li>
          </Rules>
        </Grid>
      </DocSection>

      <DocSection title="The frame" lede="A Sidebar, then in SidebarInset an AppShellBar and the AppShellContent.">
        <Rules>
          <li>
            The bar is one row at every width: the menu trigger, the page's name, and AppShellBarEnd, whose status folds
            into one “More” button on a phone. AppShellBarKeep stays: the notification bell, because its count is its
            point.
          </li>
          <li>
            Below the sidebar breakpoint the sidebar is a drawer from the inline start: focus is trapped, Escape and the
            scrim close it, and focus returns to the menu button.
          </li>
          <li>On a phone the gutter is 16px and nothing scrolls sideways but a table frame.</li>
        </Rules>
      </DocSection>
    </Doc>
  );
}

const meta = {
  title: "Foundations/Pages",
  tags: ["layer:foundation"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;

export const Pages: StoryObj = { render: () => <PagesPage /> };
