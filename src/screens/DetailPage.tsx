import { useState } from "react";
import {
  Breadcrumb,
  Button,
  ConfirmDialog,
  Console,
  CopyValue,
  DangerAction,
  DangerZone,
  DetailSection,
  DetailSectionForm,
  Fact,
  FactList,
  Page,
  PageHeader,
  PageHeaderAside,
  PageHeaderCrumbs,
  PageHeaderFacts,
  PageHeaderStatus,
  PageHeaderTitle,
  SaveBar,
  StatusPill,
  Switch,
  TextField,
} from "../index";
import { sampleChrome } from "../components/shell/chrome.sample";

/** A detail page: summary header, sections that read until Edit, the danger zone last. */
export function DetailPageScreen() {
  const [name, setName] = useState("Northwind Survey");
  const [draft, setDraft] = useState(name);
  const [editing, setEditing] = useState(false);
  const [mfa, setMfa] = useState(true);
  const [sessions, setSessions] = useState(false);
  const [saved, setSaved] = useState({ mfa: true, sessions: false });
  const [confirm, setConfirm] = useState(false);
  const dirty = mfa !== saved.mfa || sessions !== saved.sessions;

  return (
    <Console title={name} crumb={["Organization", "Overview"]} active="overview" chrome={sampleChrome}>
      <Page width="detail">
        <PageHeader lede="Your organization, its members and the products it uses.">
          <PageHeaderCrumbs>
            <Breadcrumb label="Breadcrumb" items={[{ label: "Organizations", href: "#" }, { label: name }]} />
          </PageHeaderCrumbs>
          <PageHeaderTitle>{name}</PageHeaderTitle>
          <PageHeaderStatus>
            <StatusPill tone="neutral" dot={false}>
              Customer
            </StatusPill>
            <StatusPill tone="ok">Subscription active</StatusPill>
          </PageHeaderStatus>
          <PageHeaderFacts>
            <FactList layout="inline">
              <Fact label="Your role">Owner</Fact>
              <Fact label="Members">14</Fact>
              <Fact label="Seats">12 of 25</Fact>
            </FactList>
          </PageHeaderFacts>
          <PageHeaderAside>
            <Button>Open product</Button>
          </PageHeaderAside>
        </PageHeader>

        <DetailSection
          title="General"
          editLabel="Edit"
          editing={editing}
          onEdit={() => (setDraft(name), setEditing(true))}
        >
          <FactList layout="columns">
            <Fact label="Name">{name}</Fact>
            <Fact label="Created">3 Mar 2026</Fact>
            <Fact label="Organization ID">
              <CopyValue value="6f1c2a9e-4b7d-4e0a-9c55-2f3d8a71b0c4" copyLabel="Copy organization ID" copiedLabel="Copied" />
            </Fact>
          </FactList>
          <DetailSectionForm
            saveLabel="Save"
            cancelLabel="Cancel"
            onCancel={() => setEditing(false)}
            onSubmit={() => (setName(draft.trim() || name), setEditing(false))}
          >
            <TextField id="screen-org-name" label="Name" value={draft} maxLength={120} onChange={(e) => setDraft(e.target.value)} />
          </DetailSectionForm>
        </DetailSection>

        <DetailSection title="Security" lede="Rules for everyone who signs in to this organization.">
          <Switch id="screen-mfa" layout="row" title="Require multi-factor sign-in" on={mfa} onToggle={setMfa} />
          <Switch id="screen-sessions" layout="row" title="End sessions after 12 hours" on={sessions} onToggle={setSessions} />
          {dirty ? (
            <SaveBar label="Unsaved changes" message="Security rules changed">
              <Button variant="secondary" onClick={() => (setMfa(saved.mfa), setSessions(saved.sessions))}>
                Discard
              </Button>
              <Button onClick={() => setSaved({ mfa, sessions })}>Save changes</Button>
            </SaveBar>
          ) : null}
        </DetailSection>

        <DangerZone title="Danger zone" lede="These actions remove access and cannot be undone.">
          <DangerAction
            title="Leave organization"
            body="You lose access to this organization and its products at once."
            note="You are the only owner. Make another member an owner before you leave."
          >
            <Button variant="danger" disabled>
              Leave
            </Button>
          </DangerAction>
          <DangerAction
            title="Delete organization"
            body="Members, invitations, sign-in connections and seats are deleted for everyone."
          >
            <Button variant="danger" onClick={() => setConfirm(true)}>
              Delete organization
            </Button>
          </DangerAction>
        </DangerZone>
      </Page>
      <ConfirmDialog
        open={confirm}
        title={`Delete ${name}?`}
        body="The organization is deleted for everyone. This cannot be undone."
        consequences={["14 members lose access", "Sign-in connections stop working", "The subscription ends"]}
        confirmText={name}
        confirmTextLabel={`Type ${name} to confirm`}
        confirmLabel="Delete organization"
        cancelLabel="Cancel"
        onConfirm={() => setConfirm(false)}
        onClose={() => setConfirm(false)}
      />
    </Console>
  );
}
