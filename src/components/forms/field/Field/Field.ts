/**
 * Which track a field's label runs in.
 *
 * `record` is the console default: the interface label style
 * (`--di-label-*`), sentence case at the label step in muted ink.
 * `prose` is the body step in ink, for a form a person fills in for
 * themselves — an account, a sign-up — where the label is a sentence they
 * read rather than the name of a column.
 *
 * One prop, because family, weight and size move together.
 */
export type LabelTrack = "record" | "prose";
