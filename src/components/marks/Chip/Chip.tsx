import type { ReactNode } from "react";
import { Tag } from "../Tag";

/**
 * A filter, set or on offer.
 *
 * @deprecated Removed in 0.12: use `Tag mono`. A set filter is
 * `<Tag mono pressed onRemove removeLabel>`, an offered one
 * `<Tag mono onClick>`.
 */
export function Chip({
  children,
  active = false,
  onRemove,
  removeLabel,
  onClick,
  className,
}: {
  children: ReactNode;
  active?: boolean;
  onRemove?: () => void;
  removeLabel: string;
  onClick?: () => void;
  className?: string;
}) {
  if (active) {
    return (
      <Tag mono pressed onRemove={onRemove} removeLabel={removeLabel} className={className}>
        {children}
      </Tag>
    );
  }
  return (
    <Tag mono onClick={onClick} className={className}>
      {children}
    </Tag>
  );
}
