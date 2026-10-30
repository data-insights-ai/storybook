# Upgrading to 0.11

0.11.0 merges many components into fewer and keeps no old name behind: no alias, no wrapper, no prop that is accepted and ignored. Bump `@data-insights-ai/ui` to `0.11.0` and run the product's typecheck: it finds every removed export and prop. Class names, tokens and changed behaviour it cannot find; they are listed here too. This guide gives the replacement for each change, with a short example, and the files in each product that use it.

The file lists come from a read-only scan of the products' sources (imports from `@data-insights-ai/ui`, the JSX props passed, and class names and tokens in code and CSS) on 2026-10-30: account-platform at `ee104713`, AI SOC at `4f8e4835`, CVE Current at `29767a8`. "Files to change" must change to compile or to keep working; "Files to check" changed look or behaviour and may need nothing.

| Product | Files to change |
| --- | --- |
| account-platform | 163 |
| AI SOC | 184 |
| CVE Current | 55 |

## Old name → new

| Removed | Use |
| --- | --- |
| `Actions` | `Toolbar align="end"` |
| `BulkActionBar` | `Toolbar frame="bar" sticky="top"` with `ToolbarStatus`, `ToolbarSelection`, `ToolbarEnd` |
| `CountButton` | `Button variant="ghost" iconOnly badge badgeLabel` |
| `RowActions` | `Toolbar variant="row" label` |
| `SegmentedControl`, `ToggleGroup`, `ChoiceCards` | `ChoiceGroup appearance="segments"`, `"toggles"`, `"cards"` |
| `ChoiceCard`, `ToggleOption`, `ChoiceCardsPlanned` (types) | `ChoiceOption`, `ChoicePlanned` |
| `TokenField` | `MultiComboBox freeEntry validate` |
| `ConfidenceField` | `TextField readOnly confidence` |
| `SaveBar` | `Toolbar role="region" frame="bar" sticky="bottom"` |
| `FieldStack` | `Stack variant="form"` |
| `InlineForm` | `Toolbar fillFirst` |
| `KeyValues`, `KeyValue` | `FactList layout="pairs"`, `Fact` |
| `Stat`, `StatRow` | `Figure`, `FigureRow` |
| `StatTile`, `StatTileDelta` | `Panel` with a `Figure`, `FigureNote` |
| `HeroFigure` | `Figure size="hero"` |
| `ExplainPanel`, `ExplainRow`, `ExplainFooter`, `ExplainIgnored` | `ProposalPanel`, `Fact`, `ProposalNote`, `ProposalIgnored` |
| `ConfirmPanel`, `ConfirmActions` | `ProposalPanel`, `ProposalActions` |
| `LivingCard`, `Session`, `Channel` and their parts | `RecordCard` and its slots |
| `AttentionClear` | `Notice variant="line" tone="ok"` |
| `ListToolbar`, `ListToolbarEnd`, `ListToolbarNote` | `Toolbar role="search"`, `ToolbarEnd`, `ToolbarNote` |
| `TableToolbar` | a `Toolbar` in the `DataTable` |
| `TableSpacer`, `heldCount` | nothing; `InfiniteTable` keeps them inside |
| `Chip`, `VersionTag`, `CommandChip` | `Tag mono` |
| `PrivacyBadge` | `StatusPill track="record" icon` |
| `EmptyState`, `EmptyStateAction`, `EmptyStateIcon` | `Notice variant="empty"`, `NoticeAction`, `NoticeIcon` |
| `Spinner`, `AppLoader`, `SkeletonPage`, `SkeletonTable`, `SkeletonPageVariant` | `Loading shape`, `LoadingShape` |
| `Sheet`, `SheetFooter` | `Dialog`, `DialogFooter` |
| `Modal`, `ModalFrame`, `ModalContent`, `ModalTitle`, `ModalBody`, `ModalFooter`, `ModalIcon` | `Dialog placement="center"`, `DialogFooter` |
| `Stepper`, `Numbered` | `Steps variant="progress"`, `Steps variant="list"` |
| `Stage`, `StageTrack`, `StageIcon`, `StageFooter` | `Steps variant="cards"`, `Step`, `StepIcon`, `StepFooter` |
| `DangerZone` | `Panel tone="danger"` with `DangerAction` |
| `SectionTitle`, `SectionTitleHeading`, `SectionTitleMeta` | `PageHeader level={2}`, `PageHeaderTitle`, `PageHeaderMeta` |
| `Hero`, `HeroAside`, `HeroLead`, `HeroVisual`, `HeroFooter` | `Panel surface="hero"`, `PanelActions`, `PanelFigure`, `PanelVisual`, `PanelFooter` |
| `ListDetail` and its parts | `Split variant="list"` and its parts |
| `Accordion`, `AccordionItem`, `AccordionDetail`, `AccordionMeta` | `DisclosureGroup`, `Disclosure toggle="head"`, `DisclosureDetail`, `DisclosureMeta` |
| `ChartCard`, `ChartCardAction`, `ChartCardGrid` | `Panel` with `PanelFigure`, `PanelActions`, `PanelVisual`; `Grid min` |
| `Bars` | `Sparkline width="fill" height="md" captions` |
| `WeekTimeline`, `WeekTimelineRow` | `PeriodTimeline` in minutes, `PeriodRow` |
| `Period` (type) | `PeriodRow`, `PeriodSpan` |
| `AppShell`, `AppShellRail`, `AppShellMain`, `AppShellFoot`, `AppShellContext`, `NavGroup`, `NavItem` | `SidebarProvider`, `Sidebar`, `SidebarInset`, `AppShellBar`, `AppShellContent` |

| Removed prop or value | Use |
| --- | --- |
| `Button size="dense"`, `size="comfort"` | `size="sm"`, `size="lg"` |
| `SearchField dense` | `size="sm"` |
| `QuantityField labelHidden` | `hideLabel` |
| `TableRow tone` | a State column |
| `Sparkline bars` | `values`, `highlight`, `tone` |
| `Progress countTrack` | `LevelMeter` for a quota |
| `Notice size` | nothing |
| `CommandRow active` | nothing; the bar highlights its rows |
| `Disclosure meta` | a `DisclosureMeta` child |
| `PageHeaderTitle level` | `PageHeader level` |
| `Panel index`, `indexSize`, `indexTone`, `indexRule`, `surface="grid"` | nothing; `Steps` for a real sequence |
| `EmptyState index`, `Sheet index`, `StatTile index` | nothing; name the record in `eyebrow` |
| `PeriodTimeline periods`, `today`, `todayLabel` | `rows`, `marker` |
| `AppShellBarEnd` without `moreLabel` | `moreLabel` is required |

## Actions

### `Button size="dense"` and `size="comfort"`

The sizes are `sm`, `md` and `lg`. `dense` is `sm`, `comfort` is `lg`. Density (`DensityProvider`) scales every size.

```tsx
<Button size="dense">Clear</Button>      →  <Button size="sm">Clear</Button>
<Button size="comfort">Sign in</Button>  →  <Button size="lg">Sign in</Button>
```

Files to change:

- account-platform (27): `web/src/features/billing/BillingError.tsx`, `web/src/features/billing/contracts/ContractPage.tsx`, `web/src/features/invitations/InvitationRow.tsx`, `web/src/features/legal/BusinessUseConfirm.tsx`, `web/src/features/members/MemberActivityLink.tsx`, `web/src/features/operator/PartnersPage.tsx`, `web/src/features/operator/contracts/ScheduleActions.tsx`, `web/src/features/operator/licenses/SerialsSection.tsx`, `web/src/features/operator/offers/RevisionHistory.tsx`, `web/src/features/operator/offers/form/license/Changed.tsx`, `web/src/features/operator/offers/form/license/LimitRow.tsx`, `web/src/features/operator/offers/form/license/ProductLicense.tsx`, `web/src/features/operator/tasks/OwnerTasks.tsx`, `web/src/features/partners/PartnershipSection.tsx`, `web/src/features/partners/list/RelationshipRow.tsx`, `web/src/features/products/access/ProductAccessSection.tsx`, `web/src/features/settings/MailRelaySection.tsx`, `web/src/features/settings/TemplateEditor.tsx`, `web/src/features/signin/detail/DomainsSection.tsx`, `web/src/features/signin/detail/GoogleSection.tsx`, `web/src/features/signin/detail/LdapSyncSection.tsx`, `web/src/features/signin/detail/ScimSection.tsx`, `web/src/features/signin/detail/SettingsSection.tsx`, `web/src/features/signin/detail/edit/CertificatesSection.tsx`, `web/src/features/signin/detail/test/TestSection.tsx`, `web/src/shared/feedback/Toasts.tsx`, `web/src/shared/list/RowMenu.tsx`
- AI SOC (`ai-soc-platform`) (48): `web/src/features/access/FirstAdministratorNotice.tsx`, `web/src/features/access/grants/HeldGrantLine.tsx`, `web/src/features/access/roles/PermissionChoices.tsx`, `web/src/features/access/support/SupportBanner.tsx`, `web/src/features/apikeys/keys/KeyRowActions.tsx`, `web/src/features/assets/list/AssetFilters.tsx`, `web/src/features/assets/list/BulkBar.tsx`, `web/src/features/assets/list/SavedViews.tsx`, `web/src/features/audit/AuditPage.tsx`, `web/src/features/cases/detail/AccessPanel.tsx`, `web/src/features/cases/detail/MergeDialog.tsx`, `web/src/features/cases/detail/StorySection.tsx`, `web/src/features/cases/evidence/EvidenceSheet.tsx`, `web/src/features/cases/list/CaseFilters.tsx`, `web/src/features/collection/create/StreamingGuide.tsx`, `web/src/features/collection/list/SourceRow.tsx`, `web/src/features/inbox/InboxBell.tsx`, `web/src/features/inbox/InboxPage.tsx`, `web/src/features/inbox/RowMenu.tsx`, `web/src/features/integrations/connection/TlsFields.tsx`, `web/src/features/integrations/detail/DeliveriesSection.tsx`, `web/src/features/integrations/exports/DeadLetters.tsx`, `web/src/features/integrations/list/DestinationRow.tsx`, `web/src/features/integrations/mapping/FieldSheet.tsx`, `web/src/features/integrations/mapping/FieldTable.tsx`, `web/src/features/integrations/mapping/MappingEditor.tsx`, `web/src/features/integrations/mapping/MappingPreview.tsx`, `web/src/features/integrations/rules/KindsPicker.tsx`, `web/src/features/integrations/rules/QuietHoursEditor.tsx`, `web/src/features/licensing/lifecycle/LifecycleNotice.tsx`, `web/src/features/licensing/page/LicensesSection.tsx`, `web/src/features/partners/cases/PartnerCaseToolbar.tsx`, `web/src/features/partners/inbox/PartnerInboxActions.tsx`, `web/src/features/partners/inbox/PartnerInboxPage.tsx`, `web/src/features/partners/reports/PartnerReportRow.tsx`, `web/src/features/partners/reports/PartnerReportsPage.tsx`, `web/src/features/partners/reports/RefusedNotice.tsx`, `web/src/features/settings/TemplateEditor.tsx`, `web/src/features/sites/actions/SiteActions.tsx`, `web/src/features/soc/actors/SightingsTable.tsx`, `web/src/features/soc/case/CaseDetailPage.tsx`, `web/src/features/soc/case/CaseGraphPage.tsx`, `web/src/features/soc/case/story/StoryTab.tsx`, `web/src/features/soc/case/timeline/SignalSheet.tsx`, `web/src/features/soc/case/timeline/SignalSummary.tsx`, `web/src/features/soc/case/timeline/SignalTimeline.tsx`, `web/src/features/soc/ui/LoadError.tsx`, `web/src/features/workspaces/DeletedWorkspaces.tsx`
- CVE Current (`di-seismograph`) (2): `web/src/app/App.tsx`, `web/src/shared/controls/Filters.tsx`

