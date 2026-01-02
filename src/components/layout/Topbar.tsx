import * as React from "react";
import { Link } from "react-router-dom";
import { Search, Bell, User, LogOut, Settings as SettingsIcon, Menu, X } from "lucide-react";
import { useThemeCustomizer } from "@/context/ThemeCustomizerContext";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TopbarProps {
  role: "admin" | "agent";
}

export const Topbar: React.FC<TopbarProps> = ({ role }) => {
  const { config } = useThemeCustomizer();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClick = () => {
      setShowProfileMenu(false);
      setShowNotifications(false);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (config.layout.navbarType === "hidden") return null;

  return (
    <header
      className={cn(
        "h-16 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/80",
        "transition-all z-40 shadow-sm",
        config.layout.navbarType === "sticky" && "sticky top-0"
      )}
      style={{
        marginLeft: config.layout.menuCollapsed ? "80px" : "260px",
      }}
    >
      <div
        className="flex items-center justify-between px-6 h-full mx-auto"
        style={{
          maxWidth: config.layout.contentWidth === "compact" ? "1280px" : "100%",
        }}
      >
        {/* Left Section - Logo + Search */}
        <div className="flex items-center gap-6 flex-1">
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden w-10 h-10 flex items-center justify-center"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Logo */}
        <Link
          to={role === "admin" ? "/admin/dashboard" : "/agent/dashboard"}
          className="flex items-center gap-2"
        >
          <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold shadow-sm hover:shadow-md transition-all">
            RE
          </div>
          <span className="font-bold text-lg hidden sm:block text-neutral-900 dark:text-neutral-100">
            Real Estate Pro
          </span>
        </Link>

        {/* Global Search */}
        <div className="relative hidden md:block w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="search"
            placeholder="Search properties, agents, customers..."
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-neutral-300/80 dark:border-neutral-700/80 bg-neutral-100/80 dark:bg-neutral-800/80 hover:border-primary-400/60 dark:hover:border-primary-600/60 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 focus:bg-white dark:focus:bg-neutral-900 text-sm transition-all placeholder:text-neutral-500"
          />
        </div>
      </div>

      {/* Right Section - Actions + Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Action (Admin only) */}
        {role === "admin" && (
          <Button variant="primary" size="sm" className="hidden sm:flex">
            Quick Add
          </Button>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative w-10 h-10 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error-600 rounded-full"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-800 py-2 animate-scale-in">
              <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-800">
                <h3 className="font-semibold text-sm text-primary-500">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer">
                  <p className="text-sm text-primary-600">New property inquiry</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    John Doe is interested in your listing
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">2 minutes ago</p>
                </div>
                <div className="px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer">
                  <p className="text-sm text-primary-600">Property approved</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Your listing has been approved
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">1 hour ago</p>
                </div>
              </div>
              <div className="px-4 py-2 border-t border-neutral-200 dark:border-neutral-800">
                <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 h-10 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="hidden sm:block text-sm font-medium">{user?.name}</span>
          </button>

          {/* Profile Menu Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-800 py-2 animate-scale-in">
              <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-800">
                <p className="font-semibold text-sm">{user?.name}</p>
                <p className="text-xs text-neutral-500">{user?.email}</p>
                <Badge variant="primary" className="mt-1 text-xs capitalize">
                  {role}
                </Badge>
              </div>

              <Link
                to={role === "admin" ? "/admin/profile" : "/agent/profile"}
                className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="text-sm">Profile</span>
              </Link>

              <Link
                to={role === "admin" ? "/admin/settings" : "/agent/profile"}
                className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <SettingsIcon className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </Link>

              <div className="border-t border-neutral-200 dark:border-neutral-800 my-2"></div>

              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-error-600"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
      </div>
    </header>
  );
};
