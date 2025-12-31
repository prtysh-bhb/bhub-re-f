# Layout Architecture
## Admin vs Agent Dashboard Design

> **Focus**: Role-specific layouts optimized for different user workflows
> **Principle**: Shared components, differentiated navigation and features
> **Goal**: Intuitive, efficient, scalable dashboard experience

---

## 1. Layout Structure Overview

### 1.1 Common Layout Pattern

Both Admin and Agent dashboards share the same foundational layout:

```
┌──────────────────────────────────────────────────────────────┐
│  TOPBAR (64px height)                                        │
│  Logo | Search | Quick Actions | Notifications | Profile     │
├────────────┬─────────────────────────────────────────────────┤
│            │                                                 │
│  SIDEBAR   │  MAIN CONTENT AREA                              │
│  (260px or │  ┌─────────────────────────────────────────┐   │
│   80px)    │  │ Page Header (Breadcrumbs, Title, CTAs) │   │
│            │  ├─────────────────────────────────────────┤   │
│  Nav Menu  │  │                                         │   │
│  Items     │  │ Page Content (Cards, Tables, Forms)     │   │
│            │  │                                         │   │
│  Collapsed │  │                                         │   │
│  or        │  │                                         │   │
│  Expanded  │  │                                         │   │
│            │  │                                         │   │
│            │  └─────────────────────────────────────────┘   │
│            │                                                 │
└────────────┴─────────────────────────────────────────────────┘
        ▲
        │
   Theme Customizer Button (Fixed bottom-right)
```

### 1.2 Layout Dimensions

```css
/* Topbar */
--topbar-height: 64px;
--topbar-z-index: 40;
--topbar-bg: var(--color-white);
--topbar-border: 1px solid var(--color-neutral-200);

/* Sidebar */
--sidebar-width-expanded: 260px;
--sidebar-width-collapsed: 80px;
--sidebar-z-index: 30;
--sidebar-transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);

/* Content */
--content-padding: 24px;
--content-max-width-compact: 1280px;
--content-max-width-wide: 100%;

/* Mobile breakpoint */
--mobile-breakpoint: 768px;
```

---

## 2. Topbar/Navbar Design

### 2.1 Desktop Topbar (≥768px)

```tsx
const Topbar: React.FC = () => {
  const { user } = useAuth();
  const { config } = useTheme();

  return (
    <header
      className={cn(
        'h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800',
        'flex items-center justify-between px-6 transition-all',
        config.layout.navbarType === 'sticky' && 'sticky top-0 z-40'
      )}
    >
      {/* Left Section - Logo + Search */}
      <div className="flex items-center gap-6 flex-1">
        {/* Logo (visible when sidebar is collapsed or on mobile) */}
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="h-8" />
          <span className="font-semibold text-lg hidden lg:block">
            Real Estate Pro
          </span>
        </Link>

        {/* Global Search */}
        <div className="relative hidden md:block w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="search"
            placeholder="Search properties, agents, customers..."
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Right Section - Quick Actions + Notifications + Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Actions (Admin only) */}
        {user.role === 'admin' && (
          <Button variant="primary" size="sm" leftIcon={<Plus />}>
            Quick Add
          </Button>
        )}

        {/* Notifications */}
        <NotificationsDropdown />

        {/* Profile Dropdown */}
        <ProfileDropdown />
      </div>
    </header>
  );
};
```

### 2.2 Mobile Topbar (<768px)

```tsx
const MobileTopbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4">
      {/* Menu Toggle */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="w-10 h-10 flex items-center justify-center"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Logo */}
      <img src="/logo.svg" alt="Logo" className="h-8" />

      {/* Notifications */}
      <NotificationsDropdown />

      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <MobileSidebarDrawer onClose={() => setMobileMenuOpen(false)} />
      )}
    </header>
  );
};
```

---

## 3. Sidebar Navigation

### 3.1 Sidebar Component

```tsx
interface SidebarProps {
  role: 'admin' | 'agent';
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const { config } = useTheme();
  const collapsed = config.layout.menuCollapsed;

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 h-[calc(100vh-64px)] transition-all duration-300 z-30',
        'bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800',
        'overflow-y-auto scrollbar-thin',
        config.theming.semiDark && 'bg-neutral-900 text-neutral-100',
        collapsed ? 'w-20' : 'w-[260px]'
      )}
    >
      {/* Navigation Items */}
      <nav className="p-3 space-y-1">
        {role === 'admin' ? <AdminNavItems collapsed={collapsed} /> : <AgentNavItems collapsed={collapsed} />}
      </nav>

      {/* Collapse Toggle */}
      <div className="absolute bottom-4 left-0 right-0 px-3">
        <button
          onClick={() => updateLayout({ menuCollapsed: !collapsed })}
          className="w-full h-10 flex items-center justify-center rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>
    </aside>
  );
};
```