### `CountButton` → `Button badge`

The count is a badge on an icon-only ghost button. `badge` takes the number (Button draws "99+" itself); the words go in `badgeLabel`, the name in `aria-label`. The count now follows the icon instead of covering it, so the button is wider.

```tsx
<CountButton label="Notifications, 3 unread" count={3} countLabel="3"
  expanded={open} controls="inbox" onClick={toggle}><Bell /></CountButton>
→
<Button variant="ghost" iconOnly aria-label="Notifications" badge={3} badgeLabel="3 unread"
  aria-expanded={open} aria-controls="inbox" onClick={toggle}><Bell /></Button>
```

Files to change:

- AI SOC (`ai-soc-platform`) (2): `web/src/features/inbox/InboxBell.tsx`, `web/src/features/partners/inbox/PartnerInboxBell.tsx`

### `BulkActionBar` → `Toolbar frame="bar"`

A labelled group, not an ARIA toolbar: every button keeps its own tab stop.

```tsx
<BulkActionBar label="Selection" selectedLabel="3 selected" clearLabel="Clear" onClear={clear}
  selectAllLabel="Select all 40" onSelectAll={all}>{actions}</BulkActionBar>
→
<Toolbar label="Selection" frame="bar" sticky="top">
  <ToolbarStatus>3 selected</ToolbarStatus>
  <ToolbarSelection clearLabel="Clear" onClear={clear} selectAllLabel="Select all 40" onSelectAll={all} />
  <ToolbarEnd>{actions}</ToolbarEnd>
</Toolbar>
```

Files to change:

- AI SOC (`ai-soc-platform`) (1): `web/src/features/assets/list/BulkBar.tsx`

### `RowActions` → `Toolbar variant="row"`

Give the row's toolbar a `label` that names the row.

```tsx
<RowActions>{buttons}</RowActions>  →  <Toolbar variant="row" label={`Actions for ${row.name}`}>{buttons}</Toolbar>
```

Files to change:

- account-platform (10): `web/src/features/invitations/InvitationRow.tsx`, `web/src/features/members/MemberRow.tsx`, `web/src/features/operator/PartnersPage.tsx`, `web/src/features/operator/staff/PendingStaffSection.tsx`, `web/src/features/operator/staff/StaffPage.tsx`, `web/src/features/partners/list/RelationshipRow.tsx`, `web/src/features/partners/sheet/StaffSection.tsx`, `web/src/features/products/seats/SeatRow.tsx`, `web/src/features/signin/detail/directory/GroupsTab.tsx`, `web/src/features/signin/list/ConnectionRow.tsx`
- AI SOC (`ai-soc-platform`) (7): `web/src/features/apikeys/keys/KeyRowActions.tsx`, `web/src/features/collection/list/SourceRow.tsx`, `web/src/features/inbox/RowMenu.tsx`, `web/src/features/integrations/list/DestinationRow.tsx`, `web/src/features/partners/inbox/PartnerInboxActions.tsx`, `web/src/features/partners/reports/PartnerReportRow.tsx`, `web/src/features/sites/actions/SiteActions.tsx`

### `Actions` → `Toolbar align`

The closing buttons of a form or a block. On a phone they now wrap instead of stacking at full width.

```tsx
<Actions>{buttons}</Actions>               →  <Toolbar align="end">{buttons}</Toolbar>
<Actions align="start">{buttons}</Actions>  →  <Toolbar align="start">{buttons}</Toolbar>
```

Files to change:

- account-platform (7): `web/src/features/invitations/AcceptInvitationPage.tsx`, `web/src/features/operator/licenses/issue/IssuedResult.tsx`, `web/src/features/operator/offers/OfferFormPage.tsx`, `web/src/features/organizations/CreateOrganizationForm.tsx`, `web/src/features/partners/AcceptPartnerInvitationPage.tsx`, `web/src/features/settings/MailRelaySection.tsx`, `web/src/features/signup/CompleteSignupForm.tsx`
- AI SOC (`ai-soc-platform`) (16): `web/src/features/cases/detail/AccessPanel.tsx`, `web/src/features/cases/detail/ActivityTimeline.tsx`, `web/src/features/cases/detail/TriageRail.tsx`, `web/src/features/integrations/exports/DeadLetters.tsx`, `web/src/features/integrations/mapping/FieldSheet.tsx`, `web/src/features/licensing/lifecycle/ExpiredMember.tsx`, `web/src/features/licensing/seats/SeatRequired.tsx`, `web/src/features/reports/schedules/SchedulePage.tsx`, `web/src/features/settings/TemplateEditor.tsx`, `web/src/features/settings/enrichment/DatabaseFiles.tsx`, `web/src/features/settings/enrichment/KeySection.tsx`, `web/src/features/settings/enrichment/TestBar.tsx`, `web/src/features/settings/intel/FeedSheet.tsx`, `web/src/features/settings/intel/IndicatorsSheet.tsx`, `web/src/features/settings/intel/SecretSection.tsx`, `web/src/features/settings/intel/UploadSection.tsx`

### Ghost button

A ghost Button has no underline any more. Where a ghost button really is a link, use `variant="link"` or a `TextLink`. No code change otherwise.


## Forms

### `SegmentedControl`, `ToggleGroup`, `ChoiceCards` → `ChoiceGroup appearance`

One component, `ChoiceGroup`, with `appearance`. `ToggleGroup` needs a `name` now; its days are checkboxes in one joined row. The option types are `ChoiceOption` and `ChoicePlanned` (`ChoiceCard`, `ToggleOption` and `ChoiceCardsPlanned` are gone). Classes: `di-segmented`, `di-segment`, `di-toggle*`, `di-choicecard(s)*` → `di-choice-segments`, `di-choice-segment`, `di-choice-cards`, `di-choice-card*`, `di-choice-planned*`; the chosen state is `.is-chosen`.

```tsx
<SegmentedControl name="view" legend="Show" options={o} value={v} onChange={set} />
→ <ChoiceGroup appearance="segments" hideLegend name="view" legend="Show" options={o} value={v} onChange={set} />

<ToggleGroup legend="Quiet on" options={days} value={d} onChange={setD} />
→ <ChoiceGroup appearance="toggles" multiple name="quiet" legend="Quiet on" options={days} value={d} onChange={setD} />

<ChoiceCards name="kind" legend="Source" options={o} value={v} onChange={set} planned={p}>{detail}</ChoiceCards>
→ <ChoiceGroup appearance="cards" name="kind" legend="Source" options={o} value={v} onChange={set} planned={p}>{detail}</ChoiceGroup>
```

Files to change:

- account-platform (9): `web/src/features/billing/PriceListSection.tsx`, `web/src/features/operator/PartnersPage.tsx`, `web/src/features/operator/licenses/issue/ContentsStep.tsx`, `web/src/features/operator/licenses/issue/HolderStep.tsx`, `web/src/features/operator/offers/form/PaymentSection.tsx`, `web/src/features/operator/offers/form/license/LicenseTuning.tsx`, `web/src/features/organizations/CreateOrganizationForm.tsx`, `web/src/features/signin/create/KindStep.tsx`, `web/src/features/signin/kinds/SAMLFields.tsx`
- AI SOC (`ai-soc-platform`) (20): `web/src/features/audit/AuditExport.tsx`, `web/src/features/collection/create/TypeStep.tsx`, `web/src/features/collection/list/SourcesPage.tsx`, `web/src/features/inbox/InboxPage.tsx`, `web/src/features/integrations/create/NewDestinationPage.tsx`, `web/src/features/integrations/detail/DeliveriesSection.tsx`, `web/src/features/integrations/list/DestinationsPage.tsx`, `web/src/features/integrations/mapping/MappingEditor.tsx`, `web/src/features/integrations/rules/KindsPicker.tsx`, `web/src/features/integrations/rules/QuietHoursEditor.tsx`, `web/src/features/partners/cases/PartnerCaseToolbar.tsx`, `web/src/features/partners/inbox/PartnerInboxPage.tsx`, `web/src/features/partners/reports/NewReportSheet.tsx`, `web/src/features/reports/generate/PeriodPicker.tsx`, `web/src/features/reports/schedules/NewSchedulePage.tsx`, `web/src/features/settings/enrichment/EnrichmentSettings.tsx`, `web/src/features/soc/actors/ActorsTable.tsx`, `web/src/features/soc/case/mitre/MitreTab.tsx`, `web/src/features/soc/case/story/StoryTab.tsx`, `web/src/features/soc/cases/ThreatLevels.tsx`
- CVE Current (`di-seismograph`) (8): `web/src/features/account/notifications/CreateChannel.tsx`, `web/src/features/briefings/Controls.tsx`, `web/src/features/changes/Page.tsx`, `web/src/features/inventory/results/Results.tsx`, `web/src/features/pricing/Page.tsx`, `web/src/features/records/RecordFilters.tsx`, `web/src/features/watches/criteria/CriteriaFields.tsx`, `web/src/features/watches/detail/Matches.tsx`

### `TokenField` → `MultiComboBox freeEntry`

`isValid` becomes `validate`; `options` and `toggleLabel` are optional, so a field without suggestions passes neither.

```tsx
<TokenField id="to" label="Email addresses" values={v} onChange={set} isValid={isEmail}
  invalidLabel="Not an address" removeLabel={(x) => `Remove ${x}`} />
→
<MultiComboBox freeEntry id="to" label="Email addresses" values={v} onChange={set} validate={isEmail}
  invalidLabel="Not an address" removeLabel={(x) => `Remove ${x}`} />
```

Files to change:

- account-platform (2): `web/src/features/invitations/InviteSheet.tsx`, `web/src/features/operator/licenses/ProductsEditor.tsx`
- AI SOC (`ai-soc-platform`) (1): `web/src/features/assets/detail/ContextSection.tsx`

### `ConfidenceField` → `TextField confidence`

The value is the read-only field's `value`; the reading is one `confidence` object (type `FieldConfidenceReading`). Classes `di-confidence*` are gone.

```tsx
<ConfidenceField id="vendor" label="Vendor" confidence={0.82} confidenceLabel="82% sure" level="review"
  whyLabel="Why" onWhy={why}>Contoso</ConfidenceField>
→
<TextField id="vendor" label="Vendor" readOnly value="Contoso"
  confidence={{ value: 0.82, label: "82% sure", level: "review", whyLabel: "Why", onWhy: why }} />
```

