import { useState } from "react";
import { Building2, KeyRound, Network } from "lucide-react";
import {
  ChoiceGroup,
  CopyValue,
  CreateFlow,
  Fact,
  FactList,
  Page,
  PageHeader,
  PageHeaderTitle,
  TextField,
} from "../..";

const kinds = [
  {
    value: "oidc",
    label: "OpenID Connect",
    description: "Any identity provider that speaks OIDC.",
    icon: <KeyRound />,
  },
  { value: "saml", label: "SAML 2.0", description: "A provider that signs SAML assertions.", icon: <Building2 /> },
  { value: "ldap", label: "LDAP", description: "A directory reached through a relay.", icon: <Network /> },
];
const steps = ["Choose a type", "Details", "Review"];
const ledes = ["", "How the platform reaches your identity provider.", "The connection is active once it is created."];

/**
 * A create flow on its own page: choose the type, fill in the details,
 * review, create. The steps say where the reader is; Next waits until the
 * step is complete; a failure to create is said above the buttons, and
 * what was typed stays.
 */
export function CreateFlowPageScreen({
  step: startStep = 0,
  filled = false,
  failed = false,
}: {
  step?: number;
  filled?: boolean;
  failed?: boolean;
}) {
  const [step, setStep] = useState(startStep);
  const [kind, setKind] = useState("oidc");
  const [name, setName] = useState(filled ? "Northwind staff" : "");
  const [issuer, setIssuer] = useState(filled ? "https://login.northwind.example" : "");
  const [error, setError] = useState(
    failed ? "The identity provider did not answer at its issuer URL. Nothing was created." : "",
  );
  const ready = step !== 1 || (name.trim() !== "" && issuer.trim() !== "");

  return (
    <Page width="detail">
      <PageHeader lede="People at your domains sign in through your identity provider.">
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
        error={error}
        onBack={() => (setError(""), setStep((s) => s - 1))}
        onNext={() => setStep((s) => s + 1)}
        onSubmit={() => setStep(0)}
        onCancel={() => setStep(0)}
      >
        {step === 0 ? (
          <ChoiceGroup
            appearance="cards"
            name="screen-kind"
            legend="Protocol"
            options={kinds}
            value={kind}
            onChange={setKind}
          />
        ) : null}
        {step === 1 ? (
          <>
            <TextField
              id="screen-conn-name"
              label="Name"
              hint="Members see it on the sign-in page."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
            <Fact label="Issuer">
              <CopyValue value={issuer} copyLabel="Copy issuer URL" copiedLabel="Copied" />
            </Fact>
          </FactList>
        ) : null}
      </CreateFlow>
    </Page>
  );
}
