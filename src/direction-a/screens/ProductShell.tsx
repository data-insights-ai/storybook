import type { ReactNode } from "react";
import {
  ArrowLeft,
  Bell,
  Boxes,
  Building2,
  CreditCard,
  FileText,
  Gauge,
  KeyRound,
  LogOut,
  Mail,
  Package,
  Radar,
  Send,
  Settings,
  ShieldCheck,
  Swords,
  UserRound,
  Users,
  Wallet,
  Waypoints,
  ScrollText,
} from "lucide-react";
import {
  AppShellBar,
  AppShellContent,
  Breadcrumb,
  Sidebar,
  SidebarBrand,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "../../index";
import type { Role } from "./portal.sample";
import "./brand.css";

type Item = { id: string; label: string; icon: ReactNode; badge?: string; roles?: Role[] };

const soc: Item[] = [
  { id: "overview", label: "Overview", icon: <Gauge /> },
  { id: "cases", label: "Cases", icon: <FileText />, badge: "3" },
  { id: "actors", label: "Threat actors", icon: <Swords /> },
  { id: "assets", label: "Assets", icon: <Boxes /> },
  { id: "reports", label: "Reports", icon: <ScrollText /> },
  { id: "sources", label: "Sources", icon: <Radar /> },
  { id: "notifications", label: "Notifications", icon: <Bell /> },
  { id: "siem", label: "SIEM export", icon: <Send /> },
  { id: "access", label: "Access", icon: <ShieldCheck /> },
  { id: "settings", label: "Settings", icon: <Settings /> },
];

/* Each organization role sees only what its permissions open, as the account platform grants them. */
const portal: Item[] = [
  { id: "overview", label: "Overview", icon: <Gauge /> },
  { id: "products", label: "Products", icon: <Package />, roles: ["member"] },
  { id: "members", label: "Members", icon: <Users />, roles: ["owner", "admin", "billing"] },
  { id: "invitations", label: "Invitations", icon: <Mail />, roles: ["owner", "admin"] },
  { id: "products", label: "Products & licenses", icon: <Package />, roles: ["owner", "admin", "billing"] },
  { id: "credits", label: "Credits", icon: <Wallet />, roles: ["owner", "billing"] },
  { id: "billing", label: "Billing", icon: <CreditCard />, roles: ["owner", "billing"] },
  { id: "partners", label: "Partners", icon: <Waypoints />, roles: ["owner"] },
  { id: "signin", label: "Sign-in", icon: <KeyRound />, roles: ["owner", "admin"] },
  { id: "audit", label: "Audit log", icon: <ScrollText />, roles: ["owner", "admin"] },
  { id: "settings", label: "Settings", icon: <Settings />, roles: ["owner", "admin"] },
];

/**
 * The shell both products render, as their sidebar composes it today. The
 * same markup draws "today" and Direction A: what changes is the tokens.
 */
export function ProductShell({
  product,
  active,
  crumbs,
  role = "owner",
  user = "Alex Admin",
  children,
}: {
  product: "soc" | "portal";
  /** The viewer's organization role: the portal's sections follow it. */
  role?: Role;
  /** The signed-in person, shown at the sidebar's foot. */
  user?: string;
  active: string;
  crumbs: string[];
  children: ReactNode;
}) {
  const items = product === "soc" ? soc : portal.filter((item) => !item.roles || item.roles.includes(role));
  return (
    <SidebarProvider skipLabel="Skip to content">
      <Sidebar label="Sections" closeLabel="Close navigation">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton label="Example Security GmbH" href="#org">
                <Building2 />
              </SidebarMenuButton>
            </SidebarMenuItem>
            {product === "soc" ? (
              <SidebarMenuItem>
                <SidebarMenuButton label="Back to the organization" href="#org">
                  <ArrowLeft />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : null}
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{product === "soc" ? "Production" : "Organization"}</SidebarGroupLabel>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={`${item.id}-${item.label}`}>
                  <SidebarMenuButton label={item.label} badge={item.badge} href={`#${item.id}`} active={item.id === active}>
                    {item.icon}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton label={user} href="#me">
                <UserRound />
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton label="Sign out" href="#signout">
                <LogOut />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarBrand />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <AppShellBar>
          <SidebarTrigger label="Toggle navigation" />
          <Breadcrumb label="Breadcrumb" items={crumbs.map((label, i) => (i < crumbs.length - 1 ? { label, href: "#" } : { label }))} />
        </AppShellBar>
        <AppShellContent>{children}</AppShellContent>
      </SidebarInset>
    </SidebarProvider>
  );
}
