import { Ellipsis } from "lucide-react";
import { useState } from "react";
import { ChoiceGroup } from "../../forms/choice/ChoiceGroup";
import { SearchField } from "../../forms/text/SearchField";
import { Select } from "../../forms/select/Select";
import { TextField } from "../../forms/text/TextField";
import { Menu, MenuItem } from "../Menu";
import { Button } from "../Button";
import { FilterBar, FilterBarEnd, FilterBarItem, FilterBarSheet, type FilterBarProps } from "./FilterBar";

export type Criteria = { q: string; severity: string; owner: string; view: string; tag: string };

const idFor = (id: string, place: string) => (place === "sheet" ? `${id}-sheet` : id);

/** A list's filters: the search, two selects and a quick view inline, a tag only in the sheet. */
export function CaseFilterBar({
  initial = { q: "", severity: "", owner: "", view: "", tag: "" },
  sheet = "complete",
}: {
  initial?: Criteria;
  sheet?: FilterBarProps["sheet"];
}) {
  const [criteria, setCriteria] = useState(initial);
  const [draftTag, setDraftTag] = useState(initial.tag);
  const [menu, setMenu] = useState(false);
  const set = (patch: Partial<Criteria>) => setCriteria((current) => ({ ...current, ...patch }));
  return (
    <FilterBar
      label="Filter cases"
      filtersLabel="Filters"
      countLabel={(n) => `Filters, ${n} set`}
      closeLabel="Close"
      doneLabel="Show results"
      clearLabel="Clear all"
      count={criteria.tag ? 1 : 0}
      sheet={sheet}
      onOpen={() => setDraftTag(criteria.tag)}
      onApply={() => set({ tag: draftTag })}
      onClear={() => {
        setCriteria({ q: "", severity: "", owner: "", view: "", tag: "" });
        setDraftTag("");
      }}
    >
      <FilterBarItem name="search" keep grow>
        {(place) => (
          <SearchField
            id={idFor("case-search", place)}
            size="sm"
            label="Search cases"
            value={criteria.q}
            onChange={(event) => set({ q: event.target.value })}
          />
        )}
      </FilterBarItem>
      <FilterBarItem name="severity" active={criteria.severity !== ""}>
        {(place) => (
          <Select
            id={idFor("case-severity", place)}
            label="Severity"
            hideLabel={place === "bar"}
            value={criteria.severity}
            onChange={(event) => set({ severity: event.target.value })}
          >
            <option value="">Any severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
          </Select>
        )}
      </FilterBarItem>
      <FilterBarItem name="owner" active={criteria.owner !== ""}>
        {(place) => (
          <Select
            id={idFor("case-owner", place)}
            label="Owner"
            hideLabel={place === "bar"}
            value={criteria.owner}
            onChange={(event) => set({ owner: event.target.value })}
          >
            <option value="">Anyone</option>
            <option value="me">Assigned to me</option>
            <option value="none">Unassigned</option>
          </Select>
        )}
      </FilterBarItem>
      <FilterBarItem name="view" active={criteria.view !== ""}>
        {(place) => (
          <ChoiceGroup
            appearance="segments"
            name={idFor("case-view", place)}
            legend="Show"
            hideLegend={place === "bar"}
            options={[
              { value: "", label: "All" },
              { value: "open", label: "Open" },
              { value: "waiting", label: "Waiting" },
              { value: "closed", label: "Closed" },
            ]}
            value={criteria.view}
            onChange={(view: string) => set({ view })}
          />
        )}
      </FilterBarItem>
      <FilterBarSheet>
        <TextField id="case-tag" label="Tag" value={draftTag} onChange={(event) => setDraftTag(event.target.value)} />
      </FilterBarSheet>
      <FilterBarEnd>
        <Menu
          open={menu}
          onOpenChange={setMenu}
          label="More actions"
          align="end"
          trigger={(props) => (
            <Button variant="secondary" size="sm" iconOnly aria-label="More actions" {...props}>
              <Ellipsis aria-hidden />
            </Button>
          )}
        >
          <MenuItem onSelect={() => setMenu(false)}>Save this view</MenuItem>
        </Menu>
      </FilterBarEnd>
    </FilterBar>
  );
}
