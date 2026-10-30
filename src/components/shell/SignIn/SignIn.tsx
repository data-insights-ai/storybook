import { Children, isValidElement, type FormEvent, type ReactNode } from "react";
import logoInverse from "../../../assets/logo-inverse.svg";
import { Eyebrow } from "../../text/Eyebrow";
import "./SignIn.css";

/**
 * Navy sheet, paper card, gold seal: the one brand moment of a product.
 * The seal stands before the eyebrow — this is the boundary of the
 * record, and it is sealed. One surface, no bands.
 *
 * The access boundary is stated in plain words under the button, never
 * in a tooltip. The sheet is the dark theme and the card the daylight one
 * in both themes: each sets its theme on itself, so everything inside the
 * card — a field, a notice, a panel, a table — resolves the daylight
 * roles without the card naming a colour.
 */
export function SignIn({
  kicker,
  eyebrow,
  title,
  lede,
  restriction,
  foot,
  onSubmit,
  children,
}: {
  /** The line above the card: who is asking. */
  kicker: string;
  /** The class of workspace, in the mono track. */
  eyebrow: string;
  title: string;
  lede: string;
  restriction: string;
  foot: string;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  /** The fields, and one `SignInVersion` beside the mark. */
  children: ReactNode;
}) {
  /*
   * `SignInVersion` sits in the kicker above the card, not in the form,
   * so it is picked out of `children` by type.
   */
  const version: ReactNode[] = [];
  const fields: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === SignInVersion) version.push(child);
    else fields.push(child);
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit?.(event);
  }

  return (
    <main className="di-login" data-theme="dark" data-brand="">
      <div className="di-login-stack">
        <p className="di-login-kicker">
          <img className="di-login-logo" src={logoInverse} alt="datAInsights" />
          {version}
        </p>

        <form className="di-login-card" data-theme="light" aria-label={title} onSubmit={handleSubmit}>
          <div className="di-login-body">
            <Eyebrow variant="sealed">{eyebrow}</Eyebrow>
            <h1 className="di-login-title">{title}</h1>
            <p className="di-login-lede">{lede}</p>
            <div className="di-login-form">{fields}</div>
            <p className="di-login-restrict">{restriction}</p>
          </div>
        </form>

        <p className="di-login-foot">
          <span>{kicker}</span>
          <span className="di-login-foot-sep" aria-hidden>
            ·
          </span>
          <span>{foot}</span>
        </p>
      </div>
    </main>
  );
}

/**
 * The build beside the mark. A slot rather than a string, because the
 * library already draws a version — `VersionTag` — and a bare string
 * could not put it in the mono track.
 */
export function SignInVersion({ children }: { children: ReactNode }) {
  return <span className="di-login-version">{children}</span>;
}
