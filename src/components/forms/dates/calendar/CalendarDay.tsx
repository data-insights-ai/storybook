import { useEffect, useRef, type KeyboardEvent } from "react";
import type { DayButtonProps } from "react-day-picker";

// Home and End go to the month's first and last day; the day picker alone
// would stop at the week's ends.
function toMonthEnd(event: KeyboardEvent<HTMLButtonElement>) {
  const days = event.currentTarget.closest("table")?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)");
  if (!days?.length) return;
  event.preventDefault();
  event.stopPropagation();
  days[event.key === "Home" ? 0 : days.length - 1].focus();
}

/** One day of the grid: the range's ends and band as data attributes the calendar's CSS reads. */
export function CalendarDay({ day: _day, modifiers, onKeyDown, ...button }: DayButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);
  return (
    <button
      {...button}
      ref={ref}
      className="di-calendar-cell"
      data-selected={modifiers.selected || undefined}
      data-selection-start={modifiers.start || undefined}
      data-selection-end={modifiers.end || undefined}
      data-today={modifiers.today || undefined}
      data-disabled={modifiers.disabled || undefined}
      onKeyDown={(event) => {
        if (event.key === "Home" || event.key === "End") toMonthEnd(event);
        else onKeyDown?.(event);
      }}
    />
  );
}
