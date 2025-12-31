import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme configuration interface
export interface ThemeConfig {
  theming: {
    primaryColor: string;
    themeMode: 'light' | 'dark' | 'system';
    skin: 'default' | 'bordered';
    semiDark: boolean;
  };
  layout: {
    menuCollapsed: boolean;
    navbarType: 'sticky' | 'static' | 'hidden';
    contentWidth: 'compact' | 'wide';
    direction: 'ltr' | 'rtl';
  };
}

// Default configuration
const defaultThemeConfig: ThemeConfig = {
  theming: {
    primaryColor: '#3b82f6',
    themeMode: 'light',
    skin: 'default',
    semiDark: false,
  },
  layout: {
    menuCollapsed: false,
    navbarType: 'sticky',
    contentWidth: 'compact',
    direction: 'ltr',
  },
};

// Context type
interface ThemeContextType {
  config: ThemeConfig;
  updateTheming: (theming: Partial<ThemeConfig['theming']>) => void;
  updateLayout: (layout: Partial<ThemeConfig['layout']>) => void;
  resetToDefaults: () => void;
  isCustomizerOpen: boolean;
  toggleCustomizer: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper function to apply theme to DOM
function applyThemeToDOM(config: ThemeConfig) {
  const root = document.documentElement;

  // 1. Theme Mode (light/dark)
  if (config.theming.themeMode === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  } else {
    root.classList.toggle('dark', config.theming.themeMode === 'dark');
  }

  // 2. Primary Color (CSS variable)
  root.style.setProperty('--color-primary-custom', config.theming.primaryColor);

  // 3. Skin (bordered adds borders to cards)
  root.classList.toggle('skin-bordered', config.theming.skin === 'bordered');

  // 4. Semi-dark (sidebar dark, content light)
  root.classList.toggle('semi-dark', config.theming.semiDark);

  // 5. Direction (RTL support)
  root.setAttribute('dir', config.layout.direction);

  // 6. Menu Collapsed State (via CSS variable for sidebar width)
  root.style.setProperty(
    '--sidebar-width',
    config.layout.menuCollapsed ? '80px' : '260px'
  );

  // 7. Navbar Type (sticky/static/hidden)
  root.setAttribute('data-navbar', config.layout.navbarType);

  // 8. Content Width (compact/wide)
  root.style.setProperty(
    '--content-max-width',
    config.layout.contentWidth === 'compact' ? '1280px' : '100%'
  );
}

export const ThemeCustomizerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ThemeConfig>(() => {
    // Load from localStorage first, fallback to defaults
    const saved = localStorage.getItem('theme-config');
    return saved ? JSON.parse(saved) : defaultThemeConfig;
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Persist to localStorage and apply to DOM whenever config changes
  useEffect(() => {
    localStorage.setItem('theme-config', JSON.stringify(config));
    applyThemeToDOM(config);
  }, [config]);

  const updateTheming = (theming: Partial<ThemeConfig['theming']>) => {
    setConfig(prev => ({
      ...prev,
      theming: { ...prev.theming, ...theming },
    }));
  };

  const updateLayout = (layout: Partial<ThemeConfig['layout']>) => {
    setConfig(prev => ({
      ...prev,
      layout: { ...prev.layout, ...layout },
    }));
  };

  const resetToDefaults = () => {
    setConfig(defaultThemeConfig);
    localStorage.removeItem('theme-config');
  };

  const toggleCustomizer = () => setIsCustomizerOpen(prev => !prev);

  return (
    <ThemeContext.Provider
      value={{
        config,
        updateTheming,
        updateLayout,
        resetToDefaults,
        isCustomizerOpen,
        toggleCustomizer,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useThemeCustomizer = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeCustomizer must be used within ThemeCustomizerProvider');
  }
  return context;
};
