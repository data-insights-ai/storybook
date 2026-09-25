import { Children, isValidElement, type FormEvent, type ReactNode } from "react";
import logoInverse from "../assets/logo-inverse.svg";
import { SealMark, TickRule } from "./Seal";
import "./SignIn.css";

/**
 * Navy sheet, paper card, gold seal. The card carries the register's
 * index column, with the seal where the ordinal would sit: this is the
 * boundary of the record, and it is sealed.
 *
 * The access boundary is stated in plain words under the button, never
 * in a tooltip. The card pins the daylight colours in both themes,
 * because it sits on a navy ground either way.
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
    <main className="di-login">
      <div className="di-login-stack">
        <p className="di-login-kicker">
          <img className="di-login-logo" src={logoInverse} alt="datAInsights" />
          {version}
        </p>

        <form className="di-login-card" aria-label={title} onSubmit={handleSubmit}>
          <div className="di-login-index">
            <SealMark state="sealed" />
            <span className="di-login-index-rule" aria-hidden />
          </div>
          <div className="di-login-body">
            <p className="di-login-eyebrow">{eyebrow}</p>
            <h1 className="di-login-title">{title}</h1>
            <p className="di-login-lede">{lede}</p>
            <div className="di-login-form">{fields}</div>
            <TickRule />
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
