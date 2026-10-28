import { useState } from "react";
import { Building2, KeyRound, Network } from "lucide-react";
import { Console } from "../components/layout/shell/AppShell";
import { Breadcrumb } from "../components/navigation/Breadcrumb";
import { ChoiceCards } from "../components/forms/ChoiceCards";
import { CreateFlow } from "../components/overlays/CreateFlow";
import { Fact, FactList } from "../components/data/FactList";
import { PageHeader, PageHeaderCrumbs, PageHeaderTitle } from "../components/layout/Heading";
import { Page } from "../components/layout/Page";
import { TextField } from "../components/forms/TextField";
import { sampleChrome } from "../components/layout/shell/chrome.sample";

const kinds = [
  { value: "oidc", label: "OpenID Connect", description: "Any identity provider that speaks OIDC.", icon: <KeyRound /> },
  { value: "saml", label: "SAML 2.0", description: "A provider that signs SAML assertions.", icon: <Building2 /> },
  { value: "ldap", label: "LDAP", description: "A directory reached through a relay.", icon: <Network /> },
];
const steps = ["Choose a type", "Details", "Review"];
const ledes = ["", "How the platform reaches your identity provider.", "The connection is active once it is created."];

/** A create flow on its own page: choose the type, fill in the details, review, create. */
export function CreateFlowPageScreen() {
  const [step, setStep] = useState(0);
  const [kind, setKind] = useState("oidc");
  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const ready = step !== 1 || (name.trim() !== "" && issuer.trim() !== "");

  return (
    <Console title="New connection" crumb={["Sign-in", "New connection"]} active="settings" chrome={sampleChrome}>
      <Page width="detail">
        <PageHeader lede="People at your domains sign in through your identity provider.">
          <PageHeaderCrumbs>
            <Breadcrumb label="Breadcrumb" items={[{ label: "Sign-in", href: "#" }, { label: "New connection" }]} />
          </PageHeaderCrumbs>
          <PageHeaderTitle>New connection</PageHeaderTitle>
        </PageHeader>
        <CreateFlow
          label="Steps"
          steps={steps}
          step={step}
          lede={ledes[step]}
          width="page"
          stateLabels={{ done: "done", current: "current step", upcoming: "upcoming" }}
          backLabel="Back"
          nextLabel="Next"
          submitLabel="Create connection"
          cancelLabel="Cancel"
          canAdvance={ready}
          onBack={() => setStep((s) => s - 1)}
          onNext={() => setStep((s) => s + 1)}
          onSubmit={() => setStep(0)}
          onCancel={() => setStep(0)}
        >
          {step === 0 ? <ChoiceCards name="screen-kind" legend="Protocol" options={kinds} value={kind} onChange={setKind} /> : null}
          {step === 1 ? (
            <>
              <TextField id="screen-conn-name" label="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <TextField
                id="screen-conn-issuer"
                type="url"
                label="Issuer URL"
                placeholder="https://login.northwind.example"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
              />
            </>
          ) : null}
          {step === 2 ? (
            <FactList layout="columns">
              <Fact label="Protocol">{kinds.find((k) => k.value === kind)?.label}</Fact>
              <Fact label="Name">{name}</Fact>
              <Fact label="Issuer">{issuer}</Fact>
            </FactList>
          ) : null}
        </CreateFlow>
      </Page>
    </Console>
  );
}
