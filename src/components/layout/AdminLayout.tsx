import * as React from "react";
import { Outlet } from "react-router-dom";
import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import { ThemeCustomizer } from "./ThemeCustomizer";
import { useThemeCustomizer } from "@/context/ThemeCustomizerContext";
import { cn } from "@/lib/utils";

export const AdminLayout: React.FC = () => {
  const { config } = useThemeCustomizer();

  return (
    <div
      className={cn(
        "min-h-screen bg-neutral-50 dark:bg-neutral-900",
        config.theming.semiDark && "semi-dark"
      )}
    >
      {/* Topbar */}
      <Topbar role="admin" />

      {/* Sidebar */}
      <Sidebar role="admin" />

      {/* Main Content */}
      <main
        className="transition-all duration-300 bg-gradient-to-br from-neutral-50 via-neutral-100/30 to-neutral-50 dark:from-neutral-950 dark:via-neutral-900/50 dark:to-neutral-950 min-h-[calc(100vh-64px)]"
        style={{
          marginLeft: config.layout.menuCollapsed ? "80px" : "260px",
        }}
      >
        <div
          className="p-6"
          style={{
            maxWidth: config.layout.contentWidth === "compact" ? "1280px" : "100%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Outlet />
        </div>
      </main>

      {/* Theme Customizer */}
      <ThemeCustomizer />
    </div>
  );
};