Files to change: none.

### `QuantityField labelHidden` → `hideLabel`

The name every other field uses.

```tsx
<QuantityField labelHidden … />  →  <QuantityField hideLabel … />
```

Files to change:

- account-platform (1): `web/src/features/billing/OfferTable.tsx`

### `SearchField dense` → `size="sm"`

```tsx
<SearchField dense … />  →  <SearchField size="sm" … />
```

Files to change:

- AI SOC (`ai-soc-platform`) (4): `web/src/features/assets/list/AssetFilters.tsx`, `web/src/features/cases/list/CaseFilters.tsx`, `web/src/features/integrations/rules/KindsPicker.tsx`, `web/src/shared/list/UrlSearchField.tsx`
- CVE Current (`di-seismograph`) (2): `web/src/features/overview/FilterBar.tsx`, `web/src/features/records/RecordFilters.tsx`

### `SaveBar` → `Toolbar role="region" frame="bar" sticky="bottom"`

Render it only while there are unsaved changes, as before.

```tsx
<SaveBar label="Unsaved changes" message="2 fields changed">{buttons}</SaveBar>
→
<Toolbar label="Unsaved changes" role="region" frame="bar" sticky="bottom">
  <ToolbarStatus>2 fields changed</ToolbarStatus>
  <ToolbarEnd>{buttons}</ToolbarEnd>
</Toolbar>
```

Files to change:

- account-platform (1): `web/src/features/settings/TemplateEditor.tsx`
- AI SOC (`ai-soc-platform`) (2): `web/src/features/reports/schedules/SchedulePage.tsx`, `web/src/features/settings/TemplateEditor.tsx`

### Required fields and read-only fields

A required field shows `*` after its label (TextField, TextArea, FileField, QuantityField, Select, ComboBox, MultiComboBox, DateField, TimeField). Labels that carried "(required)" or "*" in their text drop it. A read-only field is drawn in its own read-only tone without a frame; a read-only ComboBox has no toggle and a read-only DateField no calendar button. Field frames have the button radius (6px). On a touch screen a field is 40px high with 16px text.


## Data

### `KeyValues`, `KeyValue` → `FactList layout="pairs"`, `Fact`

```tsx
<KeyValues><KeyValue term="Region" value="eu-central" /></KeyValues>
→
<FactList layout="pairs"><Fact label="Region">eu-central</Fact></FactList>
```

Files to change:

- AI SOC (`ai-soc-platform`) (10): `web/src/features/collection/create/Review.tsx`, `web/src/features/integrations/create/Review.tsx`, `web/src/features/integrations/detail/Certificates.tsx`, `web/src/features/integrations/detail/ConnectionSummary.tsx`, `web/src/features/integrations/detail/DestinationPage.tsx`, `web/src/features/integrations/exports/ExportDelivery.tsx`, `web/src/features/integrations/mapping/MappingDiff.tsx`, `web/src/features/integrations/mapping/MappingSummary.tsx`, `web/src/features/reports/schedules/NewSchedulePage.tsx`, `web/src/features/reports/schedules/SchedulePage.tsx`

### `Stat`, `StatRow` → `Figure`, `FigureRow`

`suffix` becomes `unit`; what qualified the value goes in the children. `FigureRow` needs a `label` that names the row (`variant="strip"` is the default; `footer` closes a hero `Panel`).

```tsx
<StatRow><Stat label="Seats" value="12" suffix="of 20" /></StatRow>
→
<FigureRow label="Licence"><Figure label="Seats" value="12" unit="of 20" /></FigureRow>
```

Files to change:

- account-platform (2): `web/src/features/credits/CreditsPage.tsx`, `web/src/features/offers/OfferTotals.tsx`
- AI SOC (`ai-soc-platform`) (2): `web/src/features/collection/detail/StatusSection.tsx`, `web/src/features/integrations/exports/ExportDelivery.tsx`
- CVE Current (`di-seismograph`) (2): `web/src/features/briefings/Evidence.tsx`, `web/src/features/overview/SignalPanel.tsx`

### `StatTile`, `StatTileDelta` → `Panel` with a `Figure`, `FigureNote`

`compact` becomes `size="compact"`; `ruled` and `index` go.

```tsx
<StatTile label="Open cases" value="14" tone="danger"><StatTileDelta tone="danger">+3 since Monday</StatTileDelta></StatTile>
→
<Panel><Figure label="Open cases" value="14" tone="danger"><FigureNote tone="danger">+3 since Monday</FigureNote></Figure></Panel>
```

Files to change:

- AI SOC (`ai-soc-platform`) (4): `web/e2e/partner-tiles.e2e.ts`, `web/src/features/partners/overview/TotalTiles.tsx`, `web/src/features/workspaces/overview/AttentionTiles.tsx`, `web/src/shared/layout/TileLink.css`
- CVE Current (`di-seismograph`) (4): `web/e2e/watches.spec.ts`, `web/src/features/catalog/detail/Detail.tsx`, `web/src/features/inventory/results/Summary.tsx`, `web/src/features/watches/detail/Stats.tsx`

### `HeroFigure` → `Figure size="hero"`

Added and merged during 0.11; no release carried it.

```tsx
<HeroFigure label="Exposure" value="62" unit="%" />  →  <Figure size="hero" label="Exposure" value="62" unit="%" />
```

Files to change: none.

### `AttentionClear` → `Notice variant="line" tone="ok"`

Added and merged during 0.11; no release carried it.

```tsx
<AttentionClear title="Everything is running" note="12 sources · checked 09:12" />
→
<Notice variant="line" tone="ok">
  <NoticeTitle>Everything is running</NoticeTitle>
  <NoticeBody><MetaLine items="12 sources · checked 09:12" /></NoticeBody>
</Notice>
```

Files to change: none.

### `ExplainPanel`, `ExplainRow`, `ExplainFooter` → `ProposalPanel`

`heading` becomes `label`; the answer is a `ProposalAnswer`; rows are `Fact`s in a `FactList layout="stacked"`; ignored rows move into one `ProposalIgnored`; the footer is `ProposalNote`.

```tsx
<ExplainPanel heading="Why this verdict">
  <ExplainRow label="Source">Defender</ExplainRow>
  <ExplainFooter>Model 2026-10</ExplainFooter>
</ExplainPanel>
→
<ProposalPanel label="Why this verdict">
  <ProposalAnswer>Likely benign</ProposalAnswer>
  <FactList layout="stacked"><Fact label="Source">Defender</Fact></FactList>
  <ProposalNote>Model 2026-10</ProposalNote>
</ProposalPanel>
```

Files to change: none.

### `ConfirmPanel`, `ConfirmActions` → `ProposalPanel`

`eyebrow` becomes `label`, the question a `ProposalQuestion`, the facts a `FactList`, the actions `ProposalActions`. The "why" link is the panel's own fold (`whyLabel`).

```tsx
<ConfirmPanel eyebrow="Proposed" question="Close as benign?" whyLabel="Why" onWhy={why}>
  {facts}<ConfirmActions>{buttons}</ConfirmActions>
</ConfirmPanel>
→
<ProposalPanel label="Proposed" whyLabel="Why">
  <ProposalQuestion>Close as benign?</ProposalQuestion>
  <FactList layout="stacked">{facts}</FactList>
  <ProposalActions>{buttons}</ProposalActions>
</ProposalPanel>
```

Files to change: none.

### `LivingCard`, `Session`, `Channel` and their parts → `RecordCard`

One record card with slots. `LivingCard` is a `RecordCard` with an inferred `StatusPill` in `RecordStatus`; `Session` is `layout="row"`; `Channel` is a card with a `RecordValue`. Parts: `LivingBody` → `RecordBody`, `LivingInsight` → `RecordInsight`, `LivingBasis` → `RecordBasis`, `LivingActions`/`SessionAction` → `RecordActions`, `SessionDetail` → `RecordDetail`, `SessionMark` → `RecordMark`, `SessionTag`/`ChannelStatus` → `RecordStatus`, `ChannelValue` → `RecordValue`, `ChannelSpecs` → a `FactList layout="pairs"`.

```tsx
<Session name="MacBook Pro"><SessionDetail>Last seen 09:12</SessionDetail></Session>
→
<RecordCard title="MacBook Pro" layout="row" heading={false}><RecordDetail>Last seen 09:12</RecordDetail></RecordCard>
```

Files to change: none.

### `ListToolbar`, `ListToolbarEnd`, `ListToolbarNote` → `Toolbar role="search"`

Leave `sticky` out where the toolbar should not stick (`sticky={false}` before).

```tsx
<ListToolbar label="Filter members">{search}<ListToolbarEnd>{button}</ListToolbarEnd></ListToolbar>
→
<Toolbar label="Filter members" role="search" sticky="top">{search}<ToolbarEnd>{button}</ToolbarEnd></Toolbar>
```

Files to change:

- account-platform (24): `web/src/features/audit/AuditPage.tsx`, `web/src/features/credits/UsageTab.tsx`, `web/src/features/credits/ledger/LedgerSection.tsx`, `web/src/features/invitations/InvitationsPage.tsx`, `web/src/features/members/MembersPage.tsx`, `web/src/features/operator/OrganizationsPage.tsx`, `web/src/features/operator/PartnersPage.tsx`, `web/src/features/operator/catalog/PackagesTab.tsx`, `web/src/features/operator/catalog/PricesTab.tsx`, `web/src/features/operator/catalog/bundles/BundlesTab.tsx`, `web/src/features/operator/catalog/meters/MetersTab.tsx`, `web/src/features/operator/catalog/products/ProductsTab.tsx`, `web/src/features/operator/contracts/ContractList.tsx`, `web/src/features/operator/installations/InstallationList.tsx`, `web/src/features/operator/licenses/LicenseList.tsx`, `web/src/features/operator/offers/OfferList.tsx`, `web/src/features/operator/payments/PaymentsPage.tsx`, `web/src/features/operator/staff/StaffPage.tsx`, `web/src/features/organizations/OrganizationsPage.tsx`, `web/src/features/partners/list/RelationshipList.tsx`, `web/src/features/products/seats/ProductSeatsPage.tsx`, `web/src/features/signin/detail/directory/GroupsTab.tsx`, `web/src/features/signin/detail/directory/PeopleTab.tsx`, `web/src/features/signin/list/SignInPage.tsx`
- AI SOC (`ai-soc-platform`) (21): `web/src/features/access/AccessPage.tsx`, `web/src/features/access/grants/Holders.tsx`, `web/src/features/apikeys/accounts/ServiceAccounts.tsx`, `web/src/features/apikeys/keys/OrganizationKeys.tsx`, `web/src/features/apikeys/keys/PersonalKeys.tsx`, `web/src/features/assets/list/AssetFilters.tsx`, `web/src/features/audit/AuditPage.tsx`, `web/src/features/cases/list/CaseFilters.tsx`, `web/src/features/collection/list/SourcesPage.tsx`, `web/src/features/inbox/InboxPage.tsx`, `web/src/features/integrations/detail/DeliveriesSection.tsx`, `web/src/features/integrations/list/DestinationsPage.tsx`, `web/src/features/partners/cases/PartnerCaseToolbar.tsx`, `web/src/features/partners/inbox/PartnerInboxPage.tsx`, `web/src/features/partners/reports/PartnerReportsPage.tsx`, `web/src/features/reports/list/RunsList.tsx`, `web/src/features/reports/schedules/SchedulesList.tsx`, `web/src/features/settings/enrichment/EnrichmentSettings.tsx`, `web/src/features/settings/intel/TaxiiFeeds.tsx`, `web/src/features/workspaces/WorkspacesPage.tsx`, `web/src/shared/layout/TabPanel.tsx`
- CVE Current (`di-seismograph`) (6): `web/e2e/layout/checks.ts`, `web/src/features/account/AuditTrail.tsx`, `web/src/features/account/Keys.tsx`, `web/src/features/account/Page.tsx`, `web/src/features/account/Webhooks.tsx`, `web/src/features/account/plan/PlanSummary.tsx`

