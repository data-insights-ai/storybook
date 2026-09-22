import { useId, type FormEvent, type ReactNode } from "react";
import { Shield } from "lucide-react";
import markInverse from "../assets/mark-inverse.svg";
import "./SignIn.css";

export function SignIn({
  kicker,
  version,
  badge,
  eyebrow,
  title,
  lede,
  restriction,
  foot,
  onSubmit,
  children,
}: {
  kicker: string;
  version: string;
  badge: string;
  eyebrow: string;
  title: string;
  lede: string;
  restriction: string;
  foot: string;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}) {
  const sky = useId().replace(/:/g, "");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit?.(event);
  }

  return (
    <main className="di-login">
      <svg className="di-login-art" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <linearGradient id={`${sky}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#071428" />
            <stop offset="42%" stopColor="#1a4568" />
            <stop offset="58%" stopColor="#d9b86b" />
            <stop offset="70%" stopColor="#1d4260" />
            <stop offset="100%" stopColor="#071a12" />
          </linearGradient>
        </defs>
        <rect width="1200" height="800" fill={`url(#${sky}-sky)`} />
        <ellipse cx="600" cy="820" rx="980" ry="250" fill="#0c2418" />
        <ellipse cx="160" cy="760" rx="300" ry="110" fill="#123224" />
        <ellipse cx="1040" cy="780" rx="340" ry="120" fill="#0e2c1c" />
        <g transform="translate(86 78)" fill="#c9a24a" stroke="rgba(217,184,107,0.5)" strokeWidth="1">
          <line x1="4" y1="36" x2="58" y2="6" />
          <line x1="58" y1="6" x2="108" y2="48" />
          <circle cx="4" cy="36" r="3" stroke="none" />
          <circle cx="58" cy="6" r="3.4" stroke="none" />
          <circle cx="108" cy="48" r="2.4" stroke="none" opacity="0.7" />
        </g>
      </svg>

      <div className="di-login-stack">
        <p className="di-login-kicker">
          <span>
            <span className="di-operator-dot" aria-hidden />
            {kicker}
          </span>
          <span className="di-chip-lite">{version}</span>
        </p>

        <form className="di-login-card" aria-label={title} onSubmit={handleSubmit}>
          <div className="di-login-brand">
            <span className="di-login-mark">
              <img src={markInverse} alt="" />
            </span>
            <span className="di-chip-lite">{badge}</span>
          </div>
          <p className="di-login-kicker-soft">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="di-lede">{lede}</p>
          <div className="di-login-form">{children}</div>
          <p className="di-login-restrict">
            <Shield aria-hidden width={14} height={14} />
            {restriction}
          </p>
        </form>

        <p className="di-login-foot">{foot}</p>
      </div>
    </main>
  );
}
