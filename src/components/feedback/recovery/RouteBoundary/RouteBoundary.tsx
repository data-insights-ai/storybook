import { Component, type ReactNode } from "react";

/**
 * Keeps the shell usable when a page fails while it renders: a tab opened
 * before an update asking for a route chunk that is gone, or data the page
 * did not expect. Shows `fallback` instead of a blank page; a new
 * `resetKey` (the location) tries the page again.
 */
export class RouteBoundary extends Component<
  { resetKey?: string; fallback: ReactNode; onError?: (error: unknown) => void; children: ReactNode },
  { failedAt?: string; failed: boolean }
> {
  state: { failedAt?: string; failed: boolean } = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  static getDerivedStateFromProps(
    props: { resetKey?: string },
    state: { failedAt?: string; failed: boolean },
  ): { failedAt?: string; failed: boolean } | null {
    if (!state.failed) return { failedAt: props.resetKey, failed: false };
    if (state.failedAt !== props.resetKey) return { failedAt: props.resetKey, failed: false };
    return null;
  }

  componentDidCatch(error: unknown) {
    this.props.onError?.(error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