### 3.2 Navigation Item Component

```tsx
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
  const [isOpen, setIsOpen] = useState(false);
  const isActive = location.pathname === href || location.pathname.startsWith(href + '/');

  const hasSubItems = subItems && subItems.length > 0;

  return (
    <div>
      {/* Main Item */}
      <Link
        to={hasSubItems ? '#' : href}
        onClick={(e) => {
          if (hasSubItems) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative',
          'hover:bg-neutral-100 dark:hover:bg-neutral-800',
          isActive && 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
          collapsed && 'justify-center'
        )}
      >
        {/* Icon */}
        <div className="w-5 h-5 flex-shrink-0">
          {icon}
        </div>

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
                  'w-4 h-4 transition-transform',
                  isOpen && 'rotate-180'
                )}
              />
            )}
          </>
        )}

        {/* Tooltip for collapsed state */}
        {collapsed && (
          <Tooltip content={label} side="right" />
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
                'block px-3 py-2 text-sm rounded-lg transition-colors',
                'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                location.pathname === subItem.href && 'text-primary-600 dark:text-primary-400 font-medium'
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
```

---

## 4. Admin Navigation Structure

### 4.1 Admin Menu Items

```tsx
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
          { label: 'All Properties', href: '/admin/properties' },
          { label: 'Property Stats', href: '/admin/properties/stats' },
        ]}
      />

      <NavItem
        icon={<Users />}
        label="Agents"
        href="/admin/agents"
        badge={12}
        collapsed={collapsed}
        subItems={[
          { label: 'All Agents', href: '/admin/agents' },
          { label: 'Add Agent', href: '/admin/agents/new' },
        ]}
      />

      <NavItem
        icon={<UserCheck />}
        label="Customers"
        href="/admin/customers"
        badge={234}
        collapsed={collapsed}
        subItems={[
          { label: 'All Customers', href: '/admin/customers' },
          { label: 'Add Customer', href: '/admin/customers/new' },
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
          { label: 'Blogs', href: '/admin/cms/blogs' },
          { label: 'FAQs', href: '/admin/cms/faqs' },
          { label: 'News', href: '/admin/cms/news' },
          { label: 'Pages', href: '/admin/cms/pages' },
        ]}
      />

      <NavItem
        icon={<DollarSign />}
        label="Transactions"
        href="/admin/transactions"
        collapsed={collapsed}
        subItems={[
          { label: 'Agent Transactions', href: '/admin/transactions/agents' },
          { label: 'Customer Transactions', href: '/admin/transactions/customers' },
        ]}
      />

      <NavItem
        icon={<Wallet />}
        label="Financials"
        href="/admin/credit"
        collapsed={collapsed}
        subItems={[
          { label: 'Credits', href: '/admin/credit' },
          { label: 'Wallet', href: '/admin/wallet' },
        ]}
      />

      <NavItem
        icon={<MessageSquare />}
        label="Messages"
        href="/admin/chat"
        badge="3"
        collapsed={collapsed}
        subItems={[
          { label: 'Chat', href: '/admin/chat' },
          { label: 'Inbox', href: '/admin/inbox' },
          { label: 'AI Chat Leads', href: '/admin/aichatleads' },
        ]}
      />

      <NavItem
        icon={<Star />}
        label="Reviews"
        href="/admin/reviews"
        collapsed={collapsed}
      />

      <NavItem
        icon={<ShoppingBag />}
        label="Orders"
        href="/admin/orders"
        collapsed={collapsed}
      />

      <NavItem
        icon={<Settings />}
        label="Settings"
        href="/admin/settings"
        collapsed={collapsed}
      />
    </>
  );
};
```

### 4.2 Admin Dashboard Page

