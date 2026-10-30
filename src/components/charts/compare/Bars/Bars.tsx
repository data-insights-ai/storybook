import { Sparkline } from "../../../data/figures/Sparkline";

/**
 * A row of small bars with three captions.
 *
 * @deprecated Removed in 0.12.0. Use `Sparkline` with `width="fill"`,
 * `height="md"` and `captions={[start, mid, end]}`; `values` and
 * `highlight` stay, and `label` says the shape in words.
 */
export function Bars({
  values,
  highlight,
  startLabel,
  midLabel,
  endLabel,
}: {
  values: number[];
  highlight: number;
  startLabel: string;
  midLabel: string;
  endLabel: string;
}) {
  return (
    <Sparkline
      values={values}
      highlight={highlight}
      label={`${startLabel} to ${endLabel}`}
      width="fill"
      height="md"
      captions={[startLabel, midLabel, endLabel]}
    />
  );
}
