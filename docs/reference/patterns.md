# Pattern screens

Whole screens under `src/screens`, built only from public components and shown in Storybook under `Patterns/`. They are examples, not exports: a product composes its own screens from the package. `src/screens/shell/ProductShell.tsx` is the frame they share. Sample copy is English and invented; sample people are `name@data-insights.ai`.

| Story | Folder | What it shows |
| --- | --- | --- |
| Patterns / Security overview | `overview/` | Attention list, a navy hero with its figures, severity and sources |
| Patterns / Architecture | `overview/` | A five-stage pipeline |
| Patterns / Case triage | `cases/` | A list beside its record (`Split variant="list"`), one view at a time on a phone |
| Patterns / Organization home | `home/` | An organization's home page, one story per role |
| Patterns / List page | `pages/` | The header holds the one primary action, the search toolbar narrows the list, the table sits on a panel with its count and pages, a row opens beside the list; loading keeps the shape, failure says so in place |
| Patterns / Detail page | `pages/` | A record's settings: sections that read until their Edit, Save at the foot of the window while something changed, the irreversible actions last with their consequence |
| Patterns / Create flow | `pages/` | Choose the type, fill in the details, review, create; Next waits until the step is complete, a failure is said above the buttons |
| Patterns / Settings | `pages/` | Session, channels, availability |
| Patterns / Register | `records/` | The source register as the page: one row per host with the manifest that vouches for it, the expiring key as the one thing, figures on a strip, a row's detail in a side dialog |
| Patterns / Watchlist | `records/` | Identities under watch |
| Patterns / Coverage | `records/` | A list of connected sources |
| Patterns / Inference | `records/` | Everything a model touches: the claim in place, the question before anything runs, the command bar, fields that state their confidence, the receipt |
| Patterns / Login | `shell/` | Sign-in: a card on the theme's ground |

A pattern stays inside the Storybook canvas (no fixed min-width wider than the preview) and works at 390px; tables scroll inside their own frame. Every `Patterns/*` title has a `null` entry in `.design-sync/config.json`'s `titleMap`, so the design sync does not treat it as a component.
