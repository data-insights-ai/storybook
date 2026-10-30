import type { ReactNode } from "react";
import { Fact, FactList } from "./FactList";

/** @deprecated Use `<Fact label={term}>{value}</Fact>` inside `FactList layout="pairs"`. Removed in 0.12. */
export function KeyValue({ term, value }: { term: string; value: string }) {
  return <Fact label={term}>{value}</Fact>;
}

/** @deprecated Use `FactList layout="pairs"`. Removed in 0.12. */
export function KeyValues({ children }: { children: ReactNode }) {
  return <FactList layout="pairs">{children}</FactList>;
}
