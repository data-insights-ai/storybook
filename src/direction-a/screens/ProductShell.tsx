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
import "./brand.css";

type Item = { id: string; label: string; icon: ReactNode; badge?: string };

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

const portal: Item[] = [
  { id: "overview", label: "Overview", icon: <Gauge /> },
  { id: "members", label: "Members", icon: <Users /> },
  { id: "invitations", label: "Invitations", icon: <Mail /> },
  { id: "products", label: "Products & licenses", icon: <Package /> },
  { id: "credits", label: "Credits", icon: <Wallet /> },
  { id: "billing", label: "Billing", icon: <CreditCard /> },
  { id: "partners", label: "Partners", icon: <Waypoints /> },
  { id: "signin", label: "Sign-in", icon: <KeyRound /> },
  { id: "audit", label: "Audit log", icon: <ScrollText /> },
  { id: "settings", label: "Settings", icon: <Settings /> },
];

/**
 * The shell both products render, as their sidebar composes it today. The
 * same markup draws "today" and Direction A: what changes is the tokens.
 */
export function ProductShell({
  product,
  active,
  crumbs,
  children,
}: {
  product: "soc" | "portal";
  active: string;
  crumbs: string[];
  children: ReactNode;
}) {
  const items = product === "soc" ? soc : portal;
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
                <SidebarMenuItem key={item.id}>
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
              <SidebarMenuButton label="Alex Admin" href="#me">
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
