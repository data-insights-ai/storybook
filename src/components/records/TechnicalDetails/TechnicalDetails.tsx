import { useState } from "react";
import { CopyValue } from "../../actions/CopyValue";
import { Disclosure, DisclosureLead } from "../../layout/arrange/Disclosure";
import { Fact, FactList } from "../FactList";

export type TechnicalValue = { key: string; label: string; value: string };

/**
 * A record's raw identifiers, closed until asked for: each one to copy for
 * a support ticket or a search elsewhere. Empty values are left out.
 */
export function TechnicalDetails({
  id,
  title,
  toggleLabel,
  copyLabel,
  copiedLabel,
  values,
}: {
  id: string;
  title: string;
  toggleLabel: string;
  /** The copy button's name for one value: "Copy request id". */
  copyLabel: (label: string) => string;
  copiedLabel: string;
  values: readonly TechnicalValue[];
}) {
  const [open, setOpen] = useState(false);
  const shown = values.filter((v) => v.value !== "");
  if (shown.length === 0) return null;
  return (
    <Disclosure id={id} open={open} onOpenChange={setOpen} toggleLabel={toggleLabel}>
      <DisclosureLead>{title}</DisclosureLead>
      <FactList layout="columns">
        {shown.map((v) => (
          <Fact key={v.key} label={v.label}>
            <CopyValue value={v.value} mono copyLabel={copyLabel(v.label)} copiedLabel={copiedLabel} />
          </Fact>
        ))}
      </FactList>
    </Disclosure>
  );
}
