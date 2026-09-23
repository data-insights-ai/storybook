import { Panel } from "../../components/Panel";
import { SealMark } from "../../components/Seal";
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
      <Panel index="01" title="Source" meta="sealed 09:12Z">
        An ordinal: the row's handle, and what an operator says out loud.
      </Panel>
      <Panel index="§" title="Coverage" meta="§ 04">
        A section mark, the same one the marketing site uses.
      </Panel>
      <Panel index="!!" indexTone="danger" title="Ingest run" meta="failed 08:44Z">
        A failure keeps its column, tinted. It is still a record.
      </Panel>
    </div>
  );
}
