import { Braces, ChartColumn, Check, Clock, FileText, Search, Shield, Waypoints } from "lucide-react";
import { Icon } from "../../components/Icon";

const vocabulary = [
  { meaning: "Search", name: "Search", icon: Search, cited: false },
  { meaning: "Series", name: "ChartColumn", icon: ChartColumn, cited: false },
  { meaning: "Replay", name: "Clock", icon: Clock, cited: false },
  { meaning: "Source", name: "FileText", icon: FileText, cited: false },
  { meaning: "Graph", name: "Waypoints", icon: Waypoints, cited: false },
  { meaning: "Cited", name: "Check", icon: Check, cited: true },
  { meaning: "Audit", name: "Shield", icon: Shield, cited: false },
  { meaning: "Bracket", name: "Braces", icon: Braces, cited: false },
] as const;

export function IconSet() {
  return (
    <ul className="di-icon-catalog">
      {vocabulary.map((item) => {
        const Glyph = item.icon;
        return (
          <li key={item.meaning}>
            <Icon cited={item.cited}>
              <Glyph />
            </Icon>
            <strong>{item.meaning}</strong>
            <span>{item.name}</span>
          </li>
        );
      })}
    </ul>
  );
}
