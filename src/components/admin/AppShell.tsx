"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Globe2,
  FileText,
  Type,
  Tags,
  Building2,
  Bell,
  Search,
  Menu,
  Sparkles,
  Images,
  RectangleHorizontal,
  RectangleVertical,
  Navigation,
  BadgeCent,
  Palette,
  Share2,
  LayoutTemplate,
  Globe,
  ChevronDown,
  ChevronRight,
  Settings2,
  CreditCard,
  Activity,
  Blocks,
  Webhook,
  Download,
  ShieldCheck,
  Users,
  Fingerprint,
  UsersRound,
  UserPlus,
  History,
  KeyRound,
  ImagePlus,
  ScanSearch,
  Paintbrush,
  Bot,
  Network,
  Compass,
  Tag,
  Terminal,
  Heart,
  GalleryVerticalEnd,
  Cpu,
  Image as ImageIcon,
  Megaphone,
  BookOpen,
  TicketPercent,
  MailPlus,
  Zap,
  ShoppingBag,
  BarChart4,
  ShoppingCart,
  RefreshCcw,
  ReceiptIndianRupee, // or Banknote / Percent
  Truck,
  Settings,
  Package,
  LayoutGrid,
  Award,
  Layers,
  ListTree,
  Hash,
  Component,
  Boxes,
  CircleDollarSign,
  Briefcase,
  Image,
  SwatchBook,
  BarChart3,
  HeartPulse,
  FileCode2,
  Newspaper,
  PanelTop,
  PanelBottom,
  ClipboardList,
  ArrowLeftRight,
  ChevronsUpDown,
  User,
  LogOut,
} from "lucide-react";

import { GoSidebarCollapse } from "react-icons/go";
import { GoSidebarExpand } from "react-icons/go";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { signOut } from "next-auth/react";
import { useDispatch } from "react-redux";
// import { store } from "@/store/store"; // Uncomment if needed
import { clearAttributes } from "@/hooks/slices/attribute/AttributeSlice";
import { clearBrands } from "@/hooks/slices/brand/BrandSlice";
import { clearSegments } from "@/hooks/slices/segment/SegmentSlice";
import { clearCategories } from "@/hooks/slices/category/CategorySlice";
import { Input } from "../ui/input";

// ---------------------------------------------------------------------------
// Types & interfaces
// ---------------------------------------------------------------------------

