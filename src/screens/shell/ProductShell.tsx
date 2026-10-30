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
  RefreshCw,
  Activity,
  Wallet,
} from "lucide-react";
import {
  AppShellBar,
  AppShellBarEnd,
  AppShellBarKeep,
  AppShellContent,
  Breadcrumb,
  Button,
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
  StatusPill,
} from "../../index";
import { chromeWords, organizationNav, workspaceNav, type Lang, type Role } from "./shell.sample";

const icons: Record<string, ReactNode> = {
  overview: <Gauge />,
  cases: <FileText />,
  actors: <Swords />,
  assets: <Boxes />,
  reports: <ScrollText />,
  sources: <Radar />,
  coverage: <Activity />,
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
 * viewer's role opens. The bar's end carries the app-wide status, which
 * folds into "More" on a phone, and the notification bell, which stays,
 * because its count is its point.
 */
export function ProductShell({
  area,
  active,
  crumbs,
  role = "owner",
  user = "Nora Feld",
  lang = "en",
  unread = 3,
  children,
}: {
  area: "workspace" | "organization";
  active: string;
  crumbs: string[];
  role?: Role;
  user?: string;
  lang?: Lang;
  unread?: number;
  children: ReactNode;
}) {
  const words = chromeWords[lang];
  const entries =
    area === "workspace" ? workspaceNav[lang] : organizationNav[lang].filter((e) => !e.roles || e.roles.includes(role));
  return (
    <div lang={lang} style={{ display: "contents" }}>
      <SidebarProvider skipLabel={words.skip}>
        <Sidebar label={words.sections} closeLabel={words.close}>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton label={words.organization} href="#organization">
                  <Building2 />
                </SidebarMenuButton>
              </SidebarMenuItem>
              {area === "workspace" ? (
                <SidebarMenuItem>
                  <SidebarMenuButton label={words.back} href="#organization">
                    <ArrowLeft />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : null}
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>{area === "workspace" ? words.workspace : words.organizationGroup}</SidebarGroupLabel>
              <SidebarMenu>
                {entries.map((entry) => (
                  <SidebarMenuItem key={`${entry.id}-${entry.label}`}>
                    <SidebarMenuButton
                      label={entry.label}
                      badge={entry.badge}
                      href={`#${entry.id}`}
                      active={entry.id === active}
                    >
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
                <SidebarMenuButton label={words.signOut} href="#signout">
                  <LogOut />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarBrand />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <AppShellBar>
            <SidebarTrigger label={words.toggle} />
            <Breadcrumb
              label={words.breadcrumb}
              items={crumbs.map((label, i) => (i < crumbs.length - 1 ? { label, href: "#" } : { label }))}
            />
            <AppShellBarEnd moreLabel={words.more}>
              <StatusPill tone="neutral">{words.demo}</StatusPill>
              <StatusPill tone="recorded">{words.sealed}</StatusPill>
              <Button variant="ghost" size="sm">
                <RefreshCw aria-hidden />
                {words.refresh}
              </Button>
              <AppShellBarKeep>
                <Button
                  variant="ghost"
                  size="sm"
                  iconOnly
                  aria-label={words.notifications}
                  badge={unread}
                  badgeLabel={words.unread(unread)}
                >
                  <Bell aria-hidden />
                </Button>
              </AppShellBarKeep>
            </AppShellBarEnd>
          </AppShellBar>
          <AppShellContent>{children}</AppShellContent>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
