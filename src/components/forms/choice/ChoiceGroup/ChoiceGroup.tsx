import { useId, type ReactNode } from "react";
import { cx } from "../../../../internal/cx";
import { Checkbox } from "../Checkbox";
import { Radio } from "../Radio";
import "../../field/Field/Field.css";
import "./ChoiceGroup.css";

export type ChoiceOption = {
  value: string;
  /** What the reader sees, such as "Mo" or "Azure Event Hub". */
  label: string;
  /** Read by a screen reader instead of a short label, such as "Monday" for "Mo". */
  name?: string;
  /** One line under the label in a list or on a card; a card cuts it after two lines. */
  description?: string;
  /** The rest of it, shown on hover and read by assistive technology. */
  more?: string;
  /** One Lucide icon, drawn on a card. */
  icon?: ReactNode;
  /** Cards with the same group are shown together under it. */
  group?: string;
  disabled?: boolean;
};

/** Kinds the product is built for but cannot offer yet, shown after the cards. */
export type ChoicePlanned = {
  /** Names the set, such as "Coming later". */
  label: string;
  /** One line beside the label. */
  lede?: string;
  options: Pick<ChoiceOption, "value" | "label" | "icon">[];
};

export type ChoiceAppearance = "list" | "segments" | "toggles" | "cards";

type Frame = {
  /** Names the choice, above the options in the field label style. */
  legend: string;
  /** Keeps the legend for assistive technology only, where a heading or the place already names the choice. */
  hideLegend?: boolean;
  /** Locks every option. */
  disabled?: boolean;
  className?: string;
};

type One = {
  multiple?: false;
  value: string;
  onChange: (value: string) => void;
};

type Several = {
  multiple: true;
  /** The chosen values; `onChange` hands them back in the order of `options`. */
  value: readonly string[];
  onChange: (value: string[]) => void;
};

type WithOptions = Frame & {
  /** Shared by the inputs, so the browser treats them as one choice. */
  name: string;
  options: readonly ChoiceOption[];
  appearance?: ChoiceAppearance;
  /** Cards only: kinds that cannot be chosen yet, after the cards and the detail. */
  planned?: ChoicePlanned;
  /** After the options, before `planned`: what follows from the choice, such as a guide to set it up. */
  children?: ReactNode;
} & (One | Several);

type Composed = Frame & {
  options?: undefined;
  /** `Checkbox` or `Radio` controls the caller lays out. */
  children: ReactNode;
};

export type ChoiceGroupProps = WithOptions | Composed;

/**
 * One choice among options, or several of them, under one legend.
 *
 * **When to use:** a short, fixed set the reader sees all at once: a
 * retention period (`list`), a view or a range in a toolbar (`segments`,
 * two to four, commits at once), the days of a week (`toggles multiple`),
 * the kind to start a create flow from (`cards`).
 * **When not to:** more than about seven options or options from data → `Select`
 * or `ComboBox`; several from a long set → `MultiComboBox`; one setting that
 * applies at once → `Switch`; one yes/no in a form → `Checkbox`; places to
 * go → `Tabs` or `TabNav`.
 *
 * **Anatomy:** legend (visible, field label style), the options, then
 * `children` (the detail that follows from the choice), then `planned`.
 *
 * **Variants:** `appearance` `list` (radio or checkbox rows with a
 * description), `segments` (one track the height of a field, the chosen
 * one a solid thumb: pick one), `toggles` (a row of separate, equal cells
 * in the field frame, each chosen one filled: for several of a short set,
 * such as days; `segments` with `multiple` is drawn as toggles), `cards`
 * (icon, label, one-line description, optional `group` headings and
 * `planned` kinds). `multiple` turns radios into checkboxes in the same
 * markup. Chosen is cornflower everywhere: a filled thumb or cell for a
 * segment or toggle (too small for a tint to read), the selection tint and a
 * cornflower edge for a card.
 *
 * **States:** a disabled option, a disabled group (`disabled` on the
 * fieldset); a chosen option keeps its edge while disabled.
 *
 * **Content:** labels in sentence case, one to three words; a segment's label
 * a word or a unit ("24h"); a card's description one line.
 *
 * **Accessibility:** a `fieldset` named by its `legend`. Single choice is a
 * native radio group: one tab stop, arrow keys move and choose. `multiple`
 * is a run of checkboxes, each its own tab stop, Space toggles. An option's
 * `name` is its accessible name when the label is short; `more` is its
 * description.
 */
