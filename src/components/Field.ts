/**
 * Which track a field's label runs in.
 *
 * `record` is the console default: mono micro-caps, the way a register
 * labels a column. `prose` is the body step in ink, for a form a person
 * fills in for themselves — an account, a sign-up — where the label is a
 * sentence they read rather than the name of a column.
 *
 * One prop, because family, weight, case and size all move together. A
 * 13px label that is still uppercase and still letterspaced is not a
 * heavier console label, it is a broken one.
 */
export type LabelTrack = "record" | "prose";
