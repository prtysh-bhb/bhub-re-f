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
    primaryColor: '#6366f1', // Premium indigo
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

// Helper to convert hex to RGB
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
    : '99 102 241'; // fallback to default indigo
}

// Helper to lighten/darken color
function adjustColor(rgb: string, percent: number): string {
  const [r, g, b] = rgb.split(' ').map(Number);
  const adjust = (val: number) => Math.max(0, Math.min(255, Math.round(val + (255 - val) * percent / 100)));
  const darken = (val: number) => Math.max(0, Math.min(255, Math.round(val * (1 - percent / 100))));

  if (percent > 0) {
    return `${adjust(r)} ${adjust(g)} ${adjust(b)}`;
  } else {
    return `${darken(r)} ${darken(g)} ${darken(b)}`;
  }
}

// Helper function to apply theme to DOM
function applyThemeToDOM(config: ThemeConfig) {
  const root = document.documentElement;

  // Debug logging
  console.log('🎨 Applying theme to DOM:', {
    primaryColor: config.theming.primaryColor,
    themeMode: config.theming.themeMode
  });

  // 1. Theme Mode (light/dark)
  if (config.theming.themeMode === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  } else {
    root.classList.toggle('dark', config.theming.themeMode === 'dark');
  }

  // 2. Primary Color (CSS variable)
  root.style.setProperty('--color-primary-custom', config.theming.primaryColor);

  // Convert primary color to RGB and create shades
  const baseRgb = hexToRgb(config.theming.primaryColor);

  console.log('🎨 Base RGB:', baseRgb);
  console.log('🎨 Setting CSS variables for primary color...');

  root.style.setProperty('--color-primary-50', adjustColor(baseRgb, 95));
  root.style.setProperty('--color-primary-100', adjustColor(baseRgb, 90));
  root.style.setProperty('--color-primary-200', adjustColor(baseRgb, 75));
  root.style.setProperty('--color-primary-300', adjustColor(baseRgb, 60));
  root.style.setProperty('--color-primary-400', adjustColor(baseRgb, 40));
  root.style.setProperty('--color-primary-500', baseRgb);
  root.style.setProperty('--color-primary-600', adjustColor(baseRgb, -10));
  root.style.setProperty('--color-primary-700', adjustColor(baseRgb, -25));
  root.style.setProperty('--color-primary-800', adjustColor(baseRgb, -40));
  root.style.setProperty('--color-primary-900', adjustColor(baseRgb, -60));

  console.log('✅ CSS variables set successfully');

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
    console.log('🔄 Updating theming:', theming);
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
