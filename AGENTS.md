# datAInsights Storybook

This repository is the component workbench for the datAInsights brand. It is not a product. Stories, chrome, and sample copy do not name a product, a suite, or a codename. Screens under `src/screens` show patterns a product can be assembled from.

## Sample people

Placeholder people use invented names. Their email addresses are `name@data-insights.ai`.

Do not use real people, their companies, their domains, or their personal addresses as examples.

## Brand

The datAInsights brand book is the source for colour, type, and the mark.

- Navy is the voice. Ivory is the page. Ink is body text. Gold is one moment per view: the tittle in the mark, or a single eyebrow.
- Small gold text on ivory uses Gold 700 (`#7C5F17`). Gold 600 does not clear WCAG AA at that size. Gold text on navy uses Gold 400.
- Paused uses the gold ramp (Gold 700 `#7C5F17` on ivory, Gold 400 on navy). Running is `#186D41` on wash `#E0E7DC`. Failed is `#AB2E37` on wash `#F1E0DB`. Those are the console screenshot hues, and each word stays above 5:1. Do not introduce a second yellow or a generic traffic-light palette.
- Sansation is display and figures. IBM Plex Sans is the interface. IBM Plex Mono is identifiers, timestamps, and eyebrows.
- The console uses those families at a denser size than the editorial scale in the brand book.
- Motion stays under 240ms, ease-out, one change at a time.
- Components bind to semantic tokens (`--di-*` roles). They do not name a primitive colour, typeface, or radius.

## Stories

- Every visible string is a prop. Storybook stories are written in English. A product passes its own language in from outside. Do not bake German, or any other language, into a component.
- A React node (an icon, an action, table rows and cells, `children` when it is an element) is a slot. Fill it as a child in the story `render`, and set `control: false` so Controls does not try to edit the element. `PageHeader` has no `aside` prop: whatever sits beside the title is `children`. `SectionTitle` has no `meta` prop: the trailing text is `children`. `Notice` has no `icon`, `title`, or `action` props: those are `NoticeIcon`, `NoticeTitle`, and `NoticeAction` children. `Button` has no `icon` prop: the icon is the first child. `TextField` has no `labelAction` prop: the slot beside the label is `children`. `CellLead` has no `icon` prop: the icon is a `CellIcon` child.
- `DataTable` does not take a `rows` array. The caller maps its own data into `TableHead`, `TableBody`, `TableRow`, and `TableCell` children. The table only supplies the frame, the caption, and an optional footer slot.
- `Pagination` is controlled. The caller owns `page` and which rows are visible. Previous and next call `onPageChange` with the next page. The component does not keep its own page.
- String props stay on `args`, so Controls can change the copy.
- A boolean prop is always `true` or `false` in `args`. Do not leave it unset. Storybook otherwise shows “Set boolean” instead of a toggle. Use the component’s real default: `dot: true`, `padded: true`, `disabled: false`.
- Helper text is a string, default `""`. Do not type it as `ReactNode`. An unset node becomes an object control; pressing Edit replaces it with a value the component cannot render.
- A select or radio (`variant`, `size`, `tone`, `type`) has one option chosen in `args`. Do not leave it unset. Use the component’s real default: `variant: "primary"`, `size: "md"`, `tone: "neutral"` or `"info"`, `type: "button"` or `"text"`.
- Event listeners (`onRemove`, `onClick`, and any other `on…` prop) stay callback props. They are not slots, and they are not controls. `.storybook/preview.tsx` excludes `/^on[A-Z].*/` from Controls and records the calls as actions. A play function that asserts the call passes `fn()` from `storybook/test`.
- Behaviour that can fail gets a `play` function, using `storybook/test`.
- `pnpm test` runs the stories in a browser through `@storybook/addon-vitest`.
- Storybook’s Get started checklist, the menu guide, and the “what’s new” notification are off in `.storybook/main.ts` (`sidebarOnboardingChecklist`, `menuOnboardingChecklist`, `disableWhatsNewNotifications`).
- Buttons, fields, and tables stay native elements until a control needs roving focus or a popup.

## Checks

Visible text meets WCAG AA. Status is a word plus a mark, not colour alone. An icon-only button has an accessible name. Focus is visible: navy on ivory, gold on the navy sidebar.

A screen has one `main` and one `h1`. Component stories get that wrapper from `.storybook/preview.tsx` when the story does not render its own heading. Text that sits on the dotted canvas, or on the sign-in painting, has its own solid background so the contrast can be measured. `pnpm test` fails on axe violations. The Accessibility panel also counts inconclusive results, so those backgrounds are part of the check.
