import { useState } from "react";
import {
  Button,
  ConfirmDialog,
  CopyValue,
  DangerAction,
  DetailSection,
  DetailSectionForm,
  Fact,
  FactList,
  Page,
  PageHeader,
  PageHeaderMeta,
  PageHeaderStatus,
  PageHeaderTitle,
  Panel,
  PanelLead,
  StatusPill,
  Switch,
  TextField,
  Toolbar,
  ToolbarEnd,
  ToolbarStatus,
} from "../..";

/**
 * A record's detail page, here an organization's settings: the header
 * names the record and its state, each section reads until its Edit, a
 * changed rule offers Save at the foot of the window, and the irreversible
 * actions come last, each with its consequence and, when blocked, the
 * reason beside it.
 */
export function DetailPageScreen({
  editing: startEditing = false,
  changed = false,
  confirming = false,
}: {
  editing?: boolean;
  changed?: boolean;
  confirming?: boolean;
}) {
  const [name, setName] = useState("Northwind Survey");
  const [draft, setDraft] = useState(name);
  const [editing, setEditing] = useState(startEditing);
  const [saved, setSaved] = useState({ mfa: true, sessions: false });
  const [mfa, setMfa] = useState(true);
  const [sessions, setSessions] = useState(changed);
  const [confirm, setConfirm] = useState(confirming);
  const dirty = mfa !== saved.mfa || sessions !== saved.sessions;

  return (
    <>
      <Page width="detail">
        <PageHeader lede="Your organization, who belongs to it and the rules they sign in under.">
          <PageHeaderTitle>{name}</PageHeaderTitle>
          <PageHeaderStatus>
            <StatusPill tone="ok">Subscription active</StatusPill>
          </PageHeaderStatus>
          <PageHeaderMeta>You are the owner · 14 members · 12 of 25 seats used</PageHeaderMeta>
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
              <CopyValue
                value="6f1c2a9e-4b7d-4e0a-9c55-2f3d8a71b0c4"
                copyLabel="Copy organization ID"
                copiedLabel="Copied"
              />
            </Fact>
          </FactList>
          <DetailSectionForm
            saveLabel="Save"
            cancelLabel="Cancel"
            onCancel={() => setEditing(false)}
            onSubmit={() => (setName(draft.trim() || name), setEditing(false))}
          >
            <TextField
              id="screen-org-name"
              label="Name"
              hint="Members see this name when they sign in."
              value={draft}
              maxLength={120}
              onChange={(e) => setDraft(e.target.value)}
            />
          </DetailSectionForm>
        </DetailSection>

        <DetailSection title="Security" lede="Rules for everyone who signs in to this organization.">
          <Switch id="screen-mfa" layout="row" title="Require multi-factor sign-in" on={mfa} onToggle={setMfa} />
          <Switch
            id="screen-sessions"
            layout="row"
            title="End sessions after 12 hours"
            description="Members sign in again each working day."
            on={sessions}
            onToggle={setSessions}
          />
        </DetailSection>

        <Panel tone="danger" heading={2} title="Danger zone">
          <PanelLead>These actions remove access and cannot be undone.</PanelLead>
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
        </Panel>

        {dirty ? (
          <Toolbar label="Unsaved changes" role="region" frame="bar" sticky="bottom">
            <ToolbarStatus>The security rules changed and are not saved yet.</ToolbarStatus>
            <ToolbarEnd>
              <Button variant="secondary" onClick={() => (setMfa(saved.mfa), setSessions(saved.sessions))}>
                Discard
              </Button>
              <Button onClick={() => setSaved({ mfa, sessions })}>Save changes</Button>
            </ToolbarEnd>
          </Toolbar>
        ) : null}
      </Page>
      <ConfirmDialog
        open={confirm}
        tone="danger"
        eyebrow="Organization · cannot be undone"
        title={`Delete ${name}?`}
        body="The organization is deleted for everyone, at once."
        consequences={["14 members lose access", "Sign-in connections stop working", "The subscription ends today"]}
        confirmText={name}
        confirmTextLabel={`Type ${name} to confirm`}
        confirmLabel="Delete organization"
        cancelLabel="Cancel"
        onConfirm={() => setConfirm(false)}
        onClose={() => setConfirm(false)}
      />
    </>
  );
}
