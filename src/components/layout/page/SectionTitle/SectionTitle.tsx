import type { ReactNode } from "react";
import { PageHeader, PageHeaderMeta, PageHeaderTitle } from "../PageHeader";

/**
 * The heading over one section.
 *
 * @deprecated Removed in 0.12.0. Use `<PageHeader level={2}>`: the same
 * `eyebrow`, `lede` and `tier`; `SectionTitleHeading` is `PageHeaderTitle`
 * and `SectionTitleMeta` is `PageHeaderMeta`, which takes nodes too.
 */
export function SectionTitle({
  eyebrow = "",
  lede,
  tier = "console",
  children,
}: {
  eyebrow?: string;
  lede?: string;
  tier?: "console" | "brand";
  children: ReactNode;
}) {
  return (
    <PageHeader level={2} eyebrow={eyebrow || undefined} lede={lede} tier={tier}>
      {children}
    </PageHeader>
  );
}

/** @deprecated Removed in 0.12.0. Use `PageHeaderTitle` in a `PageHeader level={2}`. */
export const SectionTitleHeading: ({ children }: { children: ReactNode }) => ReactNode = PageHeaderTitle;

/** @deprecated Removed in 0.12.0. Use `PageHeaderMeta` in a `PageHeader level={2}`. */
export const SectionTitleMeta: ({ children }: { children: ReactNode }) => ReactNode = PageHeaderMeta;
