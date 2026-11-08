import { Fragment, type ReactElement } from "react";
import { TextLink } from "../../text/TextLink";

export type ResourceSegment = {
  label: string;
  /** Where the part is, while it exists; a deleted part is plain text. */
  href?: string;
};

/**
 * Where a record lives, as a line in prose: "Organization › Workspace ›
 * Report", each part linked while it exists. `renderLink` gives a part the
 * app's router link (the `render` of `TextLink`); without it a part is a
 * plain link. Unlike a `Breadcrumb` it is not the page's own place.
 */
export function ResourcePath({
  segments,
  renderLink,
}: {
  segments: readonly ResourceSegment[];
  renderLink?: (segment: ResourceSegment & { href: string }) => ReactElement;
}) {
  return (
    <span>
      {segments.map((segment, i) => (
        <Fragment key={`${i}:${segment.label}`}>
          {i > 0 ? <span aria-hidden> › </span> : null}
          {segment.href === undefined ? (
            segment.label
          ) : renderLink ? (
            <TextLink render={renderLink({ ...segment, href: segment.href })}>{segment.label}</TextLink>
          ) : (
            <TextLink href={segment.href}>{segment.label}</TextLink>
          )}
        </Fragment>
      ))}
    </span>
  );
}
