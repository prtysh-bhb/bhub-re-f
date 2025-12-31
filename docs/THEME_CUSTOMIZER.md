# Theme Customizer Specification
## Real-Time Layout & Appearance Configurator

> **Purpose**: Allow Admin/Agent users to customize their dashboard appearance in real-time
> **Persistence**: Settings saved to localStorage and user preferences API
> **Scope**: Per-user customization for personalized experience

---

## 1. Customizer UI Design

### 1.1 Visual Layout

```
┌────────────────────────────────────────────┐
│  ⚙️ Theme Customizer               [×]    │ ← Floating panel
├────────────────────────────────────────────┤
│                                            │
│  🎨 THEMING                                │
│  ├─ Primary Color         [████] #3b82f6  │ ← Color picker
│  ├─ Theme Mode            ○ Light         │
│  │                        ● Dark          │ ← Radio buttons
│  │                        ○ System        │
│  ├─ Skin                  ○ Default       │
│  │                        ● Bordered      │ ← Radio buttons
│  └─ Semi-dark             [Toggle OFF]    │ ← Switch
│                                            │
│  📐 LAYOUT OPTIONS                         │
│  ├─ Menu                  ○ Expanded      │
│  │                        ● Collapsed     │ ← Radio buttons
│  ├─ Navbar                ○ Sticky        │
│  │                        ● Static        │ ← Radio buttons
│  │                        ○ Hidden        │
│  ├─ Content Width         ○ Compact       │
│  │                        ● Wide          │ ← Radio buttons
│  └─ Direction             ● LTR (en)      │
│                           ○ RTL (ar)      │ ← Radio buttons
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  Reset to Defaults                    │ │ ← Button
│  └──────────────────────────────────────┘ │
│                                            │
└────────────────────────────────────────────┘
```

### 1.2 Trigger Button

**Location**: Fixed bottom-right corner (above chat widget if present)

```tsx
<button className="fixed bottom-24 right-6 z-50 w-12 h-12 rounded-full bg-primary-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
  <Settings className="w-6 h-6" />
</button>
```

**States**:
- Default: Primary color with shadow
- Hover: Scale 1.05, larger shadow
- Active: Customizer panel open, button shows "×" icon
- Hidden: When customizer is open (replaced by close button in panel)

### 1.3 Panel Design

**Dimensions**:
- Width: 360px (fixed)
- Height: Auto (max-height: 90vh, scrollable)
- Position: Fixed right, slides in from right edge
- Overlay: Semi-transparent backdrop (40% opacity)

**Animation**:
```css
/* Panel entrance */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Backdrop fade */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

---

## 2. Customizer State Structure

### 2.1 TypeScript Interface

```typescript
interface ThemeConfig {
  // Theming
  theming: {
    primaryColor: string;        // Hex color, e.g., "#3b82f6"
    themeMode: 'light' | 'dark' | 'system';
    skin: 'default' | 'bordered';
    semiDark: boolean;           // Dark sidebar + light content
  };

