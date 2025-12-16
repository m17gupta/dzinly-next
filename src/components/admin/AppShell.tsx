

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Globe2,
  Server,
  Shield,
  FileText,
  Type,
  ShoppingBag,
  BarChart3,
  Code2,
  Settings,
  Users,
  CreditCard,
  Menu,
  Sparkles,
  Package,
  Tags,
  ShoppingCart,
  Building2,
  Bell,
  Search,
  ChevronDown,
  Database,
  FolderOpen,
  HardDrive,
  Lock,
  Mail,
  Forward,
  MessageSquare,
  Zap,
  Activity,
  TrendingUp,
  Gauge,
  FileBarChart,
  Puzzle,
  Webhook,
  HelpCircle,
  BookOpen,
  MessageCircle,
  Video,
  Phone,
  Wifi,
  CloudCog,
  Key,
  Eye,
  AlertTriangle,
  Timer,
  Cpu,
  MemoryStick,
  Network,
  Layers,
  GitBranch,
  Plug2,
  Store,
  ExternalLink,
  Images,
  RectangleHorizontal,
  RectangleVertical,
  Navigation,
  BadgeCent,
  Palette,
  Share2,
  LayoutTemplate,
  Globe,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { signOut } from "next-auth/react";

// ---------------------------------------------------------------------------
// Types & interfaces
// ---------------------------------------------------------------------------

export type Website = {
  _id: string;
  websiteId: string;
  name: string;
  primaryDomain?: string []|string | null;
  systemSubdomain: string;
  serviceType: "WEBSITE_ONLY" | "ECOMMERCE";
  status?: "active" | "paused" | "error";
};

export type User = {
  id: string;
  email: string;
  name: string;
  tenantId: string;
  tenantSlug: string;
  role: string;
  // Optional explicit permission list (if available on session.user)
  permissions?: string[];
};

type AppShellProps = {
  children: React.ReactNode;
  websites?: Website[];
  currentWebsite?: Website | null;
  user?: User | null;
  onWebsiteChange?: (websiteId: string) => void;
};

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  // accept a single permission string or an array of permissions
  permission?: string | string[];
  badge?: string;
};

type NavSection = {
  id: string;
  label: string;
  items: NavItem[];
  permission?: string;
};

// ---------------------------------------------------------------------------
// Navigation structure
// ---------------------------------------------------------------------------

