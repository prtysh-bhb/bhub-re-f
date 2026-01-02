import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import Header from "./Header";
import { ThemeCustomizer } from "../ThemeCustomizer";
import { useThemeCustomizer } from "@/context/ThemeCustomizerContext";
import { cn } from "@/lib/utils";

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { config } = useThemeCustomizer();

  return (
    <div
      className={cn(
        "flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:bg-gradient-to-br dark:from-neutral-900 dark:to-neutral-950 overflow-hidden",
        config.theming.semiDark && "semi-dark"
      )}
    >
      {/* Sidebar */}
      <AdminSidebar
        collapsed={config.layout.menuCollapsed}
        mobileOpen={mobileOpen}
        onCollapseChange={(val) => {}} // Controlled by theme customizer
        onMobileToggle={setMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex flex-col flex-1 transition-all duration-200 ${
          config.layout.menuCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        {/* Header */}
        {config.layout.navbarType !== "hidden" && (
          <Header onMenuClick={() => setMobileOpen(true)} />
        )}

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-3 lg:px-6 py-5">
          <div
            className="mx-auto"
            style={{
              maxWidth: config.layout.contentWidth === "compact" ? "1280px" : "100%",
            }}
          >
            <Outlet />
          </div>
        </main>
      </div>

      {/* Theme Customizer */}
      <ThemeCustomizer />
    </div>
  );
};

export default AdminLayout;
