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
  Compass, 
  ClipboardList, 
  ArrowLeftRight, 



} from "lucide-react";
import { FaChevronCircleLeft,FaChevronCircleRight } from "react-icons/fa";

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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { signOut } from "next-auth/react";
import { useDispatch } from "react-redux";
import { store } from "@/store/store";
import { clearAttributes } from "@/hooks/slices/attribute/AttributeSlice";
import { clearBrands } from "@/hooks/slices/brand/BrandSlice";
import { clearSegments } from "@/hooks/slices/segment/SegmentSlice";
import { clearCategories } from "@/hooks/slices/category/CategorySlice";

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
// Navigation structure (same as you)
// ---------------------------------------------------------------------------

const currentWebsiteSections: NavSection[] = [
  {
    id: "dashboard-overview",
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/pages", icon: LayoutDashboard },
      { label: "Analytics", href: "/admin/posts", icon: BarChart3, permission: "websites:update" },
      { label: "Activity Log", href: "/admin/media", icon: Activity, permission: "analytics:view" },
      { label: "Notifications", href: "/admin/header", icon: Bell, permission: "security:read" },
      { label: "System Health", href: "/admin/footer", icon: HeartPulse, permission: "security:read" },
      { label: "Quick Actions", href: "/admin/navigation", icon: Zap, permission: "security:read" },
    ],
  },

  {
    id: "websites",
    label: "Websites",
    items: [
      { label: "Pages", href: "/admin/pages", icon: FileCode2 },
      {
        label: "Posts",
        href: "/admin/posts",
        icon: Newspaper,
        permission: "websites:update",
      },
      {
        label: "Media",
        href: "/admin/media",
        icon: ImageIcon,
        permission: "analytics:view",
      },
      {
        label: "Header",
        href: "/admin/header",
        icon: PanelTop,
        permission: "security:read",
      },
      {
        label: "Footer",
        href: "/admin/footer",
        icon: PanelBottom,
        permission: "security:read",
      },
      {
        label: "Navigation",
        href: "/admin/navigation",
        icon: Compass,
        permission: "security:read",
      },
      {
        label: "Forms",
        href: "/admin/forms",
        icon: ClipboardList,
        permission: "security:read",
      },
      {
        label: "Redirects",
        href: "/admin/redirects",
        icon: ArrowLeftRight,
        permission: "security:read",
      },
      {
        label: "Domain Settings",
        href: "/admin/domains",
        icon: Globe2,
        permission: "security:read",
      },
    ],
  },

  {
    id: "branding",
    label: "Branding & Design",
    items: [
      { 
        label: "Brand Profile", 
        href: "/admin/branding/brand-profile", 
        icon: Briefcase, 
        permission: ["content:read", "content:update", "content:delete"] 
      },
      {
        label: "Logo",
        href: "/admin/branding/logo",
        icon: Image,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Colors",
        href: "/admin/branding/colors",
        icon: Palette,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Typography",
        href: "/admin/branding/typography",
        icon: Type,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Layout Settings",
        href: "/admin/branding/layout-settings",
        icon: LayoutTemplate,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Theme Presets",
        href: "/admin/branding/theme-presets",
        icon: SwatchBook,
        permission: ["content:read", "content:update", "content:delete"],
      },
    ],
  },

  {
    id: "products",
    label: "Products",
    items: [
      {
        label: "Products",
        href: "/admin/products",
        icon: Package,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Category",
        href: "/admin/category",
        icon: LayoutGrid,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Brand",
        href: "/admin/brand",
        icon: Award,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Segment",
        href: "/admin/segment",
        icon: Layers,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Attribute",
        href: "/admin/attribute",
        icon: ListTree,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Styles",
        href: "/admin/styles",
        icon: Palette,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Tags",
        href: "/admin/tags",
        icon: Hash,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Attributes",
        href: "/admin/attributes-list",
        icon: Component,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Variants",
        href: "/admin/variants",
        icon: Boxes,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Pricing Rules",
        href: "/admin/pricing-rules",
        icon: CircleDollarSign,
        permission: ["content:read", "content:update", "content:delete"],
      },
    ],
  },

  {
    id: "ecommerce",
    label: "E-Commerce",
    items: [
      {
        label: "Orders",
        href: "/admin/ecommerce/orders",
        icon: ShoppingBag,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Customers",
        href: "/admin/ecommerce/customers",
        icon: Users,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Reports",
        href: "/admin/ecommerce/reports",
        icon: BarChart4,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Abandoned Carts",
        href: "/admin/ecommerce/abandoned-carts",
        icon: ShoppingCart,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Subscriptions",
        href: "/admin/ecommerce/subscriptions",
        icon: RefreshCcw,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Taxes",
        href: "/admin/ecommerce/taxes",
        icon: ReceiptIndianRupee,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Shipping",
        href: "/admin/ecommerce/shipping",
        icon: Truck,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Payments",
        href: "/admin/ecommerce/payments",
        icon: CreditCard,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Invoices",
        href: "/admin/ecommerce/invoices",
        icon: FileText,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Settings",
        href: "/admin/ecommerce/settings",
        icon: Settings,
        permission: ["content:read", "content:update", "content:delete"],
      },
    ],
  },

  {
    id: "marketing",
    label: "Marketing",
    items: [
      {
        label: "Banners",
        href: "/admin/marketing/banners",
        icon: ImageIcon,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Campaigns",
        href: "/admin/marketing/campaigns",
        icon: Megaphone,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Catalog Generation",
        href: "/admin/marketing/catalog-generation",
        icon: BookOpen,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Quotations",
        href: "/admin/marketing/quotations",
        icon: FileText,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Coupons",
        href: "/admin/marketing/coupons",
        icon: TicketPercent,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Email Templates",
        href: "/admin/marketing/email-templates",
        icon: MailPlus,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Integrations",
        href: "/admin/marketing/integrations",
        icon: Share2,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Automation Rules",
        href: "/admin/marketing/automation-rules",
        icon: Zap,
        permission: ["content:read", "content:update", "content:delete"],
      },
    ],
  },

  {
      id: "ai-studio",
      label: "AI Studio", 
      items: [
        { 
          label: "Image Uploads", 
          href: "/admin/ai-studio/banners", 
          icon: ImagePlus, 
          permission: ["content:read", "content:update", "content:delete"] 
        },
        { 
          label: "Segment Detection", 
          href: "/admin/ai-studio/campaigns", 
          icon: ScanSearch, 
          permission: ["content:read", "content:update", "content:delete"] 
        },
        { 
          label: "Material Application", 
          href: "/admin/ai-studio/catalog-generation", 
          icon: Paintbrush, 
          permission: ["content:read", "content:update", "content:delete"] 
        },
        { 
          label: "Prompt Library", 
          href: "/admin/ai-studio/quotations", 
          icon: Terminal, 
          permission: ["content:read", "content:update", "content:delete"] 
        },
        { 
          label: "Render History", 
          href: "/admin/ai-studio/coupons", 
          icon: History, 
          permission: ["content:read", "content:update", "content:delete"] 
        },
        { 
          label: "Saved Designs", 
          href: "/admin/ai-studio/email-templates", 
          icon: Heart, 
          permission: ["content:read", "content:update", "content:delete"] 
        },
        { 
          label: "Reference Images", 
          href: "/admin/ai-studio/integrations", 
          icon: GalleryVerticalEnd, 
          permission: ["content:read", "content:update", "content:delete"] 
        },
        { 
          label: "AI Settings", 
          href: "/admin/ai-studio/automation-rules", 
          icon: Cpu, 
          permission: ["content:read", "content:update", "content:delete"] 
        },
      ],
  },

  {
    id: "users",
    label: "Users",
    items: [
      {
        label: "All Users",
        href: "/admin/users/all-users",
        icon: Users,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Roles & Permissions",
        href: "/admin/users/roles-permissions",
        icon: Fingerprint,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Teams",
        href: "/admin/users/teams",
        icon: UsersRound,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Invitations",
        href: "/admin/users/invitations",
        icon: UserPlus,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Activity Logs",
        href: "/admin/users/activity-logs",
        icon: History,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "API Access",
        href: "/admin/users/api-access",
        icon: KeyRound,
        permission: ["content:read", "content:update", "content:delete"],
      },
    ],
  },

  {
    id: "settings",
    label: "Settings",
    items: [
      {
        label: "General",
        href: "/admin/settings/general",
        icon: Settings2,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Domain & DNS",
        href: "/admin/settings/domain-dns",
        icon: Globe,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Billing & Plans",
        href: "/admin/settings/billing-plans",
        icon: CreditCard,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Usage & Limits",
        href: "/admin/settings/usage-limits",
        icon: Activity,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Integrations",
        href: "/admin/settings/integrations",
        icon: Blocks,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Webhooks",
        href: "/admin/settings/webhooks",
        icon: Webhook,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Data Export",
        href: "/admin/settings/data-export",
        icon: Download,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Security",
        href: "/admin/settings/security",
        icon: ShieldCheck,
        permission: ["content:read", "content:update", "content:delete"],
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

// Section "header icon" like screenshot (one icon per group)
const sectionIconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  "dashboard-overview": LayoutDashboard,
  "website-overview": LayoutDashboard,
  products: Tags,
  branding: Palette,
  products: Tag,
  ecommerce: ShoppingCart,
  marketing: Megaphone,
  "ai-studio": Bot,
  users: Users,
  settings: Settings,
  domains: Network,
};

// ---------------------------------------------------------------------------
// Sidebar (Desktop) — matches screenshot style
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

  // open/close groups (dropdown like "Income" in screenshot)
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(
    () => {
      const init: Record<string, boolean> = {};
      filteredWebsiteSections.forEach((s, idx) => (init[s.id] = idx === 0)); // first group open by default
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

  // collapsed hover floating panel (like screenshot right)
  const [hoverGroupId, setHoverGroupId] = React.useState<string | null>(null);

  return (
    <TooltipProvider>
      <div
        className={cn(
          "relative hidden md:flex h-screen",
          collapsed ? "w-[84px]" : "w-[320px]"
        )}
      >
        {/* ✅ soft container like screenshot */}
        <div className="w-full ">
          <div
            className={cn(
              "h-full  border bg-[#f5f6f7] text-[#111]",
              "shadow-[0_10px_35px_rgba(0,0,0,0.08)]"
            )}
          >
            <div className="flex h-full flex-col">
              <div className="border-b pb-4">
                {/* Brand row */}
                <div className={cn("px-4 pt-4 pb-0", collapsed && "px-3")}>
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-md">
                      <img
                        src="../dzinly-favicon.svg"
                        className="w-10 h-10"
                      ></img>
                    </div>
                    {!collapsed && (
                      <div className="leading-tight">
                        <div className="text-sm font-semibold">Dzinly</div>
                        <div className="text-[11px] text-black/45">
                          Admin panel
                        </div>
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
                          "py-6 w-full rounded-md bg-white text-start shadow",
                          collapsed && "justify-start px-2"
                        )}
                      >
                        {!collapsed ? (
                          <SelectValue placeholder="Select website" />
                        ) : (
                          <Globe2 className="h-4 w-4 text-black/70" />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        {websites.map((site) => (
                          <SelectItem key={site._id} value={site._id}>
                            <div className="flex flex-col">
                              <span className="text-xs font-medium uppercase">
                                {site.name}
                              </span>
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
              </div>

              <ScrollArea
                className={cn("mt-3 flex-1 px-2 pb-3", collapsed && "px-2")}
              >
                <div className="space-y-2">
                  {!currentWebsite ? (
                    <div
                      className={cn(
                        "px-3 py-6 text-sm text-black/45",
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

                      // if collapsed: icon only + hover opens floating panel
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
                                    "h-11 rounded-md bg-white/70 hover:bg-white transition",
                                    "border border-black/5 shadow-sm"
                                  )}
                                >
                                 <HeaderIcon className="h-5 w-5 text-black/70" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                {section.label}
                              </TooltipContent>
                            </Tooltip>

                            {/* floating panel like screenshot */}
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
                                  className="absolute left-[92px] top-0 z-50 w-[240px]"
                                >
                                  <div className="rounded-md bg-white border shadow-[0_25px_60px_rgba(0,0,0,0.18)] p-3">
                                    <div className="flex items-center justify-between px-2 pb-2">
                                      <div className="text-sm font-semibold text-black/80">
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
                                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                                                active
                                                  ? "bg-[#f2f3f4] text-black shadow-sm"
                                                  : "text-black/70 hover:bg-[#f6f7f8]"
                                              )}
                                            >
                                              <Icon className="h-4 w-4" />
                                              <span className="truncate flex-1">
                                                {item.label}
                                              </span>
                                              {item.badge && (
                                                <span className="text-[11px] rounded-lg bg-black/5 px-2 py-0.5">
                                                  {item.badge}
                                                </span>
                                              )}
                                              <ChevronRight className="h-4 w-4 opacity-40" />
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

                      // normal expanded sidebar
                      return (
                        <div key={section.id} className="rounded-md">
                          {/* Group header row (like “Income” in screenshot) */}
                          <button
                            type="button"
                            onClick={() => toggleGroup(section.id)}
                            className={cn(
                              "w-full flex items-center gap-3 rounded-md px-3 py-2.5",
                              "text-left bg-white/70 border border-black/5 shadow-sm",
                              "hover:bg-white transition"
                            )}
                          >
                            <div className="grid h-9 w-9 place-items-center rounded-md bg-white border shadow-sm">
                              <HeaderIcon className="h-4 w-4 text-black/70 "/>
                            </div>

                            <div className="flex-1">
                              <div className="text-[13px] font-semibold text-black/80">
                                {section.label}
                              </div>
                            </div>

                            <div className="text-black/40">
                              {isOpen ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </div>
                          </button>

                          {/* Items (nested, with subtle left line like screenshot) */}
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
                                <div className="pl-[22px] pr-1 pt-2 pb-2">
                                  <div className="relative pl-5">
                                    <div className="absolute left-2 top-2 bottom-2 w-px bg-black/10" />
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
                                                "group flex items-center gap-3 rounded-md px-3 py-2",
                                                active
                                                  ? "bg-[#fff] text-black shadow-sm"
                                                  : "text-black/70 hover:bg-[#f6f7f8]"
                                              )}
                                            >
                                              <Icon className="h-4 w-4 text-black/55" />
                                              <span className="text-[13px] font-medium truncate flex-1">
                                                {item.label}
                                              </span>

                                              {item.badge && (
                                                <span className="text-[11px] rounded-lg bg-[#dff4e7] text-[#146b3a] px-2 py-0.5 font-semibold">
                                                  {item.badge}
                                                </span>
                                              )}
                                              <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-40 transition" />
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
             <div className="border-t border-black/10 p-3">
              <Button
                variant="ghost"

                className="w-full rounded-md justify-between bg-white/60 hover:bg-white border border-black/5 shadow-sm text-black/70"
                onClick={onToggleCollapse}
              >
                {!collapsed && (
                  <>
                    <span className="text-xs font-medium">Collapse</span>
                    <FaChevronCircleLeft className="h-8 w-8" />
                  </>
                )}

                {collapsed && (
                  <>
                    <span className="text-xs font-medium">Expand</span>
                    <FaChevronCircleRight className="h-8 w-8" />
                  </>
                )}
              </Button>
            </div>

            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

// small helper icon for floating panel (optional)
function FiCloseHint() {
  return <div className="text-[11px] text-black/35">hover</div>;
}

// ---------------------------------------------------------------------------
// Mobile Sidebar (kept simple, same style)
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
    <div className="flex flex-col h-full">
      {websites.length > 0 && (
        <div className="p-3 border-b">
          <Select
            value={currentWebsite?._id || ""}
            onValueChange={onWebsiteChange}
          >
            <SelectTrigger className="h-10 w-full rounded-md">
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
            <div className="text-sm text-muted-foreground px-2 py-4">
              Select website
            </div>
          ) : (
            filteredWebsiteSections.map((section) => {
              const HeaderIcon = sectionIconMap[section.id] || LayoutDashboard;
              const isOpen = !!openGroups[section.id];

              return (
                <div
                  key={section.id}
                  className="rounded-md border bg-muted/10 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenGroups((p) => ({ ...p, [section.id]: !isOpen }))
                    }
                    className="w-full flex items-center justify-between px-3 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-md bg-background border">
                       <LayoutGrid className="h-4 w-4 text-black/70" />

                      </div>
                      <div className="text-sm font-semibold">
                        {section.label}
                      </div>
                    </div>
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 opacity-60" />
                    ) : (
                      <ChevronRight className="h-4 w-4 opacity-60" />
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
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                                    active
                                      ? "bg-background shadow-sm"
                                      : "hover:bg-muted"
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
// Topbar (same as yours, unchanged logic)
// ---------------------------------------------------------------------------

type TopbarProps = {
  currentWebsite: Website | null;
  user: User | null;
  onToggleMobileSidebar: () => void;
};

function Topbar({ currentWebsite, user, onToggleMobileSidebar }: TopbarProps) {
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      // Clear Redux store by resetting to initial state
      // Reset each slice to its initial state
      // store.dispatch({ type: 'user/setUser', payload: null });
      // store.dispatch({ type: 'pageEdit/resetState' });
      // store.dispatch({ type: 'category/resetState' });
      // store.dispatch({ type: 'brand/resetState' });
      // store.dispatch({ type: 'websites/resetState' });
      resetRedux();
      // Clear localStorage and sessionStorage
      localStorage.clear();
      sessionStorage.clear();

      await signOut({ callbackUrl: "/", redirect: true });
    } catch (error) {
      console.error("Error during sign out:", error);
      await signOut({ callbackUrl: "/" });
    }
  };

  const resetRedux = () => {
    dispatch(clearAttributes());
    dispatch(clearBrands());
    dispatch(clearSegments());
    dispatch(clearCategories());
  };
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background/80 px-8 backdrop-blur md:h-16 shadow-sm">
      <div className="flex items-center gap-2 md:gap-3">
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
        <div className="hidden text-sm font-medium text-black md:inline">
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
              onClick={handleSignOut}
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
    <div className="flex min-h-screen bg-[#e8e9eb] text-foreground overflow-hidden">
      <Sidebar
        websites={websites}
        currentWebsite={currentWebsite}
        user={user}
        onWebsiteChange={onWebsiteChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

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

      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72">
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