const currentWebsiteSections: NavSection[] = [
  {
    id: "website-overview",
    label: "Websites",
    items: [
      {
        label: "Pages",
        href: "/admin/pages",
        icon: LayoutDashboard,
      },
      {
        label: "Posts",
        href: "/admin/posts",
        icon: FileText,
        permission: "websites:update",
      },
      {
        label: "Media",
        href: "/admin/media",
        icon: Images,
        permission: "analytics:view",
      },
      {
        label: "Header",
        href: "/admin/header",
        icon: RectangleHorizontal,
        permission: "security:read",
      },
      {
        label: "Footer",
        href: "/admin/footer",
        icon: RectangleVertical,
        permission: "security:read",
      },
      {
        label: "Navigation",
        href: "/admin/navigation",
        icon: Navigation,
        permission: "security:read",
      },
    ],
  },
  {
 id: "products",
    label: "Products",
    items: [
       {
        label: "category",
        href: "/admin/category",
        icon: Tags,
        permission: ["content:read", "content:update", "content:delete"],
      },
       {
        label: "brand",
        href: "/admin/brand",
        icon: Building2,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "segment",
        href: "/admin/segment",
        icon: Building2,
        permission: ["content:read", "content:update", "content:delete"],
      },
        {
        label: "attribute",
        href: "/admin/attribute",
        icon: Building2,
        permission: ["content:read", "content:update", "content:delete"],
      },
      
      
    ]
    
  },
  {
    id: "branding",
    label: "Branding & Design",
    items: [
      {
        label: "Logo",
        href: "/admin/logo",
        icon: BadgeCent,
        permission: "content:read",
      },
      {
        label: "Color Pallet",
        href: "/admin/color-pallet",
        icon: Palette,
        permission: "content:read",
      },
      {
        label: "Social Links",
        href: "/admin/social-links",
        icon: Share2,
        permission: "content:read",
      },
      {
        label: "Layout Settings",
        href: "/admin/layout-settings",
        icon: LayoutTemplate,
        permission: "content:read",
      },
      {
        label: "Typography",
        href: "/admin/typography",
        icon: Type,
        permission: "content:update",
      },
    ],
  },
  {
    id: "domains",
    label: "Domain & Hosting",
    items: [
      {
        label: "Domains",
        href: "/admin/domain",
        icon: Globe,
        permission: "content:read",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Sidebar components
// ---------------------------------------------------------------------------

type SidebarProps = {
  websites: Website[];
  currentWebsite: Website | null;
  user: User | null;
  onWebsiteChange: (websiteId: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

function Sidebar({
  websites,
  currentWebsite,
  user,
  onWebsiteChange,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  // Helper function to check if user has permission (simplified for now)
  // permission can be a string or an array of strings. If an array is
  // provided we treat it as an OR (visible if user has any of them).
  // If `user.permissions` is not available (rolling out), we fall back to
  // allowing the item so behaviour remains unchanged.
  const hasPermission = (permission?: string | string[]) => {
    if (!permission) return true;
    if (!user) return true; // no user means allow (server rendering fallback)

    const required = Array.isArray(permission) ? permission : [permission];

    // If user.permissions isn't present yet, keep existing permissive behavior.
    if (!user.permissions) return true;

    // Return true if user has any of the required permissions
    return required.some((p) => user.permissions?.includes(p));
  };

  const filteredWebsiteSections = currentWebsiteSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => hasPermission(item.permission)),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <TooltipProvider>
      <div
        className={cn(
          "relative hidden border-r bg-background border-2 h-screen md:flex",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        <div className="flex h-full flex-1 flex-col gap-2">
          {/* Logo / brand */}
          <div className="flex items-center gap-2 px-4 pt-4 pb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
              KT
            </div>
            {!collapsed && (
              <div>
                <div className="text-sm font-semibold tracking-tight">
                  Dzinly
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Multi-tenant CMS
                </div>
              </div>
            )}
          </div>

          {/* Website selector */}
          {websites.length > 0 && (
            <div className="px-3">
              <Select
                value={currentWebsite?.websiteId || ""}
                onValueChange={onWebsiteChange}
              >
                <SelectTrigger
                  className={cn("h-9 w-full text-xs", collapsed && "px-2")}
                >
                  {!collapsed && (
                    <SelectValue placeholder="Select website">
                      {currentWebsite?.name || "Select website"}
                    </SelectValue>
                  )}
                  {collapsed && <Globe2 className="h-4 w-4" />}
                </SelectTrigger>
                <SelectContent>
                  {websites.map((site) => (
                    <SelectItem key={site._id} value={site._id}>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">{site.name}</span>
                        <span className="text-[11px] text-muted-foreground">
                          {site.primaryDomain || site.systemSubdomain}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <ScrollArea className="mt-2 flex-1 px-1">
            <nav className="flex flex-col gap-4 pb-8">
              {/* Current website sections - only show if website is selected */}
              {currentWebsite &&
                filteredWebsiteSections.map((section) => (
                  <SidebarSection
                    key={section.id}
                    section={section}
                    pathname={pathname}
                    collapsed={collapsed}
                    hoveredId={hoveredId}
                    setHoveredId={setHoveredId}
                  />
                ))}
            </nav>
          </ScrollArea>

          {/* Collapse button */}
          <div className="border-t px-3 py-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={onToggleCollapse}
            >
              {!collapsed && <span>Collapse sidebar</span>}
              <span className={cn(collapsed && "mx-auto")}>⟷</span>
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

type SidebarSectionProps = {
  section: NavSection;
  pathname: string;
  collapsed?: boolean;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
};

function SidebarSection({
  section,
  pathname,
  collapsed,
  hoveredId,
  setHoveredId,
}: SidebarSectionProps) {
  return (
    <div className="px-2">
      {!collapsed && (
        <div className="mb-1 px-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {section.label}
        </div>
      )}
      <div className="space-y-1">
        {section.items.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + "/");
          const id = `${section.id}-${item.href}`;
          const showLabel = !collapsed;

          return (
            <Tooltip key={id} delayDuration={collapsed ? 250 : 0}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className="relative block"
                  onMouseEnter={() => setHoveredId(id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div
                    className={cn(
                      "group flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                      collapsed && "justify-center",
                      isActive && "text-foreground bg-muted"
                    )}
                  >
                    <div className="relative flex h-8 w-8 items-center justify-center">
                      <AnimatePresence>
                        {isActive && (
                          <motion.span
                            layoutId="sidebar-active-pill"
                            className="absolute inset-0 rounded-lg bg-primary/10"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{
                              type: "spring",
                              stiffness: 260,
                              damping: 25,
                            }}
                          />
                        )}
                      </AnimatePresence>
                      <Icon className="relative h-4 w-4" />
                    </div>
                    {showLabel && (
                      <div className="flex items-center gap-2 flex-1">
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1 py-0"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">{item.label}</TooltipContent>
              )}
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile Sidebar
// ---------------------------------------------------------------------------

type MobileSidebarProps = {
  websites: Website[];
  currentWebsite: Website | null;
  user: User | null;
  onWebsiteChange: (websiteId: string) => void;
};

function MobileSidebar({
  websites,
  currentWebsite,
  user,
  onWebsiteChange,
}: MobileSidebarProps) {
  const pathname = usePathname();

  // Helper function to check if user has permission (simplified for now)
  // Accept string or array; falls back to permissive behaviour if
  // `user.permissions` isn't available yet.
  const hasPermission = (permission?: string | string[]) => {
    if (!permission) return true;
    if (!user) return true;

    const required = Array.isArray(permission) ? permission : [permission];
    if (!user.permissions) return true;
    return required.some((p) => user.permissions?.includes(p));
  };

  const filteredWebsiteSections = currentWebsiteSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => hasPermission(item.permission)),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <div className="flex flex-col h-full">
      {/* Website selector */}
      {websites.length > 0 && (
        <div className="p-3 border-b">
          <Select
            value={currentWebsite?.websiteId || ""}
            onValueChange={onWebsiteChange}
          >
            <SelectTrigger className="h-9 w-full text-xs">
              <SelectValue placeholder="Select website" />
            </SelectTrigger>
            <SelectContent>
              {websites.map((site) => (
                <SelectItem key={site._id} value={site._id}>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium">{site.name}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {site.primaryDomain || site.systemSubdomain}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-4 p-3 pb-8">
          {/* Current website sections - only show if website is selected */}
          {currentWebsite &&
            filteredWebsiteSections.map((section) => (
              <div key={section.id}>
                <div className="mb-2 px-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  {section.label}
                </div>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href ||
                      pathname?.startsWith(item.href + "/");

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                          isActive && "bg-muted text-foreground font-medium"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className="ml-auto text-[10px] px-1 py-0"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
        </nav>
      </ScrollArea>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Topbar
// ---------------------------------------------------------------------------

type TopbarProps = {
  currentWebsite: Website | null;
  user: User | null;
  onToggleMobileSidebar: () => void;
};

function Topbar({ currentWebsite, user, onToggleMobileSidebar }: TopbarProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background/80 px-3 pl-2 pr-4 backdrop-blur md:h-16">
      <div className="flex items-center gap-2 md:gap-3">
        {/* Mobile menu */}
        <div className="md:hidden">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={onToggleMobileSidebar}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
        <div className="hidden text-sm font-medium text-muted-foreground md:inline">
          Dashboard
        </div>
        {currentWebsite && (
          <div className="flex items-center gap-2 rounded-full border bg-muted/60 px-3 py-1 text-xs text-muted-foreground">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-[10px] font-semibold text-primary">
              {currentWebsite.name.charAt(0).toUpperCase()}
            </span>
            <span className="hidden md:inline">{currentWebsite.name}</span>
            <span className="hidden text-[11px] text-muted-foreground/80 sm:inline">
              {currentWebsite.primaryDomain || currentWebsite.systemSubdomain}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="hidden text-xs sm:inline-flex"
        >
          <Search className="h-3 w-3 mr-1" />
          Search
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Bell className="h-4 w-4" />
        </Button>
        <Button size="sm" className="text-xs">
          <Sparkles className="h-3 w-3 mr-1" />
          Upgrade
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ml-1 h-8 w-8 rounded-full"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback>
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {user?.name || "User"}
              <div className="text-xs text-muted-foreground font-normal">
                {user?.email}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Account settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut()}
              className="text-destructive"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// AppShell component (exported)
// ---------------------------------------------------------------------------

export function AppShell({
  children,
  websites = [],
  currentWebsite = null,
  user = null,
  onWebsiteChange = () => {},
}: AppShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
      {/* Desktop sidebar */}
      <Sidebar
        websites={websites}
        currentWebsite={currentWebsite}
        user={user}
        onWebsiteChange={onWebsiteChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main area */}
      <div className="flex flex-1 min-h-screen flex-col overflow-hidden">
        <Topbar
          currentWebsite={currentWebsite}
          user={user}
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
        />
        <main className="flex-1 px-3 py-4 md:px-6 md:py-6 overflow-auto">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      {/* Mobile sidebar sheet */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SheetHeader className="border-b px-4 py-3">
            <SheetTitle className="text-sm font-semibold">
              Navigation
            </SheetTitle>
          </SheetHeader>
          <MobileSidebar
            websites={websites}
            currentWebsite={currentWebsite}
            user={user}
            onWebsiteChange={(websiteId) => {
              onWebsiteChange(websiteId);
              setMobileSidebarOpen(false);
            }}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}