  // Layout Options
  layout: {
    menuCollapsed: boolean;      // Sidebar expanded/collapsed
    navbarType: 'sticky' | 'static' | 'hidden';
    contentWidth: 'compact' | 'wide';
    direction: 'ltr' | 'rtl';    // Text direction
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
```

### 2.2 Context Provider

```typescript
interface ThemeContextType {
  config: ThemeConfig;
  updateTheming: (theming: Partial<ThemeConfig['theming']>) => void;
  updateLayout: (layout: Partial<ThemeConfig['layout']>) => void;
  resetToDefaults: () => void;
  isCustomizerOpen: boolean;
  toggleCustomizer: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ThemeConfig>(() => {
    // Load from localStorage first, fallback to defaults
    const saved = localStorage.getItem('theme-config');
    return saved ? JSON.parse(saved) : defaultThemeConfig;
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Persist to localStorage whenever config changes
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

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
```

### 2.3 DOM Application Logic

```typescript
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
  root.style.setProperty('--color-primary-500', config.theming.primaryColor);

  // Generate lighter/darker shades automatically
  const shades = generateColorShades(config.theming.primaryColor);
  shades.forEach(({ key, value }) => {
    root.style.setProperty(key, value);
  });

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

// Helper: Generate color shades from primary color
function generateColorShades(hex: string): Array<{ key: string; value: string }> {
  // Use a library like polished or chroma.js
  // Example output:
  return [
    { key: '--color-primary-50', value: lighten(0.4, hex) },
    { key: '--color-primary-100', value: lighten(0.3, hex) },
    { key: '--color-primary-200', value: lighten(0.2, hex) },
    // ... up to 950
  ];
}
```

---

## 3. Customizer Components

### 3.1 Main Customizer Component

```tsx
const ThemeCustomizer: React.FC = () => {
  const { config, updateTheming, updateLayout, resetToDefaults, isCustomizerOpen, toggleCustomizer } = useTheme();

  if (!isCustomizerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 animate-fadeIn"
        onClick={toggleCustomizer}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 w-[360px] h-full bg-white dark:bg-neutral-900 shadow-2xl z-50 animate-slideInRight overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold">Theme Customizer</h2>
          </div>
          <button
            onClick={toggleCustomizer}
            className="w-8 h-8 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center"
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
              <ColorPicker
                label="Primary Color"
                value={config.theming.primaryColor}
                onChange={(color) => updateTheming({ primaryColor: color })}
              />

              {/* Theme Mode */}
              <RadioGroup
                label="Theme Mode"
                value={config.theming.themeMode}
                onChange={(mode) => updateTheming({ themeMode: mode as any })}
                options={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'system', label: 'System' },
                ]}
              />

              {/* Skin */}
              <RadioGroup
                label="Skin"
                value={config.theming.skin}
                onChange={(skin) => updateTheming({ skin: skin as any })}
                options={[
                  { value: 'default', label: 'Default' },
                  { value: 'bordered', label: 'Bordered' },
                ]}
              />

              {/* Semi-dark */}
              <SwitchField
                label="Semi-dark"
                description="Dark sidebar with light content"
                checked={config.theming.semiDark}
                onChange={(checked) => updateTheming({ semiDark: checked })}
              />
            </div>
          </section>

          {/* Layout Section */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-4">
              📐 Layout Options
            </h3>

            <div className="space-y-4">
              {/* Menu */}
              <RadioGroup
                label="Menu"
                value={config.layout.menuCollapsed ? 'collapsed' : 'expanded'}
                onChange={(val) => updateLayout({ menuCollapsed: val === 'collapsed' })}
                options={[
                  { value: 'expanded', label: 'Expanded' },
                  { value: 'collapsed', label: 'Collapsed' },
                ]}
              />

              {/* Navbar */}
              <RadioGroup
                label="Navbar"
                value={config.layout.navbarType}
                onChange={(type) => updateLayout({ navbarType: type as any })}
                options={[
                  { value: 'sticky', label: 'Sticky' },
                  { value: 'static', label: 'Static' },
                  { value: 'hidden', label: 'Hidden' },
                ]}
              />

              {/* Content Width */}
              <RadioGroup
                label="Content Width"
                value={config.layout.contentWidth}
                onChange={(width) => updateLayout({ contentWidth: width as any })}
                options={[
                  { value: 'compact', label: 'Compact' },
                  { value: 'wide', label: 'Wide' },
                ]}
              />

              {/* Direction */}
              <RadioGroup
                label="Direction"
                value={config.layout.direction}
                onChange={(dir) => updateLayout({ direction: dir as any })}
                options={[
                  { value: 'ltr', label: 'LTR (en)' },
                  { value: 'rtl', label: 'RTL (ar)' },
                ]}
              />
            </div>
          </section>

          {/* Reset Button */}
          <button
            onClick={resetToDefaults}
            className="w-full py-3 px-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg font-medium transition-colors"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </>
  );
};
```

### 3.2 Color Picker Component

```tsx
interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <div>
      <label className="text-sm font-medium mb-2 block">{label}</label>

      <div className="flex items-center gap-3">
        {/* Color preview */}
        <div
          className="w-12 h-12 rounded-lg border-2 border-neutral-300 dark:border-neutral-700 cursor-pointer relative"
          style={{ backgroundColor: value }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen && (
            <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-neutral-800 rounded-lg shadow-xl z-10 border border-neutral-200 dark:border-neutral-700">
              <div className="grid grid-cols-4 gap-2 mb-3">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    className="w-10 h-10 rounded-md border-2 border-transparent hover:border-neutral-400 transition-colors"
                    style={{ backgroundColor: color }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(color);
                      setIsOpen(false);
                    }}
                  />
                ))}
              </div>

              {/* HTML color input */}
              <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-10 rounded-md cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Hex input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#3b82f6"
          className="flex-1 px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-mono"
        />
      </div>
    </div>
  );
};
```

### 3.3 Radio Group Component

```tsx
interface RadioGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ label, value, onChange, options }) => {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">{label}</label>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-3 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 p-2 rounded-md transition-colors"
          >
            <input
              type="radio"
              name={label}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="w-4 h-4 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
```

### 3.4 Switch Field Component

```tsx
interface SwitchFieldProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const SwitchField: React.FC<SwitchFieldProps> = ({ label, description, checked, onChange }) => {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <label className="text-sm font-medium block">{label}</label>
        {description && (
          <p className="text-xs text-neutral-500 mt-1">{description}</p>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          checked ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-700'
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
            checked ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
    </div>
  );
};
```

---

## 4. Integration Points

### 4.1 AdminLayout Integration

```tsx
const AdminLayout: React.FC = ({ children }) => {
  const { config } = useTheme();

  return (
    <div className={cn(
      'min-h-screen bg-neutral-50 dark:bg-neutral-900',
      config.theming.semiDark && 'semi-dark'
    )}>
      {/* Sidebar */}
      <Sidebar collapsed={config.layout.menuCollapsed} />

      <div className="flex-1" style={{ marginLeft: config.layout.menuCollapsed ? '80px' : '260px' }}>
        {/* Navbar */}
        {config.layout.navbarType !== 'hidden' && (
          <Navbar sticky={config.layout.navbarType === 'sticky'} />
        )}

        {/* Main Content */}
        <main
          className="p-6"
          style={{
            maxWidth: config.layout.contentWidth === 'compact' ? '1280px' : '100%',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {children}
        </main>
      </div>

      {/* Theme Customizer */}
      <ThemeCustomizer />
    </div>
  );
};
```

### 4.2 Sidebar Component Integration

```tsx
const Sidebar: React.FC<{ collapsed: boolean }> = ({ collapsed }) => {
  const { config } = useTheme();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full transition-all duration-300',
        config.theming.semiDark
          ? 'bg-neutral-900 text-neutral-100'
          : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100',
        collapsed ? 'w-20' : 'w-[260px]'
      )}
    >
      {/* Navigation items */}
    </aside>
  );
};
```

---

## 5. Persistence Strategy

### 5.1 localStorage Structure

```json
{
  "theme-config": {
    "theming": {
      "primaryColor": "#3b82f6",
      "themeMode": "dark",
      "skin": "bordered",
      "semiDark": true
    },
    "layout": {
      "menuCollapsed": false,
      "navbarType": "sticky",
      "contentWidth": "compact",
      "direction": "ltr"
    }
  }
}
```

### 5.2 API Sync (Optional)

```typescript
// Save theme preferences to backend
async function syncThemeToAPI(config: ThemeConfig) {
  try {
    await axios.put('/api/user/preferences', {
      theme_config: config,
    });
  } catch (error) {
    console.error('Failed to sync theme preferences:', error);
  }
}

// Load theme preferences from backend
async function loadThemeFromAPI(): Promise<ThemeConfig | null> {
  try {
    const response = await axios.get('/api/user/preferences');
    return response.data.theme_config || null;
  } catch (error) {
    console.error('Failed to load theme preferences:', error);
    return null;
  }
}

// Usage in ThemeProvider
useEffect(() => {
  async function initTheme() {
    const apiConfig = await loadThemeFromAPI();
    if (apiConfig) {
      setConfig(apiConfig);
    }
  }
  initTheme();
}, []);
```

---

## 6. Responsive Behavior

### 6.1 Mobile Devices (< 768px)

- **Customizer Panel**: Full screen (width: 100vw)
- **Trigger Button**: Bottom-right, smaller (48px)
- **Collapsed Menu**: Default on mobile (always collapsed)
- **Navbar**: Always visible (hidden option disabled)

### 6.2 Tablets (768px - 1023px)

- **Customizer Panel**: 320px width (slightly narrower)
- **Menu**: User choice (expanded/collapsed)
- **Content Width**: Always wide (compact disabled)

### 6.3 Desktop (1024px+)

- **Full functionality**: All options available
- **Default state**: As configured by user

---

## 7. Performance Optimizations

### 7.1 CSS Variables for Real-time Updates

```css
/* Instead of re-rendering components */
:root {
  --sidebar-width: 260px;
  --primary-color: #3b82f6;
  --content-max-width: 1280px;
}

.sidebar {
  width: var(--sidebar-width);
  transition: width 300ms ease-in-out;
}

.main-content {
  max-width: var(--content-max-width);
}
```

### 7.2 Debounced Color Updates

```typescript
const debouncedColorUpdate = useMemo(
  () => debounce((color: string) => {
    updateTheming({ primaryColor: color });
  }, 150),
  []
);
```

### 7.3 Lazy Load Customizer

```typescript
const ThemeCustomizer = lazy(() => import('./ThemeCustomizer'));

// In layout
{isCustomizerOpen && (
  <Suspense fallback={<div>Loading...</div>}>
    <ThemeCustomizer />
  </Suspense>
)}
```

---

## 8. Accessibility Considerations

- **Keyboard Navigation**: Tab through all controls, Enter to activate
- **Screen Readers**: Proper labels and ARIA attributes
- **Focus Management**: Trap focus within panel when open
- **Color Contrast**: Validate primary color meets WCAG AA (tool suggestion)
- **Reduced Motion**: Respect `prefers-reduced-motion` for animations

---

## 9. Testing Strategy

### 9.1 Unit Tests

```typescript
describe('ThemeContext', () => {
  it('should load config from localStorage', () => {
    localStorage.setItem('theme-config', JSON.stringify(mockConfig));
    const { result } = renderHook(() => useTheme());
    expect(result.current.config).toEqual(mockConfig);
  });

  it('should update theming settings', () => {
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.updateTheming({ themeMode: 'dark' });
    });
    expect(result.current.config.theming.themeMode).toBe('dark');
  });

  it('should reset to defaults', () => {
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.resetToDefaults();
    });
    expect(result.current.config).toEqual(defaultThemeConfig);
  });
});
```

### 9.2 Integration Tests

- Test DOM updates when config changes
- Verify localStorage persistence
- Check CSS variable application
- Validate responsive behavior

---

## 10. Implementation Checklist

- [ ] Create `ThemeContext.tsx` with state management
- [ ] Build `ThemeCustomizer.tsx` main component
- [ ] Implement `ColorPicker`, `RadioGroup`, `SwitchField` sub-components
- [ ] Add `applyThemeToDOM()` function
- [ ] Integrate with `AdminLayout` and `AgentLayout`
- [ ] Update `Sidebar` to respect collapsed state
- [ ] Update `Navbar` to respect position type
- [ ] Add localStorage persistence
- [ ] (Optional) Add API sync for user preferences
- [ ] Add color shade generator utility
- [ ] Implement responsive behavior
- [ ] Add keyboard navigation and focus management
- [ ] Write unit and integration tests
- [ ] Add documentation for users

---

**Version**: 1.0.0
**Last Updated**: 2025-12-31
**Status**: Ready for Implementation