export type Website = {
  _id: string;
  websiteId: string;
  name: string;
  primaryDomain?: string[] | string | null;
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
    id: "dashboard-overview",
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/pages", icon: LayoutDashboard },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3, permission: "websites:update" },
      { label: "Activity Log", href: "/admin/activity-log", icon: Activity, permission: "analytics:view" },
      { label: "Notifications", href: "/admin/notifications", icon: Bell, permission: "security:read" },
      { label: "System Health", href: "/admin/system-health", icon: HeartPulse, permission: "security:read" },
      { label: "Quick Actions", href: "/admin/quick-actions", icon: Zap, permission: "security:read" },
    ],
  },
  {
    id: "websites",
    label: "Websites",
    items: [
      { label: "Pages", href: "/admin/pages", icon: FileCode2 },
      { label: "Posts", href: "/admin/posts", icon: Newspaper, permission: "websites:update", },
      { label: "Media", href: "/admin/media", icon: ImageIcon, permission: "analytics:view", },
      { label: "Header", href: "/admin/header", icon: PanelTop, permission: "security:read", },
      { label: "Footer", href: "/admin/footer", icon: PanelBottom, permission: "security:read", },
      { label: "Navigation", href: "/admin/navigation", icon: Compass, permission: "security:read", },
      { label: "Forms", href: "/admin/forms", icon: ClipboardList, permission: "security:read", },
      { label: "Redirects", href: "/admin/redirects", icon: ArrowLeftRight, permission: "security:read", },
      { label: "Domain Settings", href: "/admin/domains", icon: Globe2, permission: "security:read", },
    ],
  },
  {
    id: "branding",
    label: "Branding & Design",
    items: [
      { label: "Brand Profile", href: "/admin/branding/brand-profile", icon: LayoutGrid, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Logo", href: "/admin/branding/logo", icon: Image, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Colors", href: "/admin/branding/colors", icon: Palette, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Typography", href: "/admin/branding/typography", icon: Type, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Layout Settings", href: "/admin/branding/layout-settings", icon: LayoutTemplate, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Theme Presets", href: "/admin/branding/theme-presets", icon: SwatchBook, permission: ["content:read", "content:update", "content:delete"] },
    ],
  },
  {
    id: "products",
    label: "Products",
    items: [
      { label: "Products", href: "/admin/products", icon: Package, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Category", href: "/admin/category", icon: LayoutGrid, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Brand", href: "/admin/brand", icon: Award, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Segment", href: "/admin/segment", icon: Layers, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Attribute", href: "/admin/attribute", icon: ListTree, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Styles", href: "/admin/styles", icon: Palette, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Tags", href: "/admin/tags", icon: Hash, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Attributes", href: "/admin/attributes-list", icon: Component, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Variants", href: "/admin/variants", icon: Boxes, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Pricing Rules", href: "/admin/pricing-rules", icon: CircleDollarSign, permission: ["content:read", "content:update", "content:delete"] },
    ],
  },
  {
    id: "ecommerce",
    label: "E-Commerce",
    items: [
      { label: "Orders", href: "/admin/ecommerce/orders", icon: ShoppingBag, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Customers", href: "/admin/ecommerce/customers", icon: Users, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Reports", href: "/admin/ecommerce/reports", icon: BarChart4, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Abandoned Carts", href: "/admin/ecommerce/abandoned-carts", icon: ShoppingCart, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Subscriptions", href: "/admin/ecommerce/subscriptions", icon: RefreshCcw, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Taxes", href: "/admin/ecommerce/taxes", icon: ReceiptIndianRupee, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Shipping", href: "/admin/ecommerce/shipping", icon: Truck, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Payments", href: "/admin/ecommerce/payments", icon: CreditCard, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Invoices", href: "/admin/ecommerce/invoices", icon: FileText, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Settings", href: "/admin/ecommerce/settings", icon: Settings, permission: ["content:read", "content:update", "content:delete"] },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    items: [
      { label: "Banners", href: "/admin/marketing/banners", icon: ImageIcon, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Campaigns", href: "/admin/marketing/campaigns", icon: Megaphone, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Catalog Generation", href: "/admin/marketing/catalog-generation", icon: BookOpen, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Quotations", href: "/admin/marketing/quotations", icon: FileText, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Coupons", href: "/admin/marketing/coupons", icon: TicketPercent, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Email Templates", href: "/admin/marketing/email-templates", icon: MailPlus, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Integrations", href: "/admin/marketing/integrations", icon: Share2, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Automation Rules", href: "/admin/marketing/automation-rules", icon: Zap, permission: ["content:read", "content:update", "content:delete"] },
    ],
  },
  {
    id: "ai-studio",
    label: "AI Studio",
    items: [
      { label: "Image Uploads", href: "/admin/ai-studio/image-uploads", icon: ImagePlus, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Segment Detection", href: "/admin/ai-studio/segment-detection", icon: ScanSearch, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Material Application", href: "/admin/ai-studio/material-application", icon: Paintbrush, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Prompt Library", href: "/admin/ai-studio/prompt-library", icon: Terminal, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Render History", href: "/admin/ai-studio/render-history", icon: History, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Saved Designs", href: "/admin/ai-studio/saved-designs", icon: Heart, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Reference Images", href: "/admin/ai-studio/reference-images", icon: GalleryVerticalEnd, permission: ["content:read", "content:update", "content:delete"] },
      { label: "AI Settings", href: "/admin/ai-studio/ai-settings", icon: Cpu, permission: ["content:read", "content:update", "content:delete"] },
    ],
  },
  {
    id: "users",
    label: "Users",
    items: [
      { label: "All Users", href: "/admin/users/all-users", icon: Users, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Roles & Permissions", href: "/admin/users/roles-permissions", icon: Fingerprint, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Teams", href: "/admin/users/teams", icon: UsersRound, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Invitations", href: "/admin/users/invitations", icon: UserPlus, permission: ["content:read", "content:update", "content:delete"] },
      { label: "Activity Logs", href: "/admin/users/activity-logs", icon: History, permission: ["content:read", "content:update", "content:delete"] },
      { label: "API Access", href: "/admin/users/api-access", icon: KeyRound, permission: ["content:read", "content:update", "content:delete"] },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    items: [
      { label: "General", href: "/admin/settings/general", icon: Settings2, permission: ["content:read", "content:update", "content:delete"], },
      { label: "Domain & DNS", href: "/admin/settings/domain-dns", icon: Globe, permission: ["content:read", "content:update", "content:delete"], },
      { label: "Billing & Plans", href: "/admin/settings/billing-plans", icon: CreditCard, permission: ["content:read", "content:update", "content:delete"], },
      { label: "Usage & Limits", href: "/admin/settings/usage-limits", icon: Activity, permission: ["content:read", "content:update", "content:delete"], },
      { label: "Integrations", href: "/admin/settings/integrations", icon: Blocks, permission: ["content:read", "content:update", "content:delete"], },
      { label: "Webhooks", href: "/admin/settings/webhooks", icon: Webhook, permission: ["content:read", "content:update", "content:delete"], },
      { label: "Data Export", href: "/admin/settings/data-export", icon: Download, permission: ["content:read", "content:update", "content:delete"], },
      { label: "Security", href: "/admin/settings/security", icon: ShieldCheck, permission: ["content:read", "content:update", "content:delete"], },
    ],
  },
  {
    id: "domains",
    label: "Domain & Hosting",
    items: [
      { label: "Domains", href: "/admin/domain", icon: Globe, permission: "content:read", },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ease = [0.22, 1, 0.36, 1] as const;

function useHasPermission(user: User | null) {
  return React.useCallback(
    (permission?: string | string[]) => {
      if (!permission) return true;
      if (!user) return true;

      const required = Array.isArray(permission) ? permission : [permission];
      if (!user.permissions) return true;

      return required.some((p) => user.permissions?.includes(p));
    },
    [user]
  );
}

const sectionIconMap: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  "dashboard-overview": LayoutGrid,
  websites: Globe,
  branding: Palette,
  products: Tags,
  ecommerce: ShoppingCart,
  marketing: Megaphone,
  "ai-studio": Bot,
  users: Users,
  settings: Settings,
  domains: Network,
};

// ---------------------------------------------------------------------------
// Sidebar (Desktop)
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
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const hasPermission = useHasPermission(user);

  const filteredWebsiteSections = React.useMemo(() => {
    return currentWebsiteSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => hasPermission(item.permission)),
      }))
      .filter((section) => section.items.length > 0);
  }, [hasPermission]);

  // open/close groups
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(
    () => {
      const init: Record<string, boolean> = {};
      filteredWebsiteSections.forEach((s, idx) => (init[s.id] = idx === 0));
      return init;
    }
  );

  React.useEffect(() => {
    setOpenGroups((prev) => {
      const next = { ...prev };
      filteredWebsiteSections.forEach((s, idx) => {
        if (typeof next[s.id] === "undefined") next[s.id] = idx === 0;
      });
      return next;
    });
  }, [filteredWebsiteSections]);

  const toggleGroup = (id: string) =>
    setOpenGroups((p) => ({ ...p, [id]: !p[id] }));

  const [hoverGroupId, setHoverGroupId] = React.useState<string | null>(null);

  return (
    <TooltipProvider>
      <div
        className={cn(
          "relative hidden md:flex h-screen",
          collapsed ? "w-[84px]" : "w-[320px]"
        )}
      >
        <div className="w-full">
          <div
            className={cn(
              // UPDATED: Used semantic theme colors instead of hardcoded hex
              "h-full border-r border-border bg-muted/20 text-foreground", 
              "shadow-none"
            )}
          >
            <div className="flex h-full flex-col">
              <div className="border-b border-border/50 pb-4">
                {/* Brand row */}
                <div className="flex justify-between items-center">
                  <div className={cn("px-4 pt-4 pb-0", collapsed && "px-3")}>
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                         {/* Inverted the logo for contrast or keep original */}
                        <img src="../dzinly-favicon.svg" className="w-6 h-6 invert brightness-0"></img>
                      </div>
                      {!collapsed && (
                        <div className="leading-tight">
                          <div className="text-sm font-bold tracking-tight">Dzinly</div>
                          <div className="text-[11px] text-muted-foreground">Admin panel</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Website selector */}
                  {websites.length > 0 && (
                    <div className={cn("px-3 pt-2", collapsed && "px-2")}>
                      <Select
                        value={currentWebsite?._id || ""}
                        onValueChange={onWebsiteChange}
                      >
                        <SelectTrigger
                          className={cn(
                            // UPDATED: Cleaner white/bg input look
                            "h-10 w-full rounded-md bg-background shadow-sm border border-input",
                            "flex items-center justify-between px-3",
                            "[&>svg]:hidden",
                            collapsed && "justify-center px-2"
                          )}
                        >
                          {!collapsed ? (
                            <div className="flex items-center gap-2">
                              <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                            </div>
                          ) : (
                            <Globe2 className="h-4 w-4 text-muted-foreground" />
                          )}
                        </SelectTrigger>

                        <SelectContent className="w-[260px] rounded-lg border shadow-lg">
                          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                            Websites
                          </div>

                          {websites.map((site, index) => (
                            <SelectItem key={site._id} value={site._id}>
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2">
                                  <div className="h-7 w-7 rounded-md border bg-muted flex items-center justify-center">
                                    <Globe2 className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium">{site.name}</span>
                                    <span className="text-[11px] text-muted-foreground">
                                      {site.primaryDomain || site.systemSubdomain}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {!collapsed && (
                  <div className="flex flex-col leading-tight text-left ms-3 me-3 bg-background border border-border/50 shadow-sm rounded-md px-3 py-2 mt-4">
                    <span className="text-xs font-semibold text-foreground">
                      {currentWebsite?.name || "Select website"}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {currentWebsite?.primaryDomain ||
                        currentWebsite?.systemSubdomain ||
                        ""}
                    </span>
                  </div>
                )}
              </div>

              <ScrollArea
                className={cn("mt-3 flex-1 px-2 pb-3", collapsed && "px-2")}
              >
                <div className="space-y-2">
                  {!currentWebsite ? (
                    <div
                      className={cn(
                        "px-3 py-6 text-sm text-muted-foreground",
                        collapsed && "text-center px-1"
                      )}
                    >
                      Select website
                    </div>
                  ) : (
                    filteredWebsiteSections.map((section) => {
                      const HeaderIcon =
                        sectionIconMap[section.id] || LayoutDashboard;
                      const isOpen = !!openGroups[section.id];

                      // Collapsed View
                      if (collapsed) {
                        return (
                          <div
                            key={section.id}
                            className="relative"
                            onMouseEnter={() => setHoverGroupId(section.id)}
                            onMouseLeave={() => setHoverGroupId(null)}
                          >
                            <Tooltip delayDuration={150}>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  className={cn(
                                    "w-full flex items-center justify-center",
                                    "h-11 rounded-md transition-all duration-200",
                                    "text-muted-foreground hover:bg-background hover:text-foreground hover:shadow-sm border border-transparent hover:border-border/50"
                                  )}
                                >
                                  <HeaderIcon className="h-5 w-5" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                {section.label}
                              </TooltipContent>
                            </Tooltip>

                            <AnimatePresence>
                              {hoverGroupId === section.id && (
                                <motion.div
                                  initial={{ opacity: 0, x: 10, y: 0 }}
                                  animate={{
                                    opacity: 1,
                                    x: 0,
                                    transition: { duration: 0.18, ease },
                                  }}
                                  exit={{
                                    opacity: 0,
                                    x: 10,
                                    transition: { duration: 0.14, ease },
                                  }}
                                  className="absolute left-[84px] top-0 z-50 w-[240px]"
                                >
                                  <div className="rounded-lg bg-popover border text-popover-foreground shadow-xl p-3">
                                    <div className="flex items-center justify-between px-2 pb-2">
                                      <div className="text-sm font-semibold">
                                        {section.label}
                                      </div>
                                      <FiCloseHint />
                                    </div>

                                    <div className="space-y-1">
                                      {section.items.map((item) => {
                                        const Icon = item.icon;
                                        const active =
                                          pathname === item.href ||
                                          pathname?.startsWith(item.href + "/");

                                        return (
                                          <Link
                                            key={item.href}
                                            href={item.href}
                                            className="block"
                                          >
                                            <div
                                              className={cn(
                                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                                                active
                                                  ? "bg-primary/10 text-primary font-medium"
                                                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                              )}
                                            >
                                              <Icon className="h-4 w-4" />
                                              <span className="truncate flex-1">
                                                {item.label}
                                              </span>
                                            </div>
                                          </Link>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      }

                      // Normal Expanded View
                      return (
                        <div key={section.id} className="rounded-md">
                          {/* Group header row */}
                          <button
                            type="button"
                            onClick={() => toggleGroup(section.id)}
                            className={cn(
                              "w-full flex items-center gap-3 rounded-md px-3 py-2.5 ",
                              "text-left transition-all duration-200",
                              // UPDATED: Cleaner header style
                              "bg-background hover:bg-background hover:shadow-sm border border-transparent hover:border-border/40 shadow-sm",
                              "group"
                            )}
                          >
                            <div className="grid h-8 w-8 place-items-center rounded-md bg-background border shadow-sm group-hover:border-primary/20">
                              <HeaderIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>

                            <div className="flex-1">
                              <div className="text-[13px] font-semibold text-foreground ">
                                {section.label}
                              </div>
                            </div>

                            <div className="text-muted-foreground/50 group-hover:text-muted-foreground">
                              {isOpen ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </div>
                          </button>

                          {/* Items (nested) */}
                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{
                                  height: "auto",
                                  opacity: 1,
                                  transition: { duration: 0.22, ease },
                                }}
                                exit={{
                                  height: 0,
                                  opacity: 0,
                                  transition: { duration: 0.16, ease },
                                }}
                                className="overflow-hidden"
                              >
                                <div className="pl-[22px] pr-1 pt-1 pb-2">
                                  <div className="relative pl-4 border-l border-border/60 ml-2">
                                    <div className="space-y-0.5">
                                      {section.items.map((item) => {
                                        const Icon = item.icon;
                                        const active =
                                          pathname === item.href ||
                                          pathname?.startsWith(item.href + "/");

                                        return (
                                          <Link
                                            key={item.href}
                                            href={item.href}
                                            className="block"
                                          >
                                            <div
                                              className={cn(
                                                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-200",
                                                // UPDATED: Active state pops out white with shadow
                                                active
                                                  ? "bg-background text-primary shadow-sm font-medium border border-border/50"
                                                  : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
                                              )}
                                            >
                                              <Icon className={cn("h-4 w-4 transition-colors", active ? "text-primary" : "opacity-70 group-hover:opacity-100")} />
                                              <span className="text-[13px] truncate flex-1">
                                                {item.label}
                                              </span>

                                              {item.badge && (
                                                <span className="text-[10px] rounded-full bg-primary/10 text-primary px-2 py-0.5 font-bold">
                                                  {item.badge}
                                                </span>
                                              )}
                                            </div>
                                          </Link>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>

              {/* collapse button */}
              <div className="border-t border-border/50 p-3 bg-muted/10">
                <div className="mt-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 hover:bg-background hover:shadow-sm border border-transparent hover:border-border transition-all">
                        <Avatar className="h-8 w-8 border">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">SC</AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col flex-1 text-left leading-tight">
                          <span className="text-sm font-medium truncate">shadcn</span>
                          <span className="text-xs text-muted-foreground truncate">
                            m@example.com
                          </span>
                        </div>

                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      side="right"
                      align="start"
                      sideOffset={12}
                      className="w-56 rounded-xl shadow-xl mb-2"
                    >
                      <DropdownMenuLabel className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>SC</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">shadcn</span>
                          <span className="text-xs text-muted-foreground">
                            m@example.com
                          </span>
                        </div>
                      </DropdownMenuLabel>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Upgrade to Pro
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem asChild>
                        <Link href="/admin/themes" className="flex items-center w-full cursor-pointer">
                          <Palette className="mr-2 h-4 w-4" />
                          Theme
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        Account
                      </DropdownMenuItem>

                      <DropdownMenuItem>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Billing
                      </DropdownMenuItem>

                      <DropdownMenuItem>
                        <Bell className="mr-2 h-4 w-4" />
                        Notifications
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

// small helper icon for floating panel
function FiCloseHint() {
  return <div className="text-[11px] text-muted-foreground">hover</div>;
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
  const hasPermission = useHasPermission(user);

  const filteredWebsiteSections = React.useMemo(() => {
    return currentWebsiteSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => hasPermission(item.permission)),
      }))
      .filter((section) => section.items.length > 0);
  }, [hasPermission]);

  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(
    () => {
      const init: Record<string, boolean> = {};
      filteredWebsiteSections.forEach((s, idx) => (init[s.id] = idx === 0));
      return init;
    }
  );

  return (
    <div className="flex flex-col h-full bg-muted/20">
      {websites.length > 0 && (
        <div className="p-4 border-b">
          <Select
            value={currentWebsite?._id || ""}
            onValueChange={onWebsiteChange}
          >
            <SelectTrigger className="h-10 w-full rounded-md bg-background">
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
        <div className="p-3 space-y-3">
          {!currentWebsite ? (
            <div className="text-sm text-muted-foreground px-2 py-4 text-center">
              Select website
            </div>
          ) : (
            filteredWebsiteSections.map((section) => {
              const HeaderIcon = sectionIconMap[section.id] || LayoutDashboard;
              const isOpen = !!openGroups[section.id];

              return (
                <div
                  key={section.id}
                  className="rounded-md border bg-background overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenGroups((p) => ({ ...p, [section.id]: !isOpen }))
                    }
                    className="w-full flex items-center justify-between px-3 py-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-8 w-8 place-items-center rounded-md bg-muted">
                        <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="text-sm font-semibold text-foreground">
                        {section.label}
                      </div>
                    </div>
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                          transition: { duration: 0.2, ease },
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                          transition: { duration: 0.14, ease },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 space-y-1">
                          {section.items.map((item) => {
                            const Icon = item.icon;
                            const active =
                              pathname === item.href ||
                              pathname?.startsWith(item.href + "/");

                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="block"
                              >
                                <div
                                  className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                                    active
                                      ? "bg-primary/10 text-primary font-medium"
                                      : "text-muted-foreground hover:bg-muted"
                                  )}
                                >
                                  <Icon className="h-4 w-4 opacity-70" />
                                  <span className="truncate flex-1">
                                    {item.label}
                                  </span>
                                  {item.badge && (
                                    <Badge
                                      variant="secondary"
                                      className="text-[10px] px-1 py-0"
                                    >
                                      {item.badge}
                                    </Badge>
                                  )}
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
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
  collapsed: boolean;
  onToggleCollapse: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

function Topbar({
  currentWebsite,
  user,
  onToggleMobileSidebar,
  collapsed,
  onToggleCollapse,
}: TopbarProps) {
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      // resetRedux(); // Uncomment if you have this function
      dispatch(clearAttributes());
      dispatch(clearBrands());
      dispatch(clearSegments());
      dispatch(clearCategories());
      localStorage.clear();
      sessionStorage.clear();
      await signOut({ callbackUrl: "/", redirect: true });
    } catch (error) {
      console.error("Error during sign out:", error);
      await signOut({ callbackUrl: "/" });
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/80 px-4 md:px-6 backdrop-blur shadow-sm supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2 md:gap-3">
        {/* SIDEBAR COLLAPSE BUTTON */}
        <div className="border-r border-border pr-3 mr-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            {!collapsed ? (
              <GoSidebarExpand className="h-5 w-5" />
            ) : (
              <GoSidebarCollapse className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Toggle */}
        <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={onToggleMobileSidebar}
        >
             <Menu className="h-5 w-5" />
        </Button>

        <div className="hidden text-sm font-medium text-foreground md:inline">
          Dashboard
        </div>

        {currentWebsite && (
          <div className="flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
              {currentWebsite.name.charAt(0).toUpperCase()}
            </span>
            <span className="hidden md:inline font-medium text-foreground">{currentWebsite.name}</span>
            <span className="hidden text-[11px] text-muted-foreground/60 sm:inline">
              {currentWebsite.primaryDomain || currentWebsite.systemSubdomain}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative w-full max-w-sm hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-9 h-9 bg-muted/30 border-input rounded-md focus-visible:ring-1 focus-visible:bg-background transition-all"
          />
        </div>

        <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-dashed border-border">
          <Bell className="h-4 w-4 text-muted-foreground" />
        </Button>

        <Button size="sm" className="hidden md:flex text-xs h-9 bg-primary text-primary-foreground shadow hover:bg-primary/90">
          <Sparkles className="h-3 w-3 mr-2" />
          Upgrade
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ml-1 h-9 w-9 rounded-full border bg-muted/20"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
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
              onClick={handleSignOut}
              className="text-destructive focus:text-destructive"
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
    <div className="flex h-[100vh] bg-background text-foreground overflow-hidden">
      <Sidebar
        websites={websites}
        currentWebsite={currentWebsite}
        user={user}
        onWebsiteChange={onWebsiteChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex flex-1 min-h-screen flex-col overflow-hidden transition-all duration-300">
        <Topbar
          currentWebsite={currentWebsite}
          user={user}
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={(event) => setSidebarCollapsed((prev) => !prev)}
        />
        <main className="flex-1 overflow-auto bg-muted/10 p-4 md:p-6">
          <div className="mx-auto max-w-7xl h-full">
            {children}
          </div>
        </main>
      </div>

      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <SheetHeader className="border-b px-4 py-3 bg-muted/10">
            <SheetTitle className="text-sm font-semibold flex items-center gap-2">
               <div className="h-6 w-6 bg-primary rounded-md flex items-center justify-center text-primary-foreground">
                   <img src="../dzinly-favicon.svg" className="w-4 h-4 invert brightness-0"></img>
               </div>
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