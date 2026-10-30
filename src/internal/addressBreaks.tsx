import { Children, Fragment, type ReactNode } from "react";

/*
 * Where a long address may wrap, after the Chicago Manual of Style: after
 * "//" and a colon, before a single slash, a dot, a hyphen, "@" and the
 * other separators, before and after "&" and "=". A line then starts on a
 * separator, so it never reads as a hyphenated word, and no word is split.
 */
const boundary = /(:\/\/|:)|(?=[/.\-_?#%~&=@])|(?<=[&=])/;

/* A run this long has no boundaries worth keeping (a hash, a key): it may break anywhere rather than overflow. */
const UNBROKEN = 24;
const kept = { whiteSpace: "nowrap" } as const;

/**
 * The string with a break opportunity at each boundary of an address, an
 * id or a path, and none elsewhere: each part between boundaries is kept
 * whole, because a browser would otherwise also break after a hyphen.
 */
export function addressBreaks(value: string): ReactNode {
  const parts: string[] = [];
  for (const part of value.split(boundary)) {
    if (part === undefined || part === "") continue;
    if ((part === "://" || part === ":") && parts.length > 0) parts[parts.length - 1] += part;
    else parts.push(part);
  }
  return parts.map((part, i) => (
    <Fragment key={i}>
      {i > 0 ? <wbr /> : null}
      <span style={part.length < UNBROKEN ? kept : undefined}>{part}</span>
    </Fragment>
  ));
}

/**
 * Each string child of a value, broken at address boundaries, in a span of
 * its own: in a flex row each part would otherwise be an item. Icons and
 * other nodes pass through.
 */
export function withAddressBreaks(children: ReactNode): ReactNode {
  return Children.map(children, (child) => (typeof child === "string" ? <span>{addressBreaks(child)}</span> : child));
}
