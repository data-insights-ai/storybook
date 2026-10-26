import { Maximize2, Undo2, ZoomIn, ZoomOut, type LucideIcon } from "lucide-react";
import { Button } from "../../actions/Button";
import { Toolbar } from "../../layout/Layout";
import { covers, MIN_SPAN, widthOf, zoomAround } from "../scale/viewport";
import type { TimelineNavigation } from "./useTimelineView";

export type ControlLabels = { zoomIn: string; zoomOut: string; back: string; whole: string };

export function Controls({
  navigation,
  labels,
}: {
  navigation: TimelineNavigation;
  labels: ControlLabels;
}) {
  const { view, bounds, change, back, canGoBack } = navigation;
  const centre = (view.start + view.end) / 2;
  const whole = covers(view, bounds);
  const controls: { label: string; icon: LucideIcon; disabled: boolean; act: () => void }[] = [
    {
      label: labels.zoomIn,
      icon: ZoomIn,
      disabled: widthOf(view) <= MIN_SPAN,
      act: () => change(zoomAround(view, centre, 0.5, bounds), true),
    },
    {
      label: labels.zoomOut,
      icon: ZoomOut,
      disabled: whole,
      act: () => change(zoomAround(view, centre, 2, bounds), true),
    },
    { label: labels.back, icon: Undo2, disabled: !canGoBack, act: back },
    { label: labels.whole, icon: Maximize2, disabled: whole, act: () => change(bounds, true) },
  ];
  return (
    <Toolbar>
      {controls.map(({ label, icon: Icon, disabled, act }) => (
        <Button
          key={label}
          variant="ghost"
          size="dense"
          iconOnly
          aria-label={label}
          title={label}
          disabled={disabled}
          onClick={act}
        >
          <Icon aria-hidden />
        </Button>
      ))}
    </Toolbar>
  );
}
