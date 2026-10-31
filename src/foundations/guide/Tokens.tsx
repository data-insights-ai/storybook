import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { CopyValue } from "../../index";

/** The values tokens resolve to where they are painted, so the dark theme and the compact density show their own. */
export function useResolved(tokens: string[]) {
  const ref = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const key = tokens.join(" ");
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const read = () => {
      const style = getComputedStyle(node);
      setValues(Object.fromEntries(key.split(" ").map((t) => [t, style.getPropertyValue(t).trim()])));
    };
    read();
    // The theme and the density are set on the root by a decorator, after the page has rendered.
    const watch = new MutationObserver(read);
    watch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-density"] });
    return () => watch.disconnect();
  }, [key]);
  return { ref, values };
}

export function TokenName({ token }: { token: string }) {
  return (
    <CopyValue className="di-token-name" value={token} copyLabel={`Copy ${token}`} copiedLabel={`${token} copied`} />
  );
}

export function Tiles({ children }: { children: ReactNode }) {
  return <div className="di-doc-tiles">{children}</div>;
}

/** A drawing of a token, what it is for in a few words, and its name to copy. */
export function Tile({ drawing, name, token }: { drawing: ReactNode; name: string; token: string }) {
  return (
    <div className="di-doc-tile" data-token={token}>
      {drawing}
      <p className="di-doc-tile-name">{name}</p>
      <TokenName token={token} />
    </div>
  );
}

/** Token names that run over more than one line or out of their tile. */
export function brokenTokenNames(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(".di-token-name .di-copy-value"))
    .filter((name) => {
      const tile = name.closest(".di-doc-tile, .di-doc-row") ?? name.parentElement!;
      const lines = new Set(Array.from(name.getClientRects(), (line) => Math.round(line.top))).size;
      return lines > 1 || name.getBoundingClientRect().right > tile.getBoundingClientRect().right + 1;
    })
    .map((name) => name.textContent);
}