### `TableToolbar` → a `Toolbar` in the `DataTable`

The table draws its frame around a `Toolbar` child.

```tsx
<DataTable label="Sources"><TableToolbar>{filters}</TableToolbar>…</DataTable>
→
<DataTable label="Sources"><Toolbar>{filters}</Toolbar>…</DataTable>
```

Files to change:

- AI SOC (`ai-soc-platform`) (3): `web/src/features/soc/actors/ActorsTable.tsx`, `web/src/features/soc/cases/ThreatLevels.tsx`, `web/src/shared/list/VirtualTable.tsx`

### `TableRow tone` removed

A row's state is its State column (`StatusPill`, or `SeverityMark` with its word), the same for every state. Drop `tone`.

```tsx
<TableRow tone="danger">…</TableRow>  →  <TableRow>… <TableCell><StatusPill tone="danger">Failed</StatusPill></TableCell></TableRow>
```

Files to change:

- account-platform (3): `web/src/features/invitations/InviteResult.tsx`, `web/src/features/offers/ScheduleTable.tsx`, `web/src/features/operator/payments/PaymentsPage.tsx`
- AI SOC (`ai-soc-platform`) (4): `web/src/features/cases/detail/StorySection.tsx`, `web/src/features/integrations/detail/DeliveriesSection.tsx`, `web/src/features/integrations/exports/DeadLetters.tsx`, `web/src/features/integrations/mapping/FieldTable.tsx`

### `TableSpacer` and `heldCount` are no longer exported

`InfiniteTable` renders its own spacers; nothing replaces them in a product.

Files to change: none.

### `Sparkline bars` → `values`

Pass the numbers; the bar heights are computed. `highlight` marks one bar, `tone` the series.

```tsx
<Sparkline label="Last 7 days" bars={[{ percent: 40 }, { percent: 100, tone: "danger" }]} />
→
<Sparkline label="Last 7 days" values={[4, 10]} highlight={1} tone="danger" />
```

Files to change:

- AI SOC (`ai-soc-platform`) (1): `web/src/features/soc/actors/ActorBrief.tsx`

### A table in a padded Panel

A `DataTable` in a padded `Panel` or `Dialog` no longer bleeds 12px into the padding: its band and rules start at the content edge. Use `<Panel padded={false}>` where the table is the panel's whole content.

Files to check:

- AI SOC (`ai-soc-platform`) (4): `web/src/features/cases/detail/StorySection.tsx`, `web/src/features/soc/case/derivation/FindingDerivation.tsx`, `web/src/features/soc/case/story/StoryGroupPanel.tsx`, `web/src/features/workspaces/DeletedWorkspaces.tsx`

## Marks and text

### `Chip` → `Tag mono`

A set filter is pressed and removable; an offered one is clickable. Classes `di-chip*` are gone.

```tsx
<Chip active onRemove={drop} removeLabel="Remove filter">severity: high</Chip>
→ <Tag mono pressed onRemove={drop} removeLabel="Remove filter">severity: high</Tag>
<Chip onClick={add} removeLabel="">severity: high</Chip>
→ <Tag mono onClick={add}>severity: high</Tag>
```

Files to change:

- AI SOC (`ai-soc-platform`) (3): `web/src/features/cases/list/CaseFilters.tsx`, `web/src/features/partners/CustomerFilter.tsx`, `web/src/features/partners/cases/PartnerCaseToolbar.tsx`
- CVE Current (`di-seismograph`) (2): `web/src/features/watches/criteria/ProductPicker.tsx`, `web/src/shared/controls/Filters.tsx`

### `VersionTag` → `Tag mono`

```tsx
<VersionTag>v0.11.0</VersionTag>  →  <Tag mono>v0.11.0</Tag>
```

Files to change:

- AI SOC (`ai-soc-platform`) (1): `web/src/features/sites/detail/SiteDetails.tsx`

### `PrivacyBadge` → `StatusPill track="record" icon`

`scope` becomes a tone: `local` → `ok`, `external` → `warn`, `retention` → `neutral`. Class `di-privacy` is gone.

```tsx
<PrivacyBadge scope="local"><Lock />On this server</PrivacyBadge>
→ <StatusPill tone="ok" track="record" icon={<Lock />}>On this server</StatusPill>
```

Files to change: none.

### `TextLink quiet` is no longer mono

Where `quiet` stood on an identifier, write `mono quiet` to keep the identifier's face. A TextLink takes the size of its line; a disabled one has no underline.

```tsx
<TextLink quiet href={url}>CASE-0042</TextLink>  →  <TextLink mono quiet href={url}>CASE-0042</TextLink>
```

Files to check:

- AI SOC (`ai-soc-platform`) (6): `web/src/features/soc/actors/ActorsTable.tsx`, `web/src/features/soc/actors/SightingsTable.tsx`, `web/src/features/soc/case/RelatedTable.tsx`, `web/src/features/soc/case/signals/SignalsTable.tsx`, `web/src/features/soc/case/story/StoryGroupPanel.tsx`, `web/src/features/soc/cases/ThreatLevels.tsx`
- CVE Current (`di-seismograph`) (1): `web/src/features/mirror/Page.tsx`

### Severity is `SeverityMark`

