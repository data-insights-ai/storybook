import { Button } from "../../../actions/Button";
import { Toolbar } from "../../../actions/Toolbar";
import { Notice, NoticeAction, NoticeBody, NoticeIcon, NoticeText, NoticeTitle } from "../../Notice";

/** A page that failed (a `RouteBoundary`'s fallback): what happened, and a fresh document to load. */
export function PageFailure({ title, body, reloadLabel }: { title: string; body: string; reloadLabel: string }) {
  return (
    <Notice tone="danger">
      <NoticeIcon />
      <NoticeText>
        <NoticeTitle>{title}</NoticeTitle>
        <NoticeBody>{body}</NoticeBody>
      </NoticeText>
      <NoticeAction>
        <Toolbar>
          <Button variant="secondary" onClick={() => location.reload()}>
            {reloadLabel}
          </Button>
        </Toolbar>
      </NoticeAction>
    </Notice>
  );
}
