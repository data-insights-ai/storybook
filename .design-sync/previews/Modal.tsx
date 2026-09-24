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
 * Confirm is skipped in cfg.overrides.Modal.skip, so the generated wrapper no
 * longer exports it — and without it the card falls back to the `Closed` story,
 * i.e. a lone 32px "Revoke sources" button instead of the modal itself.
 *
 * The skip exists for the COMPARE ORACLE, not because the story is broken.
 * `Modal` is a native <dialog> opened with showModal(), so its content is in the
 * browser's top layer. The harness screenshots the story ROOT element, and a
 * top-layer dialog leaves that root 0px tall — measured: the dialog renders at
 * 296.6px with all its copy while the root reports height 0. That happens
 * identically in storybook and in the preview, so neither side can be
 * photographed and compare reports sb-error on both. It is a capture
 * limitation, not a fidelity defect.
 *
 * Re-exporting it here keeps the real confirm modal on the card. The card is
 * verified by package-validate.mjs's render check instead, which reads geometry
 * and text rather than a root screenshot, and sees the full 297px modal.
 * compare logs it as an "extra cell not matching any story" — expected, and
 * logged only, never a failure.
 */
export const Confirm = /* Confirm */ compose(S, "Confirm");
