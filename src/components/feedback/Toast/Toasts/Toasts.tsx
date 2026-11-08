import { Button } from "../../../actions/Button";
import { Toast, ToastAction, ToastRegion } from "../Toast";
import { dismissToast, holdToast, useCurrentToast } from "./toastStore";

/**
 * The receipts `toast()` shows, mounted once in the shell. A receipt
 * leaves after six seconds, but not while the reader points at it or a
 * control in it has focus.
 */
export function Toasts({ dismissLabel }: { dismissLabel: string }) {
  const message = useCurrentToast();
  return (
    <ToastRegion>
      {message ? (
        <div
          onPointerEnter={() => holdToast(true)}
          onPointerLeave={() => holdToast(false)}
          onFocus={() => holdToast(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) holdToast(false);
          }}
        >
          <Toast
            key={message.id}
            title={message.title}
            body={message.body ?? ""}
            auditId={message.auditId}
            dismissLabel={dismissLabel}
            onDismiss={() => {
              holdToast(false);
              dismissToast();
            }}
          >
            {message.action ? (
              <ToastAction>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    message.action?.onClick();
                    holdToast(false);
                    dismissToast();
                  }}
                >
                  {message.action.label}
                </Button>
              </ToastAction>
            ) : null}
            {message.download ? (
              <ToastAction>
                <Button size="sm" variant="secondary" href={message.download.href} download>
                  {message.download.label}
                </Button>
              </ToastAction>
            ) : null}
          </Toast>
        </div>
      ) : null}
    </ToastRegion>
  );
}
