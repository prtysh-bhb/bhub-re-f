import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import Header from "./Header";
import { ThemeCustomizer } from "../ThemeCustomizer";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:bg-gradient-to-br dark:from-neutral-900 dark:to-neutral-950 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCollapseChange={setCollapsed}
        onMobileToggle={setMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex flex-col flex-1 transition-all duration-200 ${
          collapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        {/* Header */}
        <Header onMenuClick={() => setMobileOpen(true)} />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-3 lg:px-6 py-5">
          <Outlet />
        </main>
      </div>

      {/* Theme Customizer */}
      <ThemeCustomizer />
    </div>
  );
};

export default AdminLayout;
