import React, { useState } from 'react';
import { Settings, X, Sun, Moon, Monitor, Palette, Layout, Maximize2, Eye, RotateCcw, Menu, Grid } from 'lucide-react';
import { useThemeCustomizer } from '@/context/ThemeCustomizerContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const ThemeCustomizer: React.FC = () => {
  const { config, updateTheming, updateLayout, resetToDefaults, isCustomizerOpen, toggleCustomizer } = useThemeCustomizer();

  // Premium color palette with sophisticated options
  const colorPresets = [
    { name: 'Indigo', value: '#6366f1', gradient: 'from-indigo-500 to-indigo-600' },
    { name: 'Purple', value: '#a855f7', gradient: 'from-purple-500 to-purple-600' },
    { name: 'Rose', value: '#f43f5e', gradient: 'from-rose-500 to-rose-600' },
    { name: 'Blue', value: '#3b82f6', gradient: 'from-blue-500 to-blue-600' },
    { name: 'Emerald', value: '#10b981', gradient: 'from-emerald-500 to-emerald-600' },
    { name: 'Amber', value: '#f59e0b', gradient: 'from-amber-500 to-amber-600' },
    { name: 'Cyan', value: '#06b6d4', gradient: 'from-cyan-500 to-cyan-600' },
    { name: 'Pink', value: '#ec4899', gradient: 'from-pink-500 to-pink-600' },
  ];

  const [showCustomColor, setShowCustomColor] = useState(false);

  if (!isCustomizerOpen) {
    return (
      <button
        onClick={toggleCustomizer}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Open theme customizer"
      >
        <div className="relative">
          {/* Animated background ring */}
          <div className="absolute inset-0 rounded-full bg-primary-500 animate-pulse opacity-75 blur-md group-hover:opacity-100 transition-opacity"></div>

          {/* Main button */}
          <div className="relative w-14 h-14 rounded-full bg-primary-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center">
            <Settings className="w-6 h-6 animate-spin-slow" style={{ animationDuration: '8s' }} />
          </div>
        </div>
      </button>
    );
  }

  return (
    <>
      {/* Enhanced Backdrop */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-black/50 to-black/30 backdrop-blur-sm z-40 animate-fade-in"
        onClick={toggleCustomizer}
      />

      {/* Premium Panel */}
      <div className="fixed top-0 right-0 w-[380px] h-full bg-white dark:bg-neutral-900 shadow-2xl z-50 animate-slide-in-right overflow-hidden flex flex-col">
        {/* Clean Header */}
        <div className="relative bg-primary-600 p-6 text-white">

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Theme Studio</h2>
                <p className="text-white/80 text-sm">Customize your experience</p>
              </div>
            </div>
            <button
              onClick={toggleCustomizer}
              className="w-9 h-9 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Primary Color Section */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide">
              <Palette className="w-4 h-4" />
              <span>Primary Color</span>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {colorPresets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => updateTheming({ primaryColor: preset.value })}
                  className={cn(
                    "group relative h-14 rounded-xl transition-all",
                    config.theming.primaryColor === preset.value
                      ? "ring-2 ring-offset-2 ring-primary-500 scale-105"
                      : "hover:scale-105"
                  )}
                >
                  <div
                    className="absolute inset-0 rounded-xl opacity-100"
                    style={{ backgroundColor: preset.value }}
                  />
                  {config.theming.primaryColor === preset.value && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-neutral-900"></div>
                      </div>
                    </div>
                  )}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                      {preset.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Color Picker */}
            <button
              onClick={() => setShowCustomColor(!showCustomColor)}
              className="w-full mt-6 p-3 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-400"
            >
              <Palette className="w-4 h-4" />
              Custom Color
            </button>

            {showCustomColor && (
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg space-y-3">
                <input
                  type="color"
                  value={config.theming.primaryColor}
                  onChange={(e) => updateTheming({ primaryColor: e.target.value })}
                  className="w-full h-12 rounded-lg cursor-pointer border-2 border-neutral-200 dark:border-neutral-700"
                />
                <input
                  type="text"
                  value={config.theming.primaryColor}
                  onChange={(e) => updateTheming({ primaryColor: e.target.value })}
                  placeholder="#6366f1"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-mono"
                />
              </div>
            )}
          </section>

          {/* Theme Mode Section */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide">
              <Sun className="w-4 h-4" />
              <span>Appearance</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'dark', label: 'Dark', icon: Moon },
                { value: 'system', label: 'Auto', icon: Monitor },
              ].map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.value}
                    onClick={() => updateTheming({ themeMode: mode.value as any })}
                    className={cn(
                      "relative p-4 rounded-xl border-2 transition-all group",
                      config.theming.themeMode === mode.value
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                        : "border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700"
                    )}
                  >
                    <Icon className={cn(
                      "w-6 h-6 mx-auto mb-2",
                      config.theming.themeMode === mode.value
                        ? "text-primary-600 dark:text-primary-400"
                        : "text-neutral-400 dark:text-neutral-500"
                    )} />
                    <span className={cn(
                      "text-xs font-medium block",
                      config.theming.themeMode === mode.value
                        ? "text-primary-700 dark:text-primary-300"
                        : "text-neutral-600 dark:text-neutral-400"
                    )}>
                      {mode.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Layout Options */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide">
              <Layout className="w-4 h-4" />
              <span>Layout</span>
            </div>

            <div className="space-y-3">
              {/* Menu Style */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Menu className="w-4 h-4 text-neutral-500" />
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Menu Style
                    </span>
                  </div>
                  <button
                    onClick={() => updateLayout({ menuCollapsed: !config.layout.menuCollapsed })}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      config.layout.menuCollapsed
                        ? "bg-primary-600"
                        : "bg-neutral-300 dark:bg-neutral-600"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm",
                        config.layout.menuCollapsed ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>
                <p className="text-xs text-neutral-500 pl-6">
                  {config.layout.menuCollapsed ? 'Collapsed' : 'Expanded'}
                </p>
              </div>

              {/* Content Width */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-neutral-500" />
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Content Width
                    </span>
                  </div>
                  <button
                    onClick={() => updateLayout({
                      contentWidth: config.layout.contentWidth === 'compact' ? 'wide' : 'compact'
                    })}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      config.layout.contentWidth === 'wide'
                        ? "bg-primary-600"
                        : "bg-neutral-300 dark:bg-neutral-600"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm",
                        config.layout.contentWidth === 'wide' ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>
                <p className="text-xs text-neutral-500 pl-6">
                  {config.layout.contentWidth === 'wide' ? 'Full Width' : 'Compact'}
                </p>
              </div>

              {/* Semi Dark */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-neutral-500" />
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Semi-Dark Mode
                    </span>
                  </div>
                  <button
                    onClick={() => updateTheming({ semiDark: !config.theming.semiDark })}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      config.theming.semiDark
                        ? "bg-primary-600"
                        : "bg-neutral-300 dark:bg-neutral-600"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm",
                        config.theming.semiDark ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>
                <p className="text-xs text-neutral-500 pl-6">
                  Dark sidebar with light content
                </p>
              </div>

              {/* Skin */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Grid className="w-4 h-4 text-neutral-500" />
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Border Style
                    </span>
                  </div>
                  <button
                    onClick={() => updateTheming({
                      skin: config.theming.skin === 'default' ? 'bordered' : 'default'
                    })}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      config.theming.skin === 'bordered'
                        ? "bg-primary-600"
                        : "bg-neutral-300 dark:bg-neutral-600"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm",
                        config.theming.skin === 'bordered' ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>
                <p className="text-xs text-neutral-500 pl-6">
                  {config.theming.skin === 'bordered' ? 'Bordered cards' : 'Default style'}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 p-4 bg-neutral-50 dark:bg-neutral-900">
          <Button
            onClick={resetToDefaults}
            variant="outline"
            className="w-full group"
          >
            <RotateCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
            Reset to Defaults
          </Button>
        </div>
      </div>
    </>
  );
};
