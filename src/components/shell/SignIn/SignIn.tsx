import { Children, isValidElement, type FormEvent, type ReactNode } from "react";
import logo from "../../../assets/logo.svg";
import logoInverse from "../../../assets/logo-inverse.svg";
import { Eyebrow } from "../../text/Eyebrow";
import "./SignIn.css";

/**
 * The sign-in page: the ground, one card, the seal before the eyebrow. The
 * one brand moment of a product; the identity provider's hosted login
 * copies it (ground, primary, font), so the two read as one place.
 *
 * - **Use it** for the page that asks who someone is, before the app.
 * - **Not** inside the app frame; a session that expires there opens a
 *   `ConfirmDialog` or sends the person here.
 *
 * It follows the theme: in daylight the paper ground (`#F3F2EE`) with a
 * surface card and the navy button; after dark the navy ground
 * (`#0A1F44`) with a navy surface card and the paper-white button. The
 * text is IBM Plex Sans at 400, the title in the display face. The access
 * boundary is stated in plain words under the button, never in a tooltip.
 * Depth is a step in tone: no rules inside the card or under it.
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
    <main className="di-login" data-brand="">
      <div className="di-login-stack">
        <p className="di-login-kicker">
          <img className="di-login-logo di-login-logo-day" src={logo} alt="datAInsights" />
          <img className="di-login-logo di-login-logo-night" src={logoInverse} alt="datAInsights" />
          {version}
        </p>

        <form className="di-login-card" aria-label={title} onSubmit={handleSubmit}>
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
 * library already draws a version — `Tag mono` — and a bare string
 * could not put it in the mono track.
 */
export function SignInVersion({ children }: { children: ReactNode }) {
  return <span className="di-login-version">{children}</span>;
}
