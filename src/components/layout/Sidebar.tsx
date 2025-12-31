import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Building2,
  Users,
  UserCheck,
  CreditCard,
  FileText,
  DollarSign,
  Wallet,
  MessageSquare,
  Star,
  ShoppingBag,
  Settings,
  UserPlus,
  Calendar,
  Bell,
  Sparkles,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useThemeCustomizer } from "@/context/ThemeCustomizerContext";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: number | string;
  collapsed?: boolean;
  subItems?: Array<{ label: string; href: string }>;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, href, badge, collapsed, subItems }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  const isActive = location.pathname === href || location.pathname.startsWith(href + "/");

  const hasSubItems = subItems && subItems.length > 0;

  return (
    <div>
      {/* Main Item */}
      <Link
        to={hasSubItems ? "#" : href}
        onClick={(e) => {
          if (hasSubItems) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative",
          isActive
            ? "bg-primary-600 text-white font-semibold shadow-md hover:bg-primary-700"
            : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-primary-600 dark:hover:text-primary-400",
          collapsed && "justify-center"
        )}
      >
        {/* Icon */}
        <div className="w-5 h-5 flex-shrink-0">{icon}</div>

        {/* Label (hidden when collapsed) */}
        {!collapsed && (
          <>
            <span className="flex-1 font-medium text-sm">{label}</span>

            {/* Badge */}
            {badge && (
              <Badge variant="primary" className="text-xs">
                {badge}
              </Badge>
            )}

            {/* Submenu indicator */}
            {hasSubItems && (
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            )}
          </>
        )}

        {/* Tooltip for collapsed state */}
        {collapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-neutral-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
            {label}
          </div>
        )}
      </Link>

      {/* Submenu */}
      {hasSubItems && !collapsed && isOpen && (
        <div className="ml-8 mt-1 space-y-1">
          {subItems.map((subItem) => (
            <Link
              key={subItem.href}
              to={subItem.href}
              className={cn(
                "block px-3 py-2 text-sm rounded-lg transition-colors",
                "hover:bg-neutral-100 dark:hover:bg-neutral-800",
                location.pathname === subItem.href &&
                  "text-primary-600 dark:text-primary-400 font-medium"
              )}
            >
              {subItem.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// Admin Navigation Items
const AdminNavItems: React.FC<{ collapsed: boolean }> = ({ collapsed }) => {
  return (
    <>
      <NavItem
        icon={<LayoutDashboard />}
        label="Dashboard"
        href="/admin/dashboard"
        collapsed={collapsed}
      />

      <NavItem
        icon={<BarChart3 />}
        label="Analytics"
        href="/admin/analytics"
        collapsed={collapsed}
      />

      <NavItem
        icon={<Building2 />}
        label="Properties"
        href="/admin/properties"
        badge={45}
        collapsed={collapsed}
        subItems={[
          { label: "All Properties", href: "/admin/properties" },
          { label: "Property Stats", href: "/admin/properties/stats" },
        ]}
      />

      <NavItem
        icon={<Users />}
        label="Agents"
        href="/admin/agents"
        badge={12}
        collapsed={collapsed}
        subItems={[
          { label: "All Agents", href: "/admin/agents" },
          { label: "Add Agent", href: "/admin/agents/new" },
        ]}
      />

      <NavItem
        icon={<UserCheck />}
        label="Customers"
        href="/admin/customers"
        badge={234}
        collapsed={collapsed}
        subItems={[
          { label: "All Customers", href: "/admin/customers" },
          { label: "Add Customer", href: "/admin/customers/new" },
        ]}
      />

      <NavItem
        icon={<CreditCard />}
        label="Subscriptions"
        href="/admin/subscriptions"
        collapsed={collapsed}
      />

      <NavItem
        icon={<FileText />}
        label="CMS"
        href="/admin/cms"
        collapsed={collapsed}
        subItems={[
          { label: "Blogs", href: "/admin/cms/blogs" },
          { label: "FAQs", href: "/admin/cms/faqs" },
          { label: "News", href: "/admin/cms/news" },
          { label: "Pages", href: "/admin/cms/pages" },
        ]}
      />

      <NavItem
        icon={<DollarSign />}
        label="Transactions"
        href="/admin/transactions"
        collapsed={collapsed}
        subItems={[
          { label: "Agent Transactions", href: "/admin/transactions/agents" },
          { label: "Customer Transactions", href: "/admin/transactions/customers" },
        ]}
      />

      <NavItem
        icon={<Wallet />}
        label="Financials"
        href="/admin/credit"
        collapsed={collapsed}
        subItems={[
          { label: "Credits", href: "/admin/credit" },
          { label: "Wallet", href: "/admin/wallet" },
        ]}
      />

      <NavItem
        icon={<MessageSquare />}
        label="Messages"
        href="/admin/chat"
        badge="3"
        collapsed={collapsed}
        subItems={[
          { label: "Chat", href: "/admin/chat" },
          { label: "Inbox", href: "/admin/inbox" },
          { label: "AI Chat Leads", href: "/admin/aichatleads" },
        ]}
      />

      <NavItem icon={<Star />} label="Reviews" href="/admin/reviews" collapsed={collapsed} />

      <NavItem icon={<ShoppingBag />} label="Orders" href="/admin/orders" collapsed={collapsed} />

      <NavItem icon={<Settings />} label="Settings" href="/admin/settings" collapsed={collapsed} />
    </>
  );
};

// Agent Navigation Items
const AgentNavItems: React.FC<{ collapsed: boolean }> = ({ collapsed }) => {
  return (
    <>
      <NavItem
        icon={<LayoutDashboard />}
        label="Dashboard"
        href="/agent/dashboard"
        collapsed={collapsed}
      />

      <NavItem
        icon={<Building2 />}
        label="My Properties"
        href="/agent/properties"
        badge={12}
        collapsed={collapsed}
        subItems={[
          { label: "All Properties", href: "/agent/properties" },
          { label: "Add Property", href: "/agent/properties/new" },
        ]}
      />

      <NavItem
        icon={<UserPlus />}
        label="Leads"
        href="/agent/leads"
        badge="5 new"
        collapsed={collapsed}
      />

      <NavItem icon={<Calendar />} label="Appointments" href="/agent/appointments" collapsed={collapsed} />

      <NavItem icon={<Bell />} label="Reminders" href="/agent/reminders" collapsed={collapsed} />

      <NavItem
        icon={<Sparkles />}
        label="AI Tools"
        href="/agent/ai-price-estimate"
        collapsed={collapsed}
        subItems={[{ label: "Price Estimator", href: "/agent/ai-price-estimate" }]}
      />

      <NavItem
        icon={<MessageSquare />}
        label="Messages"
        href="/agent/chat"
        badge="3"
        collapsed={collapsed}
      />

      <NavItem
        icon={<FileText />}
        label="Blogs"
        href="/agent/blogs"
        collapsed={collapsed}
        subItems={[
          { label: "My Blogs", href: "/agent/blogs" },
          { label: "Comments", href: "/agent/comments" },
        ]}
      />

      <NavItem
        icon={<CreditCard />}
        label="Subscription"
        href="/agent/subscription-plans"
        collapsed={collapsed}
      />

      <NavItem icon={<Settings />} label="Profile" href="/agent/profile" collapsed={collapsed} />
    </>
  );
};

interface SidebarProps {
  role: "admin" | "agent";
}

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const { config, updateLayout } = useThemeCustomizer();
  const collapsed = config.layout.menuCollapsed;

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-64px)] transition-all duration-300 z-30",
        "bg-white dark:bg-neutral-900 border-r border-neutral-200/80 dark:border-neutral-800/80",
        "overflow-y-auto custom-scrollbar",
        config.theming.semiDark && "bg-neutral-900 text-neutral-100 border-neutral-800",
        collapsed ? "w-20" : "w-[260px]"
      )}
      style={{ width: `var(--sidebar-width)` }}
    >
      {/* Navigation Items */}
      <nav className="p-3 space-y-1">
        {role === "admin" ? (
          <AdminNavItems collapsed={collapsed} />
        ) : (
          <AgentNavItems collapsed={collapsed} />
        )}
      </nav>

      {/* Collapse Toggle */}
      <div className="sticky bottom-0 bg-gradient-to-t from-white via-white dark:from-neutral-900 dark:via-neutral-900 to-transparent p-3 pt-6">
        <button
          onClick={() => updateLayout({ menuCollapsed: !collapsed })}
          className="w-full h-10 flex items-center justify-center rounded-lg bg-neutral-100/80 dark:bg-neutral-800/80 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all group"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          ) : (
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          )}
        </button>
      </div>
    </aside>
  );
};