A severity is one five-step scale (`info`, `low`, `medium`, `high`, `critical`) drawn as a filled mark and its word. A product pill that maps severity onto `StatusPill` tones (the SOC's `SeverityPill`) becomes `SeverityMark variant="chip"`.

```tsx
<SeverityPill severity={s} />  →  <SeverityMark level={s} label={labels.severity(s)} variant="chip" />
```

Files to change:

- AI SOC (`ai-soc-platform`) (7): `web/src/features/soc/case/CaseDetailPage.tsx`, `web/src/features/soc/case/RelatedTable.tsx`, `web/src/features/soc/case/signals/SignalFacts.tsx`, `web/src/features/soc/case/signals/SignalsTable.tsx`, `web/src/features/soc/case/story/StoryGroupPanel.tsx`, `web/src/features/soc/case/timeline/SignalReadout.tsx`, `web/src/features/soc/ui/Pills.tsx`

### `Badge tone="seal"` is a brand moment

The seal gold belongs to sign-in, the mark, empty and onboarding states and licence seals. In an operational view use `tone="neutral"`.

Files to check:

- account-platform (1): `web/src/features/operator/catalog/PackagePage.tsx`

## Feedback

### `EmptyState`, `EmptyStateAction`, `EmptyStateIcon` → `Notice variant="empty"`

`eyebrow` and `title` become `<NoticeTitle eyebrow>`, `body` and `mono` become `<NoticeBody mono>`, the icon and action are `NoticeIcon` and `NoticeAction`; `tone` stays. `index` goes. It is announced as a status (`alert` for danger). Classes `di-empty*` are gone.

```tsx
<EmptyState eyebrow="Sources" title="No sources yet" body="Connect one to start collecting.">
  <EmptyStateAction><Button>Connect</Button></EmptyStateAction>
</EmptyState>
→
<Notice variant="empty">
  <NoticeTitle eyebrow="Sources">No sources yet</NoticeTitle>
  <NoticeBody>Connect one to start collecting.</NoticeBody>
  <NoticeAction><Button>Connect</Button></NoticeAction>
</Notice>
```

Files to change:

- account-platform (39): `web/src/app/NotFoundPage.tsx`, `web/src/app/RouteError.tsx`, `web/src/features/audit/AuditPage.tsx`, `web/src/features/billing/BillingPage.tsx`, `web/src/features/billing/CheckoutPage.tsx`, `web/src/features/billing/SubscriptionSection.tsx`, `web/src/features/billing/contracts/ContractPage.tsx`, `web/src/features/billing/offers/OfferLinkPage.tsx`, `web/src/features/credits/ledger/LedgerSection.tsx`, `web/src/features/credits/tabs/BuyCredits.tsx`, `web/src/features/invitations/InvitationsPage.tsx`, `web/src/features/operator/OrganizationsPage.tsx`, `web/src/features/operator/PartnersPage.tsx`, `web/src/features/operator/catalog/PackagesTab.tsx`, `web/src/features/operator/catalog/PricesTab.tsx`, `web/src/features/operator/catalog/bundles/BundlesTab.tsx`, `web/src/features/operator/catalog/products/ProductsTab.tsx`, `web/src/features/operator/contracts/ContractDetailPage.tsx`, `web/src/features/operator/contracts/ContractList.tsx`, `web/src/features/operator/installations/InstallationList.tsx`, `web/src/features/operator/licenses/LicenseList.tsx`, `web/src/features/operator/offers/OfferList.tsx`, `web/src/features/operator/payments/PaymentsPage.tsx`, `web/src/features/operator/staff/StaffPage.tsx`, `web/src/features/organizations/NoAccessPage.tsx`, `web/src/features/organizations/OrganizationsPage.tsx`, `web/src/features/partners/PartnersPage.tsx`, `web/src/features/partners/list/RelationshipList.tsx`, `web/src/features/products/licenses/LicensesSection.tsx`, `web/src/features/products/seats/ProductSeatsPage.tsx`, `web/src/features/session/ProfilePage.tsx`, `web/src/features/signin/GoogleConsentPage.tsx`, `web/src/features/signin/SignInTestPage.tsx`, `web/src/features/signin/detail/ConnectionPage.tsx`, `web/src/features/signin/detail/directory/GroupsTab.tsx`, `web/src/features/signin/detail/directory/PeopleTab.tsx`, `web/src/features/signin/list/SignInPage.tsx`, `web/src/features/signup/RequestAccess.tsx`, `web/src/shared/list/NoMatch.tsx`
- AI SOC (`ai-soc-platform`) (52): `web/src/features/access/admins/ProductAdmins.tsx`, `web/src/features/access/grants/Holders.tsx`, `web/src/features/access/roles/RolesList.tsx`, `web/src/features/access/support/SupportAccessList.tsx`, `web/src/features/apikeys/accounts/ServiceAccountPage.tsx`, `web/src/features/apikeys/accounts/ServiceAccounts.tsx`, `web/src/features/apikeys/keys/OrganizationKeys.tsx`, `web/src/features/apikeys/keys/PersonalKeys.tsx`, `web/src/features/assets/detail/AssetPage.tsx`, `web/src/features/assets/detail/AssetRedirect.tsx`, `web/src/features/assets/list/AssetsPage.tsx`, `web/src/features/audit/AuditPage.tsx`, `web/src/features/collection/list/SourcesPage.tsx`, `web/src/features/inbox/InboxBell.tsx`, `web/src/features/inbox/InboxPage.tsx`, `web/src/features/integrations/detail/DeliveriesSection.tsx`, `web/src/features/integrations/list/DestinationsPage.tsx`, `web/src/features/integrations/mapping/FieldTable.tsx`, `web/src/features/integrations/partner/CustomerRules.tsx`, `web/src/features/licensing/lifecycle/ExpiredMember.tsx`, `web/src/features/licensing/page/FeaturesSection.tsx`, `web/src/features/licensing/page/LicensesSection.tsx`, `web/src/features/licensing/seats/SeatRequired.tsx`, `web/src/features/org/OrgPicker.tsx`, `web/src/features/partners/cases/PartnerCasesPage.tsx`, `web/src/features/partners/channels/PartnerChannelScope.tsx`, `web/src/features/partners/inbox/PartnerInboxPage.tsx`, `web/src/features/partners/overview/CustomerTable.tsx`, `web/src/features/partners/reports/PartnerReportsPage.tsx`, `web/src/features/reports/download/MailedDownloadPage.tsx`, `web/src/features/reports/list/RunsList.tsx`, `web/src/features/reports/schedules/SchedulesList.tsx`, `web/src/features/settings/enrichment/EnrichmentSettings.tsx`, `web/src/features/settings/intel/IndicatorsSheet.tsx`, `web/src/features/settings/intel/TaxiiFeeds.tsx`, `web/src/features/sites/list/SitesPage.tsx`, `web/src/features/soc/actors/ActorsPage.tsx`, `web/src/features/soc/case/CaseDetailPage.tsx`, `web/src/features/soc/case/CaseGraphPage.tsx`, `web/src/features/soc/case/RelatedTab.tsx`, `web/src/features/soc/case/derivation/DerivationTab.tsx`, `web/src/features/soc/case/signals/SignalsTab.tsx`, `web/src/features/soc/case/story/StoryTab.tsx`, `web/src/features/soc/cases/CasesPage.tsx`, `web/src/features/soc/ui/LoadError.tsx`, `web/src/features/soc/ui/NotDerivedState.tsx`, `web/src/features/workspaces/WorkspaceLayout.tsx`, `web/src/features/workspaces/WorkspacesPage.tsx`, `web/src/features/workspaces/overview/DevicesPanel.tsx`, `web/src/features/workspaces/overview/SourcesPanel.tsx`, `web/src/shared/layout/ErrorState.tsx`, `web/src/shared/layout/NotFound.tsx`
- CVE Current (`di-seismograph`) (16): `web/e2e/account.spec.ts`, `web/src/features/account/AuditTrail.tsx`, `web/src/features/account/Keys.tsx`, `web/src/features/account/Page.tsx`, `web/src/features/account/Webhooks.tsx`, `web/src/features/account/notifications/History.tsx`, `web/src/features/catalog/Page.tsx`, `web/src/features/catalog/detail/Detail.tsx`, `web/src/features/catalog/directory/Directory.tsx`, `web/src/features/changes/ChangesEmpty.tsx`, `web/src/features/inventory/Page.tsx`, `web/src/features/overview/Page.tsx`, `web/src/features/records/Records.tsx`, `web/src/features/watches/WatchGate.tsx`, `web/src/features/watches/detail/DetailPage.tsx`, `web/src/features/watches/list/ListPage.tsx`

### `Spinner`, `AppLoader`, `SkeletonPage`, `SkeletonTable` → `Loading shape`

`SkeletonPage variant` becomes `shape`; `SkeletonTable` is `shape="table"` (add `index` when the table has a `TableIndex` column). `Loading` holds itself back for the first 150 ms by default (`delay={0}` shows it at once, as `Spinner` did). The type `SkeletonPageVariant` is `LoadingShape`. Classes `di-skeleton*`, `di-skp*` are gone.

```tsx
<Spinner label="Saving" />                      →  <Loading label="Saving" delay={0} />
<AppLoader label="Starting" />                  →  <Loading shape="app" label="Starting" />
<SkeletonPage variant="detail" label="Loading" /> →  <Loading shape="detail" label="Loading" />
<SkeletonTable rows={8} label="Loading" />      →  <Loading shape="table" index rows={8} label="Loading" />
```

Files to change:

- account-platform (32): `web/src/app/PagePending.tsx`, `web/src/app/SessionGate.tsx`, `web/src/features/billing/BillingPage.tsx`, `web/src/features/billing/CheckoutPage.tsx`, `web/src/features/billing/contracts/ContractPage.tsx`, `web/src/features/billing/offers/OfferPage.tsx`, `web/src/features/credits/CreditsPage.tsx`, `web/src/features/credits/tabs/BuyCredits.tsx`, `web/src/features/invitations/AcceptInvitationPage.tsx`, `web/src/features/operator/accounting/AccountingPage.tsx`, `web/src/features/operator/catalog/PackagesTab.tsx`, `web/src/features/operator/catalog/PricesTab.tsx`, `web/src/features/operator/catalog/bundles/BundlesTab.tsx`, `web/src/features/operator/catalog/meters/MetersTab.tsx`, `web/src/features/operator/catalog/products/ProductsTab.tsx`, `web/src/features/operator/contracts/ContractDetailPage.tsx`, `web/src/features/operator/offers/EditOfferPage.tsx`, `web/src/features/operator/offers/OfferDetailPage.tsx`, `web/src/features/operator/offers/form/PreviewPanel.tsx`, `web/src/features/organizations/OverviewPage.tsx`, `web/src/features/session/ProfilePage.tsx`, `web/src/features/session/StepUpComplete.tsx`, `web/src/features/settings/MailRelaySection.tsx`, `web/src/features/settings/SettingsPage.tsx`, `web/src/features/settings/TemplateEditor.tsx`, `web/src/features/settings/pages.tsx`, `web/src/features/signin/GoogleConsentPage.tsx`, `web/src/features/signin/SignInTestPage.tsx`, `web/src/features/signin/detail/ConnectionPage.tsx`, `web/src/features/signup/PricingView.tsx`, `web/src/features/signup/SignupPage.tsx`, `web/src/shared/list/CursorTable.tsx`
- AI SOC (`ai-soc-platform`) (46): `web/src/app/PagePending.tsx`, `web/src/app/SessionGate.tsx`, `web/src/features/access/admins/ProductAdmins.tsx`, `web/src/features/access/roles/RolesList.tsx`, `web/src/features/access/support/SupportAccessList.tsx`, `web/src/features/apikeys/accounts/ServiceAccountPage.tsx`, `web/src/features/assets/detail/AssetPage.tsx`, `web/src/features/assets/detail/AssetRedirect.tsx`, `web/src/features/assets/detail/HistorySection.tsx`, `web/src/features/collection/create/NewSourcePage.tsx`, `web/src/features/collection/detail/SourcePage.tsx`, `web/src/features/inbox/InboxBell.tsx`, `web/src/features/integrations/detail/DestinationPage.tsx`, `web/src/features/integrations/list/DestinationsPage.tsx`, `web/src/features/integrations/mapping/MappingEditor.tsx`, `web/src/features/licensing/page/LicensePage.tsx`, `web/src/features/org/OrgPicker.tsx`, `web/src/features/partners/overview/PartnerOverviewPage.tsx`, `web/src/features/partners/reports/ReportViewer.tsx`, `web/src/features/reports/list/RunStatusPill.tsx`, `web/src/features/reports/run/ReportFrame.tsx`, `web/src/features/reports/run/RunPage.tsx`, `web/src/features/reports/schedules/NewSchedulePage.tsx`, `web/src/features/reports/schedules/SchedulePage.tsx`, `web/src/features/session/StepUpComplete.tsx`, `web/src/features/settings/InstallationSettings.tsx`, `web/src/features/settings/SettingsGroups.tsx`, `web/src/features/settings/TemplateEditor.tsx`, `web/src/features/settings/enrichment/EnrichmentSettings.tsx`, `web/src/features/settings/intel/IndicatorsSheet.tsx`, `web/src/features/settings/intel/TaxiiFeeds.tsx`, `web/src/features/sites/list/SitesPage.tsx`, `web/src/features/soc/actors/ActorsPage.tsx`, `web/src/features/soc/case/CaseDetailPage.tsx`, `web/src/features/soc/case/RelatedTab.tsx`, `web/src/features/soc/case/derivation/DerivationTab.tsx`, `web/src/features/soc/case/mitre/MitreTab.tsx`, `web/src/features/soc/case/signals/SignalsTab.tsx`, `web/src/features/soc/case/story/StoryTab.tsx`, `web/src/features/soc/case/timeline/SignalSummary.tsx`, `web/src/features/soc/cases/CasesPage.tsx`, `web/src/features/workspaces/WorkspacesPage.tsx`, `web/src/features/workspaces/overview/HealthSection.tsx`, `web/src/features/workspaces/overview/SourcesPanel.tsx`, `web/src/features/workspaces/overview/WorkspaceOverview.tsx`, `web/src/shared/list/VirtualTable.tsx`
- CVE Current (`di-seismograph`) (19): `web/e2e/briefing.spec.ts`, `web/e2e/paging.spec.ts`, `web/src/app/Page.tsx`, `web/src/features/account/AuditTrail.tsx`, `web/src/features/account/Keys.tsx`, `web/src/features/account/Page.tsx`, `web/src/features/account/Webhooks.tsx`, `web/src/features/briefings/Items.tsx`, `web/src/features/briefings/Page.tsx`, `web/src/features/catalog/detail/Detail.tsx`, `web/src/features/catalog/directory/Directory.tsx`, `web/src/features/changes/Page.tsx`, `web/src/features/inventory/Page.tsx`, `web/src/features/mirror/Page.tsx`, `web/src/features/pricing/Page.tsx`, `web/src/features/records/Page.tsx`, `web/src/features/records/RecordDetail.tsx`, `web/src/features/watches/WatchGate.tsx`, `web/src/shared/paging/Pager.tsx`

### `Progress countTrack` removed

A count in words ("1 of 10 seats used") is a quota, not a wait: show it with `LevelMeter`. A `Progress` count is always in figures.

```tsx
<Progress id="seats" label="Seats" count="1 of 10 seats used" value={1} max={10} countTrack="prose" />
→
<LevelMeter label="Seats" value="1 of 10 used" percent={10} />
```

Files to change:

- account-platform (1): `web/src/features/products/licenses/SeatUse.tsx`
- AI SOC (`ai-soc-platform`) (4): `web/src/features/collection/detail/StatusSection.tsx`, `web/src/features/licensing/page/IngestAllowance.tsx`, `web/src/features/licensing/page/LimitsSection.tsx`, `web/src/features/settings/intel/UploadSection.tsx`
- CVE Current (`di-seismograph`) (1): `web/src/features/account/plan/Usage.tsx`

### `Notice size` removed

Drop `size`; a notice has one size, and density scales it.

Files to change: none.

### `Tooltip` wraps its trigger

`Tooltip` takes the trigger as its child and the words as `label`. A tooltip names a control; a fact that is nowhere else is not a tooltip (`TooltipTarget` for a term with its explanation).

```tsx
<Tooltip label="Copy"><Button variant="ghost" iconOnly aria-label="Copy"><Copy /></Button></Tooltip>
```

Files to change: none.

## Overlays

### `Sheet`, `SheetFooter` → `Dialog`, `DialogFooter`

`Dialog`'s default `placement="side"` is the sheet, docking included; the props are the same. `index` goes: name the record in `eyebrow`. Classes `di-sheet*` are `di-dialog*`.

```tsx
<Sheet open={open} onClose={close} title="Head office" eyebrow="Site" closeLabel="Close">
  {body}<SheetFooter>{buttons}</SheetFooter>
</Sheet>
→
<Dialog open={open} onClose={close} title="Head office" eyebrow="Site" closeLabel="Close">
  {body}<DialogFooter>{buttons}</DialogFooter>
</Dialog>
```

Files to change:

- account-platform (28): `web/src/features/audit/AuditSheet.tsx`, `web/src/features/billing/offers/DeclineSheet.tsx`, `web/src/features/invitations/InviteSheet.tsx`, `web/src/features/members/MemberSheet.tsx`, `web/src/features/operator/GrantCreditSheet.tsx`, `web/src/features/operator/billingProfile/BillingProfileSheet.tsx`, `web/src/features/operator/catalog/PackageSheet.tsx`, `web/src/features/operator/catalog/bundles/BundleSheet.tsx`, `web/src/features/operator/catalog/meters/MeterSheet.tsx`, `web/src/features/operator/catalog/products/DeclarationSheet.tsx`, `web/src/features/operator/contracts/InvoiceSheet.tsx`, `web/src/features/operator/contracts/SuspendSheet.tsx`, `web/src/features/operator/installations/AddInstallationSheet.tsx`, `web/src/features/operator/offers/OfflineAcceptanceSheet.tsx`, `web/src/features/operator/staff/InviteStaffSheet.tsx`, `web/src/features/operator/staff/StaffSheet.tsx`, `web/src/features/operator/tasks/OwnerInviteSheet.tsx`, `web/src/features/partners/create/ManagedOrganizationSheet.tsx`, `web/src/features/partners/create/RequestAccessSheet.tsx`, `web/src/features/partners/invitation/InvitePartnerSheet.tsx`, `web/src/features/partners/sheet/RelationshipSheet.tsx`, `web/src/features/products/licenses/InstallLicenseSheet.tsx`, `web/src/features/products/seats/AssignSeatSheet.tsx`, `web/src/features/signin/ScimTokenSheet.tsx`, `web/src/features/signin/detail/LdapSyncSheet.tsx`, `web/src/features/signin/detail/directory/GroupSheet.tsx`, `web/src/features/signin/detail/edit/AddCertificateSheet.tsx`, `web/src/features/signin/detail/edit/SecretSheet.tsx`
- AI SOC (`ai-soc-platform`) (34): `web/e2e/wide.e2e.ts`, `web/src/features/access/admins/AdminSheet.tsx`, `web/src/features/access/admins/AppointAdmin.tsx`, `web/src/features/access/grants/GrantAccess.tsx`, `web/src/features/access/grants/Holders.tsx`, `web/src/features/access/roles/NewRole.tsx`, `web/src/features/access/roles/RoleSheet.tsx`, `web/src/features/access/support/GrantSupport.tsx`, `web/src/features/access/support/SupportSheet.tsx`, `web/src/features/apikeys/accounts/CreateServiceAccount.tsx`, `web/src/features/apikeys/keys/IssueKey.tsx`, `web/src/features/apikeys/keys/KeyRowActions.tsx`, `web/src/features/assets/list/SavedViews.tsx`, `web/src/features/audit/AuditExport.tsx`, `web/src/features/audit/AuditPage.tsx`, `web/src/features/cases/detail/AccessPanel.tsx`, `web/src/features/cases/evidence/EvidenceSheet.tsx`, `web/src/features/inbox/InboxPreferences.tsx`, `web/src/features/integrations/mapping/FieldSheet.tsx`, `web/src/features/licensing/page/SupportSheet.tsx`, `web/src/features/partners/reports/NewReportSheet.tsx`, `web/src/features/partners/reports/ReportViewer.tsx`, `web/src/features/reports/generate/GenerateSheet.tsx`, `web/src/features/reports/run/ShareSheet.tsx`, `web/src/features/settings/enrichment/ProviderSheet.tsx`, `web/src/features/settings/intel/FeedSheet.tsx`, `web/src/features/settings/intel/IndicatorsSheet.tsx`, `web/src/features/sites/actions/NewEnrollmentToken.tsx`, `web/src/features/sites/actions/RenameSite.tsx`, `web/src/features/sites/enroll/AddSite.tsx`, `web/src/features/sites/list/SitesPage.tsx`, `web/src/features/soc/case/signals/SignalSheet.tsx`, `web/src/features/soc/case/timeline/SignalSheet.tsx`, `web/src/features/workspaces/NewWorkspace.tsx`
- CVE Current (`di-seismograph`) (10): `web/src/app/App.tsx`, `web/src/features/account/Keys.tsx`, `web/src/features/account/Page.tsx`, `web/src/features/account/WebhookAccess.tsx`, `web/src/features/account/notifications/CreateChannel.tsx`, `web/src/features/account/notifications/Detail.tsx`, `web/src/features/briefings/Page.tsx`, `web/src/features/records/RecordDetail.tsx`, `web/src/features/watches/Editor.tsx`, `web/src/shared/controls/Filters.tsx`

### `Modal` and its parts → `Dialog placement="center"`

The title, eyebrow and lede are props; the body is the children; the actions go in `DialogFooter`. The icon column (`ModalIcon`) goes. For a destructive confirmation use `ConfirmDialog`.

```tsx
<Modal open={open} onClose={close} labelledBy="t">
  <ModalFrame><ModalContent>
    <ModalTitle id="t" eyebrow="Export">Export 40 entries?</ModalTitle>
    <ModalBody>The file is signed.</ModalBody>
    <ModalFooter>{buttons}</ModalFooter>
  </ModalContent></ModalFrame>
</Modal>
→
<Dialog placement="center" open={open} onClose={close} eyebrow="Export" title="Export 40 entries?">
  <p>The file is signed.</p>
  <DialogFooter>{buttons}</DialogFooter>
</Dialog>
```

Files to change:

- account-platform (2): `web/src/features/legal/LegalDialog.tsx`, `web/src/features/session/StepUpDialog.tsx`
- AI SOC (`ai-soc-platform`) (5): `web/src/features/cases/detail/MergeDialog.tsx`, `web/src/features/cases/detail/SplitDialog.tsx`, `web/src/features/reports/run/DeleteRun.tsx`, `web/src/features/session/StepUpDialog.tsx`, `web/src/features/workspaces/DeletedWorkspaces.tsx`
- CVE Current (`di-seismograph`) (1): `web/src/app/palette/Palette.tsx`

## Navigation

### `Stepper` → `Steps variant="progress"`

```tsx
<Stepper label="Setup" steps={steps} stateLabels={words} onStep={go} />
→
<Steps variant="progress" label="Setup" stateLabels={words} onStep={go}>
  {steps.map((s) => <Step key={s.label} state={s.state} title={s.label} />)}
</Steps>
```

Files to change:

- account-platform (1): `web/src/features/signin/detail/ConnectionPage.tsx`

### `Numbered` → `Steps variant="list"`

One list for the whole run, not one `Numbered` per step. `variant="step"` is `tone="tonal"`, `variant="row"` is `tone="ruled"`. Classes `di-numbered*` are `di-step-row*`.

```tsx
{steps.map((s, i) => <Numbered key={s} index={String(i + 1)} variant="row">{s}</Numbered>)}
→
<Steps variant="list" tone="ruled">
  {steps.map((s, i) => <Step key={s} index={String(i + 1)}>{s}</Step>)}
</Steps>
```

Files to change:

- AI SOC (`ai-soc-platform`) (2): `web/src/features/collection/create/AzureOnboarding.tsx`, `web/src/features/collection/create/StreamingGuide.tsx`

### `Stage`, `StageTrack`, `StageIcon`, `StageFooter` → `Steps variant="cards"`

```tsx
<StageTrack><Stage step="01" title="Connect" body="A source is reached." current /></StageTrack>
→
<Steps variant="cards"><Step index="01" title="Connect" state="current">A source is reached.</Step></Steps>
```

Files to change: none.

### `CommandChip` → `Tag mono`

`state="active"` is `pressed`, `"suggested"` is `inferred`, `onSelect` is `onClick`.

```tsx
<CommandChip state="active" onSelect={drop}>assets</CommandChip>  →  <Tag mono pressed onClick={drop}>assets</Tag>
```

Files to change: none.

### `CommandRow active` removed; rows are options

The bar highlights its rows itself (the first, then the arrow keys and the pointer): drop `active`. A row is a `div role="option"`, not a button, so tests query `getByRole("option")`; the field is `getByRole("combobox")`. The bar handles Up, Down, Home, End and Enter in its field, so a product's own handler that moved focus into the rows goes. Use `CommandEmpty` for "no results".

Files to check:

- CVE Current (`di-seismograph`) (1): `web/src/app/palette/Palette.tsx`

## Layout

### `FieldStack` → `Stack variant="form"`

```tsx
<FieldStack>{fields}</FieldStack>  →  <Stack variant="form">{fields}</Stack>
```

Files to change:

- account-platform (42): `web/src/features/billing/offers/DeclineSheet.tsx`, `web/src/features/invitations/InviteSheet.tsx`, `web/src/features/legal/LegalDialog.tsx`, `web/src/features/operator/GrantCreditSheet.tsx`, `web/src/features/operator/billingProfile/BillingProfileSheet.tsx`, `web/src/features/operator/catalog/PackageSheet.tsx`, `web/src/features/operator/catalog/PricingEditor.tsx`, `web/src/features/operator/catalog/bundles/BundleSheet.tsx`, `web/src/features/operator/catalog/meters/MeterSheet.tsx`, `web/src/features/operator/catalog/products/DeclarationSheet.tsx`, `web/src/features/operator/catalog/products/DimensionFields.tsx`, `web/src/features/operator/catalog/products/LabelsFields.tsx`, `web/src/features/operator/catalog/products/ServiceFields.tsx`, `web/src/features/operator/catalog/products/TermFields.tsx`, `web/src/features/operator/contracts/InvoiceSheet.tsx`, `web/src/features/operator/contracts/SuspendSheet.tsx`, `web/src/features/operator/installations/AddInstallationSheet.tsx`, `web/src/features/operator/licenses/ProductsEditor.tsx`, `web/src/features/operator/licenses/issue/ContentsStep.tsx`, `web/src/features/operator/licenses/issue/HolderStep.tsx`, `web/src/features/operator/licenses/issue/ValidityStep.tsx`, `web/src/features/operator/offers/OfflineAcceptanceSheet.tsx`, `web/src/features/operator/offers/form/CustomerSection.tsx`, `web/src/features/operator/offers/form/PaymentSection.tsx`, `web/src/features/operator/offers/form/TermSection.tsx`, `web/src/features/operator/offers/form/lines/BundlesSection.tsx`, `web/src/features/operator/offers/form/lines/ItemsSection.tsx`, `web/src/features/operator/offers/form/lines/PacksSection.tsx`, `web/src/features/operator/offers/form/lines/ProductSection.tsx`, `web/src/features/operator/offers/form/lines/ServicesSection.tsx`, `web/src/features/operator/staff/InviteStaffSheet.tsx`, `web/src/features/organizations/CreateOrganizationForm.tsx`, `web/src/features/partners/create/ManagedOrganizationSheet.tsx`, `web/src/features/partners/create/RequestAccessSheet.tsx`, `web/src/features/partners/invitation/InvitePartnerSheet.tsx`, `web/src/features/products/licenses/InstallLicenseSheet.tsx`, `web/src/features/products/seats/AssignSeatSheet.tsx`, `web/src/features/signin/detail/LdapSyncSheet.tsx`, `web/src/features/signin/detail/directory/GroupSheet.tsx`, `web/src/features/signin/detail/edit/AddCertificateSheet.tsx`, `web/src/features/signin/detail/edit/SecretSheet.tsx`, `web/src/features/signup/CompleteSignupForm.tsx`
- AI SOC (`ai-soc-platform`) (8): `web/src/features/access/admins/AppointAdmin.tsx`, `web/src/features/access/grants/GrantAccess.tsx`, `web/src/features/access/roles/NewRole.tsx`, `web/src/features/access/support/GrantSupport.tsx`, `web/src/features/apikeys/accounts/CreateServiceAccount.tsx`, `web/src/features/apikeys/keys/IssueKey.tsx`, `web/src/features/cases/detail/AccessPanel.tsx`, `web/src/features/workspaces/NewWorkspace.tsx`
- CVE Current (`di-seismograph`) (1): `web/src/features/account/Keys.tsx`

### `InlineForm` → `Toolbar fillFirst`

Classes `di-inline-form*` are gone.

```tsx
<InlineForm>{field}{button}</InlineForm>  →  <Toolbar fillFirst>{field}{button}</Toolbar>
```

Files to change:

- account-platform (3): `web/src/features/operator/OwnerInviteForm.tsx`, `web/src/features/partners/sheet/StaffSection.tsx`, `web/src/features/signin/detail/DomainsSection.tsx`

### `DangerZone` → `Panel tone="danger"`

```tsx
<DangerZone title="Danger zone" lede="These cannot be undone.">{dangerActions}</DangerZone>
→
<Panel tone="danger" title="Danger zone" heading={2}>
  <PanelLead>These cannot be undone.</PanelLead>
  {dangerActions}
</Panel>
```

Files to change:

- account-platform (6): `web/src/features/members/MemberSheet.tsx`, `web/src/features/operator/licenses/RevokeLicense.tsx`, `web/src/features/operator/staff/StaffSheet.tsx`, `web/src/features/organizations/OrganizationDangerZone.tsx`, `web/src/features/partners/sheet/RelationshipSheet.tsx`, `web/src/features/signin/detail/ConnectionDangerZone.tsx`
- AI SOC (`ai-soc-platform`) (9): `web/src/features/access/admins/AdminSheet.tsx`, `web/src/features/access/roles/RoleSheet.tsx`, `web/src/features/access/support/SupportSheet.tsx`, `web/src/features/apikeys/accounts/ServiceAccountPage.tsx`, `web/src/features/collection/detail/DangerSection.tsx`, `web/src/features/integrations/detail/DangerSection.tsx`, `web/src/features/reports/run/RunPage.tsx`, `web/src/features/settings/intel/FeedSheet.tsx`, `web/src/features/workspaces/settings/DeleteWorkspace.tsx`
- CVE Current (`di-seismograph`) (1): `web/src/features/account/notifications/Detail.tsx`

### `SectionTitle`, `SectionTitleHeading`, `SectionTitleMeta` → `PageHeader level={2}`

The same `eyebrow`, `lede` and `tier`. The title follows the header's `level`.

```tsx
<SectionTitle eyebrow="Usage"><SectionTitleHeading>Credits</SectionTitleHeading><SectionTitleMeta>{meta}</SectionTitleMeta></SectionTitle>
→
<PageHeader level={2} eyebrow="Usage"><PageHeaderTitle>Credits</PageHeaderTitle><PageHeaderMeta>{meta}</PageHeaderMeta></PageHeader>
```

Files to change:

- account-platform (2): `web/src/features/organizations/overview/Dashboard.tsx`, `web/src/features/signup/ProductPlans.tsx`
- AI SOC (`ai-soc-platform`) (3): `web/src/features/settings/intel/TaxiiFeeds.tsx`, `web/src/features/sites/list/SitesPage.tsx`, `web/src/shared/layout/Section.tsx`
- CVE Current (`di-seismograph`) (4): `web/src/features/catalog/detail/Detail.tsx`, `web/src/features/catalog/directory/Directory.tsx`, `web/src/features/overview/SignalPanel.tsx`, `web/src/features/records/Records.tsx`

### `Accordion`, `AccordionItem`, `AccordionDetail`, `AccordionMeta` → `DisclosureGroup`, `Disclosure toggle="head"`

```tsx
<Accordion label="Rules"><AccordionItem title="Network" open={o} onOpenChange={set}>{body}</AccordionItem></Accordion>
→
<DisclosureGroup label="Rules"><Disclosure toggle="head" title="Network" open={o} onOpenChange={set}>{body}</Disclosure></DisclosureGroup>
```

Files to change: none.

### `Disclosure meta` → a `DisclosureMeta` child

The meta slot takes nodes. `id`, `open`, `onOpenChange` and `toggleLabel` are optional now.

```tsx
<Disclosure title="Fields" meta="12 fields" …>{body}</Disclosure>
→
<Disclosure title="Fields" …><DisclosureMeta>12 fields</DisclosureMeta>{body}</Disclosure>
```

Files to change:

- AI SOC (`ai-soc-platform`) (2): `web/src/features/collection/create/AzureOnboarding.tsx`, `web/src/features/integrations/rules/KindsPicker.tsx`
- CVE Current (`di-seismograph`) (4): `web/src/features/briefings/Evidence.tsx`, `web/src/features/briefings/Themes.tsx`, `web/src/features/inventory/results/Skipped.tsx`, `web/src/features/inventory/results/Unconfirmed.tsx`

### `Panel index`, `indexSize`, `indexTone`, `indexRule` and `surface="grid"` removed

A panel carries no number of its own: drop the index props, and the props a product added to pass an index through to its panels. A real sequence is `Steps`. `surface` is `sheet`, `inset` or `hero`; `grid` goes. A `PanelFooter` is a row inside the surface, not a band: re-check layouts that compensated for the band.

```tsx
<Panel index="02" title="Seats">…</Panel>  →  <Panel title="Seats">…</Panel>
```

Files to change:

- account-platform (5): `web/src/features/operator/catalog/products/DimensionFields.tsx`, `web/src/features/operator/catalog/products/ServiceFields.tsx`, `web/src/features/operator/catalog/products/TermFields.tsx`, `web/src/features/operator/offers/form/license/LicenseTuning.tsx`, `web/src/features/operator/offers/form/lines/ProductSection.tsx`
- AI SOC (`ai-soc-platform`) (3): `web/src/features/soc/actors/ActorBrief.tsx`, `web/src/features/soc/case/story/StoryGroupPanel.tsx`, `web/src/features/soc/case/story/StoryTab.tsx`

### `Hero`, `HeroAside`, `HeroLead`, `HeroVisual`, `HeroFooter` → `Panel surface="hero"`

Added and merged during 0.11; no release carried it. `HeroAside` is `PanelActions`, `HeroLead` `PanelFigure`, `HeroVisual` `PanelVisual`, `HeroFooter` `PanelFooter`.

```tsx
<Hero label="Exposure" title="Seven days">{…}</Hero>  →  <Panel surface="hero" label="Exposure" title="Seven days" heading={2}>{…}</Panel>
```

Files to change: none.

### `ListDetail` and its parts → `Split variant="list"`

Added and merged during 0.11; no release carried it. `ListDetailList` is `SplitList`, `ListDetailHead` `SplitListHead`, `ListDetailItems` `SplitListItems`, `ListDetailItem` `SplitListItem`, `ListDetailPane` `SplitMain label`, `ListDetailBack` `SplitBack`.

```tsx
<ListDetail showing={view}>…<ListDetailPane label="Case">{record}</ListDetailPane></ListDetail>
→
<Split variant="list" showing={view}>…<SplitMain label="Case">{record}</SplitMain></Split>
```

Files to change: none.

### `PageHeaderTitle level` → `PageHeader level`

Added and removed during 0.11. The title follows its header: an h1 in a `PageHeader`, an h2 in a `PageHeader level={2}`.

```tsx
<PageHeader><PageHeaderTitle level={2}>Case 4</PageHeaderTitle></PageHeader>
→
<PageHeader level={2}><PageHeaderTitle>Case 4</PageHeaderTitle></PageHeader>
```

Files to change: none.

### Page, DetailSection and toolbars

A `Page` outside `AppShellContent` has the shell's padding, so a product's own padding wrapper around it goes. `DetailSection` is inset 24 (16 on a phone) and has no frame inside a `Dialog` or `Panel`. `--di-sticky-top` is `0px` outside the shell; a product with its own sticky bar sets it on its content.


## Charts

### `ChartCard`, `ChartCardAction`, `ChartCardGrid` → `Panel`, `Figure`, `Grid`

A dashboard figure is a `Panel` with a compact `Figure` in `PanelFigure`, the chart in `PanelVisual` and the link in `PanelActions`; the cards sit in a `Grid`.

```tsx
<ChartCardGrid>
  <ChartCard title="Credits" figure="182.5" note="this month"><ChartCardAction>{link}</ChartCardAction>{chart}</ChartCard>
</ChartCardGrid>
→
<Grid min="360px" gap={16}>
  <Panel title="Credits" heading={3}>
    <PanelActions>{link}</PanelActions>
    <PanelFigure><Figure size="compact" label="Credits" value="182.5">this month</Figure></PanelFigure>
    <PanelVisual>{chart}</PanelVisual>
  </Panel>
</Grid>
```

Files to change:

- account-platform (7): `web/src/features/credits/tabs/BalanceChart.tsx`, `web/src/features/credits/tabs/UsageChart.tsx`, `web/src/features/organizations/overview/Dashboard.tsx`, `web/src/features/organizations/overview/PeopleCard.tsx`, `web/src/features/organizations/overview/RecentEventsCard.tsx`, `web/src/features/organizations/overview/SeatsCard.tsx`, `web/src/features/organizations/overview/TimelineCard.tsx`

### `Bars` → `Sparkline width="fill"`

```tsx
<Bars values={v} highlight={6} startLabel="Mon" midLabel="Thu" endLabel="Sun" />
→
<Sparkline values={v} highlight={6} label="Mon to Sun" width="fill" height="md" captions={["Mon", "Thu", "Sun"]} />
```

Files to change: none.

## Timelines

### `WeekTimeline`, `WeekTimelineRow` → `PeriodTimeline` in minutes

```tsx
<WeekTimeline rows={days} summary="Quiet hours" />
→
<PeriodTimeline label="Quiet hours" summary="Quiet hours" from={0} to={1440}
  rows={days.map((d) => ({ id: d.label, label: d.label, spans: d.spans.map((s) => ({ start: s.from, end: s.to, tone: "ok" })) }))}
  ticks={["00", "06", "12", "18", "24"].map((label, i) => ({ at: i * 360, label }))} />
```

Files to change:

- AI SOC (`ai-soc-platform`) (1): `web/src/features/integrations/rules/QuietHoursEditor.tsx`

### `PeriodTimeline periods`, `today`, `todayLabel` → `rows`, `marker`

One row per period with one span; today is the `marker`. Without `marker` no today line is drawn (the old path defaulted to now). The type `Period` is gone: use `PeriodRow` and `PeriodSpan`.

```tsx
<PeriodTimeline label="Licences" periods={[{ id, label, start, end, tone, caption }]} today={now} todayLabel="Today" />
→
<PeriodTimeline label="Licences" rows={[{ id, label, caption, spans: [{ start, end, tone }] }]} marker={{ at: now, label: "Today" }} />
```

Files to change:

- account-platform (1): `web/src/features/organizations/overview/TimelineCard.tsx`

### `TimelineSummary` marks every row

Every episode row shows its `SeverityMark` in an end column; the head shows none, and the blocks have no grey ground. The props stay; a `scaleNote` that speaks of the "pale ground" should say "base line".

Files to check:

- AI SOC (`ai-soc-platform`) (1): `web/src/features/soc/case/timeline/SignalSummary.tsx`

## Shell

### `AppShellBarEnd moreLabel` is required

On a narrow bar the end items fold into one overflow button; `moreLabel` is its name.

```tsx
<AppShellBarEnd>{status}</AppShellBarEnd>  →  <AppShellBarEnd moreLabel="More">{status}</AppShellBarEnd>
```

Files to change:

- AI SOC (`ai-soc-platform`) (2): `web/src/app/OrgShell.tsx`, `web/src/app/PartnerShell.tsx`
- CVE Current (`di-seismograph`) (1): `web/src/app/App.tsx`

### `AppShell`, `AppShellRail`, `AppShellMain`, `AppShellFoot`, `AppShellContext`, `NavGroup`, `NavItem` removed

The frame is `SidebarProvider` with the `Sidebar`, then `SidebarInset` holding `AppShellBar` and `AppShellContent`. `SidebarBrand` goes first in `SidebarHeader`. `SignIn` follows the theme.

Files to change: none.

## Storybook groups

The sidebar has fourteen groups, one folder each in `src/components`: Actions, Forms, Tables, Records, Figures, Text, Status, Feedback, Charts, Timelines, Layout, Navigation, Overlays, Shell. Imports from the package do not change. Story titles and ids do, so a link to a story changes where its group did (the id is the title in lower case with `-` for `/`, then `--` and the story):

| Old title | New title |
| --- | --- |
| `Data/Table/*` | `Tables/*` |
| `Data/Records/*`, `Marks/IconTile` | `Records/*` |
| `Data/Figures/*` | `Figures/*` |
| `Marks/Badge`, `Marks/Tag`, `Marks/Status/*` | `Status/*` |
| `Marks/Icon`, `Navigation/TextLink` | `Text/Icon`, `Text/TextLink` |
| `Text/CodeBlock`, `Text/PullQuote`, `Text/TickRule` | `Text/Blocks/*` |
| `Feedback/Waiting/*` | `Feedback/*` |
| `Feedback/Tooltip`, `Feedback/TooltipTarget` | `Overlays/*` |
| `Navigation/Menu` | `Actions/Menu` |
| `Overlays/CreateFlow` | `Forms/CreateFlow` |
| `Navigation/Views/*`, `Navigation/Sequence/*` | `Navigation/*` |
| `Layout/Arrangement/*`, `Layout/Panes/Split`, `Layout/Folding/Disclosure` | `Layout/Arrange/*` |
| `Charts/Time/*`, `Charts/Compare/*` | `Charts/*` |
| `Timeline/*` | `Timelines/*` |

Files to change: none.

## Product notes

### Mail layouts set IBM Plex Sans

The interface face is IBM Plex Sans; Space Grotesk is for headings and figures only. The mail layouts' `fontUI` stack follows: `'IBM Plex Sans','Helvetica Neue',Helvetica,Arial,sans-serif`.

Files to change:

- account-platform (2): `sdk/mailtemplate/palette.go`, `web/src/mocks/mailLayout.ts`
- AI SOC (`ai-soc-platform`) (1): `web/src/mocks/mailLayout.ts`

## Tokens and classes

### Removed tokens

`--di-focus-halo`, `--di-seal-bg`, `--di-status-ok-on-navy`, `--di-signal`, `--di-signal-ink`, `--di-signal-tint`, `--di-danger-700`, `--di-navy-200`, `--di-chart-card-min`, the 0.10 surface and height tokens (`--di-card-*`, `--di-bg-grid`, `--di-grid`, `--di-h-ctl`, `--di-h-dense`, `--di-h-comfort`, `--di-h-row`, `--di-index-col-sm`, `--di-panel-index-bg`) and the 0.10 primitives `--di-ink`, `--di-ivory`, `--di-paper`, `--di-sheet`, `--di-sunken`, `--di-wash`, `--di-navy-50`, `--di-rule-*`, `--di-warn-*`, `--di-night-*`. Bind to a semantic role instead (`--di-bg-*`, `--di-text-*`, `--di-border-*`, `--di-status-*`, `--di-select`, `--di-focus-ring-color`). `--di-sb-brand-h` is `--di-sb-mark-h`.

Files to change: none.

### Class names a product queries

Classes of the removed components are gone with them (`di-stat-*`, `di-stat-tile*`, `di-empty*`, `di-skeleton*`, `di-skp*`, `di-list-toolbar`, `di-sheet*`, `di-modal*`, `di-chip*`, `di-privacy`, `di-numbered*`, `di-stage*`, `di-stepper`). The combobox's `di-combobox-label` and `di-combobox-value` went with the shared field frame. Tests and product CSS that select these change to roles and accessible names, or to the new class.

Files to change:

- AI SOC (`ai-soc-platform`) (4): `web/e2e/partner-tiles.e2e.ts`, `web/e2e/wide.e2e.ts`, `web/src/features/integrations/mapping/CelField.tsx`, `web/src/shared/layout/TileLink.css`
- CVE Current (`di-seismograph`) (8): `web/e2e/account.spec.ts`, `web/e2e/briefing.spec.ts`, `web/e2e/drawer.spec.ts`, `web/e2e/layout/checks.ts`, `web/e2e/paging.spec.ts`, `web/e2e/watches.spec.ts`, `web/src/app/app.css`, `web/src/features/briefings/briefing.css`

## Other changes in look and behaviour

None of these needs a code change to compile. Check the screens that use them.

- **Actions.** `CopyValue`'s button has no hover border and sits on the value's first line. `Kbd` inside a button is a tonal ground without a border.
- **Forms.** No option has a solid cornflower background any more: a chosen segment is a quiet raised thumb, a chosen toggle or calendar day the primary ink (`--di-choice-on-bg`); selection elsewhere keeps the pale tint (`--di-bg-selected`) with the cornflower edge, and `ComboBox` and `Select` mark their current value in the list. `ChoiceGroup` takes `hint`, `hintTone` and `required`; its legend sits 6px above the options, its cards grid has at most three columns, and its native inputs carry `di-choice-cover` instead of `di-sr`. `MultiComboBox` closes its list on Tab, and Escape on a closed list no longer clears it. Calendar, range and typed-segment selection is cornflower. `Switch` uses the choice classes (`di-choice-label`, `di-choice-desc`); `di-switch-control`, `-text`, `-title`, `-desc` are gone.
- **Data.** `RecordValue` wraps a string value with break points and aligns its icon to the first line. `Distribution` rows are `LevelMeter`s (`di-distribution-track` and `-fill` are gone). `CoverageMatrix` marks have no border and its columns are at most 128px wide. `LevelMeter` takes `segments="continuous"`, `tone` and `valueText`. A `DataTable` toolbar row wraps.
- **Marks and text.** `SeverityMark`'s word is regular weight at every level. `CodeBlock` is `div.di-codeblock > pre.di-codeblock-scroll > code`; `className` stays on the outer `div`. `Eyebrow` and `PullQuote` hyphenate long words, so set `lang` on the page. `Tag` takes nodes as children.
- **Feedback.** `Toast` body is in the reading face; on a phone its action drops under the copy. `Tooltip` sits 12px from its trigger and points at it. Notice titles are in the display face.
- **Overlays.** One dialog for side, centre and bottom placements, with one width ramp (`sm` 400, `md` 480, `lg` 760, `xl` 1120px); the head, inset, close button and scrim are shared. `ConfirmDialog` takes an `eyebrow`, `consequences` and a `tone` (`danger` or `neutral`).
- **Navigation.** `Breadcrumb` is set in the reading face, never wraps and shows only the current page at 600px or less; `maxItems` and `collapseLabel` fold the middle. `Pagination` shows at most seven slots. A `Menu` item that is chosen has no tint, and group captions are mono capitals. On a phone a spread `Steps variant="progress"` sets out inline.
- **Layout.** `Disclosure` is an inset group without a border or head rule. `PanelLead` adds 12px below itself when something follows. A toolbar with `align` wraps on a phone instead of stacking at full width.
- **Charts and timelines.** Chart gridlines are solid; `TrendChart`'s right margin follows its last label and a legend adds 48px; `Seismograph` uses round count ticks. `EventTimeline` with a `score` is narrower by a gutter for the scale, and with `markers` its bars start 18px lower; lane cells show intensity by height; `TimelineInstruction` takes an optional `pointer` (`"fine"` or `"coarse"`) so a phone does not list mouse gestures. `ChainTimeline` lanes follow density. `PeriodTimeline`'s today label is in the text ink. `EventTimelineReadout` has no `is-flipped` class.
- **Shell.** `AppShellBar` is one row high and folds its end items into the overflow button; its start items sit in `.di-topbar-start`. `SidebarBrand` goes first in `SidebarHeader`. `SignIn` follows the theme.
- **Tokens.** The focus ring has its own tokens (`--di-focus-ring-*`); a region re-colours focus with `--di-focus-ring-color`. `--di-field-height` is 40px and input text 16px on a touch screen; `--di-field-radius` is 6px. Read-only fields use `--di-bg-readonly`. `--di-option-hover-bg` equals `--di-row-hover-bg`. Native checkboxes, radios and ranges take `accent-color` from the tokens.