export function ChoiceGroup(props: ChoiceGroupProps) {
  const { legend, hideLegend = false, disabled = false, className, children } = props;
  const appearance = props.options === undefined ? undefined : shown(props);
  return (
    <fieldset
      className={cx("di-choice-group", appearance && `di-choice-group-${appearance}`, className)}
      disabled={disabled}
    >
      <legend className={cx("di-field-label", "di-field-label-record", "di-choice-legend", hideLegend && "di-sr")}>
        {legend}
      </legend>
      {props.options === undefined ? children : <Options {...props} />}
    </fieldset>
  );
}

/* Segments are one thumb on one track, a pick-one idiom; several chosen at once are toggles. */
const shown = (props: WithOptions): ChoiceAppearance => {
  const appearance = props.appearance ?? "list";
  return appearance === "segments" && props.multiple ? "toggles" : appearance;
};

function Options(props: WithOptions) {
  const { name, options, planned, disabled = false, children } = props;
  const appearance = shown(props);
  const chosen = (value: string) => (props.multiple ? props.value.includes(value) : props.value === value);
  const pick = (value: string) => {
    if (!props.multiple) return props.onChange(value);
    const next = props.value.includes(value) ? props.value.filter((v) => v !== value) : [...props.value, value];
    props.onChange(options.map((o) => o.value).filter((v) => next.includes(v)));
  };
  const type = props.multiple ? "checkbox" : "radio";

  if (appearance === "list") {
    const Control = props.multiple ? Checkbox : Radio;
    return (
      <div className="di-choice-list">
        {options.map((o) => (
          <Control
            key={o.value}
            id={`${name}-${o.value}`}
            name={name}
            value={o.value}
            label={o.label}
            description={o.description ?? ""}
            title={o.more}
            checked={chosen(o.value)}
            disabled={disabled || o.disabled}
            onChange={() => pick(o.value)}
          />
        ))}
        {children}
      </div>
    );
  }

  const input = (o: ChoiceOption) => (
    // eslint-disable-next-line jsx-a11y/role-supports-aria-props -- aria-description is global in ARIA 1.3, newer than the rule's role table
    <input
      type={type}
      className="di-sr"
      name={name}
      value={o.value}
      checked={chosen(o.value)}
      disabled={o.disabled}
      aria-label={o.name}
      aria-description={o.more}
      onChange={() => pick(o.value)}
    />
  );

  if (appearance === "toggles") {
    return (
      <>
        <div className="di-choice-toggles">
          {options.map((o) => (
            <label key={o.value} className={cx("di-choice-toggle", chosen(o.value) && "is-chosen")} title={o.more}>
              {input(o)}
              <span>{o.label}</span>
            </label>
          ))}
        </div>
        {children}
      </>
    );
  }

  if (appearance === "segments") {
    return (
      <>
        <div className="di-choice-segments">
          {options.map((o) => (
            <label key={o.value} className={cx("di-choice-segment", chosen(o.value) && "is-chosen")} title={o.more}>
              {input(o)}
              <span>{o.label}</span>
            </label>
          ))}
        </div>
        {children}
      </>
    );
  }

  const groups = [...new Set(options.map((o) => o.group ?? ""))];
  return (
    <>
      {groups.map((group) => (
        <div key={group} className="di-choice-cards-group">
          {group ? <p className="di-choice-cards-group-label">{group}</p> : null}
          <div className="di-choice-cards">
            {options
              .filter((o) => (o.group ?? "") === group)
              .map((o) => (
                <label key={o.value} className={cx("di-choice-card", chosen(o.value) && "is-chosen")} title={o.more}>
                  {input(o)}
                  {o.icon === undefined ? null : (
                    <span className="di-choice-card-icon" aria-hidden>
                      {o.icon}
                    </span>
                  )}
                  <span className="di-choice-card-text">
                    <span className="di-choice-card-label">{o.label}</span>
                    {o.description === undefined ? null : <span className="di-choice-card-desc">{o.description}</span>}
                  </span>
                </label>
              ))}
          </div>
        </div>
      ))}
      {children ? <div className="di-choice-detail">{children}</div> : null}
      {planned && planned.options.length > 0 ? <Planned planned={planned} /> : null}
    </>
  );
}

function Planned({ planned }: { planned: ChoicePlanned }) {
  const id = useId();
  return (
    <div className="di-choice-planned">
      <p className="di-choice-planned-head">
        <span id={id} className="di-choice-planned-label">
          {planned.label}
        </span>
        {planned.lede ? <span className="di-choice-planned-lede">{planned.lede}</span> : null}
      </p>
      <ul role="list" className="di-choice-planned-list" aria-labelledby={id}>
        {planned.options.map((o) => (
          <li key={o.value} className="di-choice-planned-item">
            {o.icon === undefined ? null : (
              <span className="di-choice-planned-icon" aria-hidden>
                {o.icon}
              </span>
            )}
            {o.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
