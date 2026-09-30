import * as React from 'react';
import * as S from "@ds-stories/src/components/Modal.stories";

function compose(S: any, key: string) {
  const meta: any = S.default ?? {};
  const st: any = S[key];
  const args: any = { ...(meta.args ?? {}), ...(st && st.args ? st.args : {}) };
  // Storybook resolves argTypes.mapping (control value -> real arg) before
  // rendering; mirror that so mapped args don't render raw.
  const at: any = { ...(meta.argTypes ?? {}), ...(st && st.argTypes ? st.argTypes : {}) };
  for (const k of Object.keys(args)) {
    const m = at[k] && at[k].mapping;
    if (m && typeof m === 'object' && args[k] in m) args[k] = m[args[k]];
  }
  const title: string = typeof meta.title === 'string' ? meta.title : '';
  const ctx: any = {
    args, name: key, title, kind: title, id: '', componentId: '',
    globals: {}, viewMode: 'story',
    parameters: (st && st.parameters) ?? meta.parameters ?? {},
  };
  let render: (() => any) | null = null;
  if (st && typeof st.render === 'function') render = () => st.render(args, ctx);
  else if (typeof st === 'function') render = () => st(args, ctx);
  else if (typeof meta.render === 'function') render = () => meta.render(args, ctx);
  else {
    const C = (st && st.component) || meta.component;
    if (C) render = () => React.createElement(C, args);
  }
  if (!render) return () => null;
  // [].concat: a single function is legal CSF decorator shorthand. A
  // decorator returning undefined (stubbed addon) falls through to the inner
  // render — otherwise one unrecognized addon blanks the cell silently.
  const decorators: any[] = ([] as any[]).concat((st && st.decorators) ?? []).concat(meta.decorators ?? []);
  return decorators.reduce((inner: any, dec: any) => () => {
    const out = dec(inner, ctx);
    return out === undefined ? inner() : out;
  }, render);
}

export const Closed = /* Closed */ compose(S, "Closed");
export const Transition = /* Transition */ compose(S, "Transition");

/*
 * Confirm, Plain and TypeToConfirm are in cfg.overrides.Modal.skip, so the
 * GENERATED wrapper omits them — and a skip drops a story from the design
 * system, not just from the compare oracle: no `?story=`, no section in
 * Modal.prompt.md. Re-exporting them here restores all three to the module and
 * to the usage reference while the skip still spares the oracle a capture it
 * cannot make (a top-layer <dialog> leaves the story root 0px tall on BOTH
 * sides). The card still renders primaryStory alone, which is correct: a
 * top-layer dialog would paint over sibling cells.
 *
 * Full reasoning, and the audit to run when skips change: .design-sync/NOTES.md.
 * Any story Modal gains has to be added here too.
 */
export const Confirm = /* Confirm */ compose(S, "Confirm");
export const Plain = /* Plain */ compose(S, "Plain");
export const TypeToConfirm = /* TypeToConfirm */ compose(S, "TypeToConfirm");