```tsx
const AdminDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Dashboard
          </h1>
          <p className="text-neutral-500 mt-1">
            Welcome back, Admin. Here's what's happening today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DateRangePicker />
          <Button variant="primary" leftIcon={<Download />}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Properties"
          value="1,284"
          change={{ value: 12.5, trend: 'up', period: 'last month' }}
          icon={<Building2 />}
        />
        <StatCard
          title="Active Agents"
          value="47"
          change={{ value: 8.2, trend: 'up', period: 'last month' }}
          icon={<Users />}
        />
        <StatCard
          title="Total Revenue"
          value="$124,500"
          change={{ value: 23.1, trend: 'up', period: 'last month' }}
          icon={<DollarSign />}
        />
        <StatCard
          title="Pending Approvals"
          value="15"
          change={{ value: 3.2, trend: 'down', period: 'last week' }}
          icon={<Clock />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue for the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Property Distribution</CardTitle>
            <CardDescription>Properties by type and status</CardDescription>
          </CardHeader>
          <CardContent>
            <PropertyDistributionChart />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentActivityTable />
        </CardContent>
      </Card>

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Property Approvals</CardTitle>
          <CardDescription>Properties waiting for your review</CardDescription>
        </CardHeader>
        <CardContent>
          <PendingPropertiesTable />
        </CardContent>
      </Card>
    </div>
  );
};
```

---

## 5. Agent Navigation Structure

### 5.1 Agent Menu Items

```tsx
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
          { label: 'All Properties', href: '/agent/properties' },
          { label: 'Add Property', href: '/agent/properties/new' },
        ]}
      />

      <NavItem
        icon={<UserPlus />}
        label="Leads"
        href="/agent/leads"
        badge="5 new"
        collapsed={collapsed}
      />

      <NavItem
        icon={<Calendar />}
        label="Appointments"
        href="/agent/appointments"
        collapsed={collapsed}
      />

      <NavItem
        icon={<Bell />}
        label="Reminders"
        href="/agent/reminders"
        collapsed={collapsed}
      />

      <NavItem
        icon={<Sparkles />}
        label="AI Tools"
        href="/agent/ai-price-estimate"
        collapsed={collapsed}
        subItems={[
          { label: 'Price Estimator', href: '/agent/ai-price-estimate' },
        ]}
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
          { label: 'My Blogs', href: '/agent/blogs' },
          { label: 'Comments', href: '/agent/comments' },
        ]}
      />

      <NavItem
        icon={<CreditCard />}
        label="Subscription"
        href="/agent/subscription-plans"
        collapsed={collapsed}
      />

      <NavItem
        icon={<User />}
        label="Profile"
        href="/agent/profile"
        collapsed={collapsed}
      />
    </>
  );
};
```

### 5.2 Agent Dashboard Page

```tsx
const AgentDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            My Dashboard
          </h1>
          <p className="text-neutral-500 mt-1">
            Manage your properties and track your performance.
          </p>
        </div>

        <Button variant="primary" leftIcon={<Plus />}>
          Add Property
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="My Properties"
          value="12"
          change={{ value: 3, trend: 'up', period: 'this month' }}
          icon={<Building2 />}
        />
        <StatCard
          title="Active Leads"
          value="23"
          change={{ value: 5, trend: 'up', period: 'this week' }}
          icon={<UserPlus />}
        />
        <StatCard
          title="Total Views"
          value="1,547"
          change={{ value: 12.5, trend: 'up', period: 'last 30 days' }}
          icon={<Eye />}
        />
        <StatCard
          title="This Month Sales"
          value="$45,200"
          change={{ value: 18.3, trend: 'up', period: 'last month' }}
          icon={<DollarSign />}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col" leftIcon={<Plus />}>
              <span className="mt-2">Add New Property</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col" leftIcon={<Calendar />}>
              <span className="mt-2">Schedule Appointment</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col" leftIcon={<Sparkles />}>
              <span className="mt-2">AI Price Estimate</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* My Properties */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>My Properties</CardTitle>
              <CardDescription>Recent listings</CardDescription>
            </div>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* PropertyCard components */}
          </div>
        </CardContent>
      </Card>

      {/* Recent Leads */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
          <CardDescription>New inquiries and contacts</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentLeadsTable />
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>Scheduled property viewings</CardDescription>
        </CardHeader>
        <CardContent>
          <UpcomingAppointmentsTimeline />
        </CardContent>
      </Card>
    </div>
  );
};
```

---

## 6. Page Structure Pattern

### 6.1 Standard Page Template

