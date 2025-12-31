import React, { useState } from 'react';
import { Settings, X } from 'lucide-react';
import { useThemeCustomizer } from '@/context/ThemeCustomizerContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const ThemeCustomizer: React.FC = () => {
  const { config, updateTheming, updateLayout, resetToDefaults, isCustomizerOpen, toggleCustomizer } = useThemeCustomizer();

  // Preset colors for quick selection
  const presetColors = [
    '#3b82f6', // Blue
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#ef4444', // Red
    '#f59e0b', // Amber
    '#10b981', // Green
    '#06b6d4', // Cyan
    '#6366f1', // Indigo
  ];

  const [showColorPicker, setShowColorPicker] = useState(false);

  if (!isCustomizerOpen) {
    return (
      <button
        onClick={toggleCustomizer}
        className="fixed bottom-24 right-6 z-50 w-12 h-12 rounded-full bg-primary-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center"
        aria-label="Open theme customizer"
      >
        <Settings className="w-6 h-6" />
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 animate-fade-in"
        onClick={toggleCustomizer}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 w-[360px] h-full bg-white dark:bg-neutral-900 shadow-2xl z-50 animate-slide-in-right overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold">Theme Customizer</h2>
          </div>
          <button
            onClick={toggleCustomizer}
            className="w-8 h-8 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Theming Section */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-4">
              🎨 Theming
            </h3>

            <div className="space-y-4">
              {/* Primary Color */}
              <div>
                <label className="text-sm font-medium mb-2 block">Primary Color</label>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-neutral-300 dark:border-neutral-700 cursor-pointer relative"
                    style={{ backgroundColor: config.theming.primaryColor }}
                    onClick={() => setShowColorPicker(!showColorPicker)}
                  >
                    {showColorPicker && (
                      <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-neutral-800 rounded-lg shadow-xl z-10 border border-neutral-200 dark:border-neutral-700">
                        <div className="grid grid-cols-4 gap-2 mb-3">
                          {presetColors.map((color) => (
                            <button
                              key={color}
                              className="w-10 h-10 rounded-md border-2 border-transparent hover:border-neutral-400 transition-colors"
                              style={{ backgroundColor: color }}
                              onClick={(e) => {
                                e.stopPropagation();
                                updateTheming({ primaryColor: color });
                                setShowColorPicker(false);
                              }}
                            />
                          ))}
                        </div>
                        <input
                          type="color"
                          value={config.theming.primaryColor}
                          onChange={(e) => updateTheming({ primaryColor: e.target.value })}
                          className="w-full h-10 rounded-md cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    value={config.theming.primaryColor}
                    onChange={(e) => updateTheming({ primaryColor: e.target.value })}
                    placeholder="#3b82f6"
                    className="flex-1 px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-mono"
                  />
                </div>
              </div>

              {/* Theme Mode */}
              <div>
                <label className="text-sm font-medium mb-2 block">Theme Mode</label>
                <div className="space-y-2">
                  {(['light', 'dark', 'system'] as const).map((mode) => (
                    <label
                      key={mode}
                      className="flex items-center gap-3 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 p-2 rounded-md transition-colors"
                    >
                      <input
                        type="radio"
                        name="themeMode"
                        value={mode}
                        checked={config.theming.themeMode === mode}
                        onChange={() => updateTheming({ themeMode: mode })}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm capitalize">{mode}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Skin */}
              <div>
                <label className="text-sm font-medium mb-2 block">Skin</label>
                <div className="space-y-2">
                  {(['default', 'bordered'] as const).map((skin) => (
                    <label
                      key={skin}
                      className="flex items-center gap-3 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 p-2 rounded-md transition-colors"
                    >
                      <input
                        type="radio"
                        name="skin"
                        value={skin}
                        checked={config.theming.skin === skin}
                        onChange={() => updateTheming({ skin })}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm capitalize">{skin}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Semi-dark */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <label className="text-sm font-medium block">Semi-dark</label>
                  <p className="text-xs text-neutral-500 mt-1">Dark sidebar with light content</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={config.theming.semiDark}
                  onClick={() => updateTheming({ semiDark: !config.theming.semiDark })}
                  className={cn(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    config.theming.semiDark ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-700'
                  )}
                >
                  <span
                    className={cn(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      config.theming.semiDark ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Layout Section */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-4">
              📐 Layout Options
            </h3>

            <div className="space-y-4">
              {/* Menu */}
              <div>
                <label className="text-sm font-medium mb-2 block">Menu</label>
                <div className="space-y-2">
                  {[
                    { value: false, label: 'Expanded' },
                    { value: true, label: 'Collapsed' },
                  ].map((option) => (
                    <label
                      key={option.label}
                      className="flex items-center gap-3 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 p-2 rounded-md transition-colors"
                    >
                      <input
                        type="radio"
                        name="menuCollapsed"
                        checked={config.layout.menuCollapsed === option.value}
                        onChange={() => updateLayout({ menuCollapsed: option.value })}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Navbar */}
              <div>
                <label className="text-sm font-medium mb-2 block">Navbar</label>
                <div className="space-y-2">
                  {(['sticky', 'static', 'hidden'] as const).map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-3 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 p-2 rounded-md transition-colors"
                    >
                      <input
                        type="radio"
                        name="navbarType"
                        value={type}
                        checked={config.layout.navbarType === type}
                        onChange={() => updateLayout({ navbarType: type })}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Content Width */}
              <div>
                <label className="text-sm font-medium mb-2 block">Content Width</label>
                <div className="space-y-2">
                  {(['compact', 'wide'] as const).map((width) => (
                    <label
                      key={width}
                      className="flex items-center gap-3 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 p-2 rounded-md transition-colors"
                    >
                      <input
                        type="radio"
                        name="contentWidth"
                        value={width}
                        checked={config.layout.contentWidth === width}
                        onChange={() => updateLayout({ contentWidth: width })}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm capitalize">{width}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Direction */}
              <div>
                <label className="text-sm font-medium mb-2 block">Direction</label>
                <div className="space-y-2">
                  {[
                    { value: 'ltr', label: 'LTR (en)' },
                    { value: 'rtl', label: 'RTL (ar)' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 p-2 rounded-md transition-colors"
                    >
                      <input
                        type="radio"
                        name="direction"
                        value={option.value}
                        checked={config.layout.direction === option.value}
                        onChange={() => updateLayout({ direction: option.value as 'ltr' | 'rtl' })}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Reset Button */}
          <Button
            onClick={resetToDefaults}
            variant="outline"
            className="w-full"
          >
            Reset to Defaults
          </Button>
        </div>
      </div>
    </>
  );
};
