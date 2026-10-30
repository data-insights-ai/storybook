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
  ScrollText,
  Send,
  Settings,
  ShieldCheck,
  Swords,
  UserRound,
  Users,
  Wallet,
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
import { organizationNav, workspaceNav, type Role } from "./shell.sample";

const icons: Record<string, ReactNode> = {
  overview: <Gauge />,
  cases: <FileText />,
  actors: <Swords />,
  assets: <Boxes />,
  reports: <ScrollText />,
  sources: <Radar />,
  notifications: <Bell />,
  siem: <Send />,
  access: <ShieldCheck />,
  settings: <Settings />,
  products: <Package />,
  members: <Users />,
  invitations: <Mail />,
  credits: <Wallet />,
  billing: <CreditCard />,
  signin: <KeyRound />,
  audit: <ScrollText />,
};

/**
 * The frame the pattern screens sit in: the sidebar a product composes
 * from the `Sidebar` family, the bar with its breadcrumb, and the content.
 * A workspace shows its sections; an organization's home shows what the
 * viewer's role opens.
 */
export function ProductShell({
  area,
  active,
  crumbs,
  role = "owner",
  user = "Nora Feld",
  children,
}: {
  area: "workspace" | "organization";
  active: string;
  crumbs: string[];
  role?: Role;
  user?: string;
  children: ReactNode;
}) {
  const entries = area === "workspace" ? workspaceNav : organizationNav.filter((e) => !e.roles || e.roles.includes(role));
  return (
    <SidebarProvider skipLabel="Skip to content">
      <Sidebar label="Sections" closeLabel="Close navigation">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton label="Example Security GmbH" href="#organization">
                <Building2 />
              </SidebarMenuButton>
            </SidebarMenuItem>
            {area === "workspace" ? (
              <SidebarMenuItem>
                <SidebarMenuButton label="Back to the organization" href="#organization">
                  <ArrowLeft />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : null}
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{area === "workspace" ? "Production" : "Organization"}</SidebarGroupLabel>
            <SidebarMenu>
              {entries.map((entry) => (
                <SidebarMenuItem key={`${entry.id}-${entry.label}`}>
                  <SidebarMenuButton label={entry.label} badge={entry.badge} href={`#${entry.id}`} active={entry.id === active}>
                    {icons[entry.id]}
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