```tsx
interface PageTemplateProps {
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const PageTemplate: React.FC<PageTemplateProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
  children,
}) => {
  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <nav className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <ChevronRight className="w-4 h-4 text-neutral-400" />}
              {crumb.href ? (
                <Link
                  to={crumb.href}
                  className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {title}
          </h1>
          {description && (
            <p className="text-neutral-500 mt-1">{description}</p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>

      {/* Page Content */}
      {children}
    </div>
  );
};
```

### 6.2 Usage Example

```tsx
const AgentsPage: React.FC = () => {
  return (
    <PageTemplate
      title="Agents"
      description="Manage your real estate agents"
      breadcrumbs={[
        { label: 'Dashboard', href: '/admin/dashboard' },
        { label: 'Agents' },
      ]}
      actions={
        <>
          <Button variant="outline" leftIcon={<Download />}>
            Export
          </Button>
          <Button variant="primary" leftIcon={<Plus />}>
            Add Agent
          </Button>
        </>
      }
    >
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search agents..."
              leftIcon={<Search />}
              className="max-w-sm"
            />
            <Select
              placeholder="Status"
              options={[
                { value: 'all', label: 'All' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />
            <Select
              placeholder="Sort by"
              options={[
                { value: 'name', label: 'Name' },
                { value: 'properties', label: 'Properties' },
                { value: 'revenue', label: 'Revenue' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <DataTable columns={agentColumns} data={agents} />
      </Card>
    </PageTemplate>
  );
};
```

---

## 7. Responsive Behavior

### 7.1 Desktop (≥1024px)

- Sidebar: Expanded by default (260px)
- Content: Max-width 1280px (compact) or 100% (wide)
- Stats: 4 columns
- Tables: Full features visible
- Modals: Standard sizes

### 7.2 Tablet (768px - 1023px)

- Sidebar: Collapsed by default (80px)
- Content: Full width
- Stats: 2 columns
- Tables: Horizontal scroll if needed
- Modals: Slightly narrower

### 7.3 Mobile (<768px)

- Sidebar: Hidden, accessible via drawer
- Topbar: Simplified with hamburger menu
- Content: Full width, single column
- Stats: 1 column
- Tables: Card view or simplified columns
- Modals: Full screen on small devices

### 7.4 Responsive Implementation

```tsx
// hooks/useMediaQuery.ts
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

// Usage
const isMobile = useMediaQuery('(max-width: 767px)');
const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
const isDesktop = useMediaQuery('(min-width: 1024px)');

// Conditional rendering
{isMobile ? <MobileView /> : <DesktopView />}
```

---

## 8. Shared vs Role-Specific Components

### 8.1 Shared Components (Both Admin & Agent)

- Topbar/Navbar
- Sidebar structure
- Profile dropdown
- Notifications dropdown
- Theme customizer
- Page template
- All UI components (Button, Card, Input, etc.)

### 8.2 Admin-Only Components

- Admin dashboard widgets
- Agent management tables
- Customer management tables
- Subscription plan CRUD
- CMS management
- System settings
- Advanced analytics
- Transaction tracking
- Review moderation

### 8.3 Agent-Only Components

- Agent dashboard widgets
- Property creation/editing forms
- Lead management
- Appointment scheduling
- Reminder system
- AI price estimator
- Personal blog management
- Performance tracking

---

## 9. Implementation Checklist

### Core Layout
- [ ] Create `AdminLayout` component
- [ ] Create `AgentLayout` component
- [ ] Build responsive `Topbar` component
- [ ] Build `Sidebar` with role-based navigation
- [ ] Implement `NavItem` component with submenu support
- [ ] Add mobile drawer sidebar
- [ ] Integrate theme customizer

### Admin Features
- [ ] Admin dashboard page
- [ ] Admin navigation menu
- [ ] Admin-specific widgets
- [ ] Agent management pages
- [ ] Customer management pages
- [ ] CMS pages
- [ ] Settings page

### Agent Features
- [ ] Agent dashboard page
- [ ] Agent navigation menu
- [ ] Agent-specific widgets
- [ ] Property management pages
- [ ] Lead management page
- [ ] Appointment page
- [ ] AI tools integration

### Responsive
- [ ] Mobile topbar
- [ ] Mobile sidebar drawer
- [ ] Responsive grid layouts
- [ ] Mobile-optimized tables
- [ ] Touch-friendly interactions

---

**Version**: 1.0.0
**Last Updated**: 2025-12-31
**Status**: Ready for Implementation
