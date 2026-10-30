import { Step, Steps } from "../../components/navigation/sequence/Steps";
import { Panel } from "../../components/layout/page/Panel";
import { SealMark } from "../../components/marks/status/SealValue";
import "./RegisterSpecimens.css";

const seals = [
  {
    state: "sealed" as const,
    name: "Sealed",
    value: "a4f9c21e",
    note: "Recorded, hashed, and verifiable offline.",
  },
  {
    state: "inferred" as const,
    name: "Inferred",
    value: "7f3a99e0",
    note: "A model read it out of three sources. Nothing has vouched for it.",
  },
  {
    state: "absent" as const,
    name: "Absent",
    value: "none",
    note: "Nothing on record. Said out loud, not left blank.",
  },
];

export function SealSpecimen() {
  return (
    <div className="di-seal-specimen">
      {seals.map((seal) => (
        <div key={seal.state} className="di-seal-specimen-item">
          <SealMark state={seal.state} size={22} />
          <div>
            <p className="di-seal-specimen-name">{seal.name}</p>
            <p className="di-seal-specimen-value">{seal.value}</p>
            <p className="di-seal-specimen-note">{seal.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function IndexSpecimen() {
  return (
    <div className="di-index-specimen">
      <Panel title="Rotate the collector key">
        <Steps variant="list" tone="ruled" label="Rotate the collector key">
          <Step title="Issue the new key on the collector." />
          <Step title="Seal the first batch signed with it." />
          <Step title="Revoke the old key." />
        </Steps>
      </Panel>
    </div>
  );
}
