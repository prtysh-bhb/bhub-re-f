# Implementation Guide
## React Best Practices for Real Estate Dashboard

> **Objective**: Scalable, maintainable, performant React application
> **Stack**: React 19 + TypeScript + Vite + Tailwind CSS
> **Approach**: Component-first, type-safe, accessible

---

## 1. Project Structure

### 1.1 Recommended Directory Organization

```
src/
├── components/              # Reusable components
│   ├── ui/                  # Base UI components (shadcn pattern)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── layout/              # Layout components
│   │   ├── AdminLayout.tsx
│   │   ├── AgentLayout.tsx
│   │   ├── Topbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── PageTemplate.tsx
│   ├── dashboard/           # Dashboard-specific components
│   │   ├── StatCard.tsx
│   │   ├── RecentActivity.tsx
│   │   └── ...
│   ├── property/            # Property-related components
│   │   ├── PropertyCard.tsx
│   │   ├── PropertyForm.tsx
│   │   ├── PropertyTable.tsx
│   │   └── ...
│   ├── forms/               # Form components
│   │   ├── FormField.tsx
│   │   ├── Select.tsx
│   │   ├── DatePicker.tsx
│   │   └── ...
│   └── shared/              # Shared components
│       ├── DataTable.tsx
│       ├── EmptyState.tsx
│       ├── ErrorBoundary.tsx
│       └── ...
│
├── pages/                   # Page components
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── AgentsPage.tsx
│   │   ├── CustomersPage.tsx
│   │   └── ...
│   └── agent/
│       ├── AgentDashboard.tsx
│       ├── PropertiesPage.tsx
│       ├── LeadsPage.tsx
│       └── ...
│
├── context/                 # React Context providers
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   └── NotificationContext.tsx
│
├── hooks/                   # Custom React hooks
│   ├── useAuth.ts
│   ├── useTheme.ts
│   ├── useMediaQuery.ts
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── ...
│
├── api/                     # API layer
│   ├── client.ts           # Axios instance
│   ├── admin/
│   │   ├── properties.ts
│   │   ├── agents.ts
│   │   └── ...
│   └── agent/
│       ├── properties.ts
│       └── ...
│
├── lib/                     # Utility libraries
│   ├── utils.ts            # cn() helper, formatters
│   ├── validations.ts      # Form validation schemas
│   ├── constants.ts        # App constants
│   └── ...
│
├── types/                   # TypeScript types
│   ├── models.ts           # Data models
│   ├── api.ts              # API types
│   └── components.ts       # Component prop types
│
├── styles/                  # Global styles
│   ├── globals.css         # Tailwind + design tokens
│   └── animations.css      # Custom animations
│
└── App.tsx                  # Main app with routes
```

---

## 2. Component Development

### 2.1 Component Architecture Pattern

```tsx
// 1. Import dependencies
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

// 2. Define types/interfaces
interface ComponentProps {
  // Props definition
  variant?: 'default' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

// 3. Component implementation
export const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ variant = 'default', size = 'md', disabled, className, children, ...props }, ref) => {
    // 4. Hooks (top level)
    const [state, setState] = useState(false);

    // 5. Effects
    useEffect(() => {
      // Side effects
    }, []);

    // 6. Event handlers
    const handleClick = () => {
      // Logic
    };

    // 7. Computed values
    const classes = cn(
      'base-classes',
      {
        'variant-classes': variant === 'primary',
      },
      className
    );

    // 8. Render
    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

// 9. Display name (for debugging)
Component.displayName = 'Component';
```

### 2.2 Component Best Practices

#### DO ✅

```tsx
// Explicit prop types with defaults
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ variant = 'default', size = 'md', ...props }) => {
  // Implementation
};

// Composable components
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Controlled components
const [value, setValue] = useState('');
<Input value={value} onChange={(e) => setValue(e.target.value)} />

// Error boundaries for sections
<ErrorBoundary fallback={<ErrorFallback />}>
  <DashboardSection />
</ErrorBoundary>

// Loading states
{loading ? <Skeleton /> : <Content />}

// Empty states
{data.length === 0 ? <EmptyState /> : <DataTable data={data} />}
```

#### DON'T ❌

```tsx
// Avoid any types
const Button = (props: any) => { /* ... */ };

// Avoid monolithic props
<Card title="..." content="..." footer="..." />  // ❌
<Card>                                            // ✅
  <CardHeader>{title}</CardHeader>
  <CardContent>{content}</CardContent>
</Card>

// Avoid inline styles (use Tailwind)
<div style={{ padding: '16px' }}>  // ❌
<div className="p-4">              // ✅

// Avoid logic in JSX
<div>
  {users.filter(u => u.active).map(u => (  // ❌
    <UserCard key={u.id} user={u} />
  ))}
</div>

// Better:
const activeUsers = users.filter(u => u.active);  // ✅
<div>
  {activeUsers.map(u => (
    <UserCard key={u.id} user={u} />
  ))}
</div>
```

---

## 3. State Management

### 3.1 State Classification

| Type | Solution | Example |
|------|----------|---------|
| Local component state | `useState` | Form inputs, toggles, modals |
| Shared state across tree | Context API | Auth, theme, notifications |
| Server state | React Query (optional) | API data, caching |
| Form state | React Hook Form | Complex forms with validation |
| URL state | React Router params/search | Filters, pagination, tabs |

### 3.2 Context Pattern

```tsx
// context/ThemeContext.tsx
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

### 3.3 Custom Hooks

```tsx
// hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 300);

useEffect(() => {
  if (debouncedSearch) {
    searchProperties(debouncedSearch);
  }
}, [debouncedSearch]);

// hooks/useLocalStorage.ts
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

// hooks/useMediaQuery.ts
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// Usage
const isMobile = useMediaQuery('(max-width: 767px)');
```

---

## 4. API Integration

### 4.1 Axios Setup

```tsx
// api/client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 4.2 API Service Pattern

```tsx
// api/admin/properties.ts
import { apiClient } from '../client';
import type { Property, PropertyFilters } from '@/types/models';

export const propertyApi = {
  // Get all properties
  getAll: async (filters?: PropertyFilters) => {
    const { data } = await apiClient.get<Property[]>('/admin/properties', {
      params: filters,
    });
    return data;
  },

  // Get single property
  getById: async (id: string) => {
    const { data } = await apiClient.get<Property>(`/admin/properties/${id}`);
    return data;
  },

  // Create property
  create: async (property: Partial<Property>) => {
    const { data } = await apiClient.post<Property>('/admin/properties', property);
    return data;
  },

  // Update property
  update: async (id: string, property: Partial<Property>) => {
    const { data } = await apiClient.put<Property>(`/admin/properties/${id}`, property);
    return data;
  },

  // Delete property
  delete: async (id: string) => {
    await apiClient.delete(`/admin/properties/${id}`);
  },

  // Upload images
  uploadImages: async (id: string, images: File[]) => {
    const formData = new FormData();
    images.forEach((image) => formData.append('images', image));

    const { data } = await apiClient.post(`/admin/properties/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
```

### 4.3 Using API in Components

```tsx
// pages/admin/PropertiesPage.tsx
import { useState, useEffect } from 'react';
import { propertyApi } from '@/api/admin/properties';
import { toast } from 'sonner';

export const PropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await propertyApi.getAll();
        setProperties(data);
      } catch (err) {
        setError('Failed to load properties');
        toast.error('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Delete handler
  const handleDelete = async (id: string) => {
    try {
      await propertyApi.delete(id);
      setProperties(prev => prev.filter(p => p.id !== id));
      toast.success('Property deleted successfully');
    } catch (err) {
      toast.error('Failed to delete property');
    }
  };

  if (loading) return <Skeleton />;
  if (error) return <ErrorState message={error} />;
  if (properties.length === 0) return <EmptyState />;

  return (
    <div className="grid grid-cols-3 gap-6">
      {properties.map(property => (
        <PropertyCard
          key={property.id}
          property={property}
          onDelete={() => handleDelete(property.id)}
        />
      ))}
    </div>
  );
};
```

---

## 5. Form Management

### 5.1 React Hook Form + Zod Validation

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schema
const propertySchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  type: z.enum(['sale', 'rent']),
  bedrooms: z.number().int().positive(),
  bathrooms: z.number().int().positive(),
  area: z.number().positive(),
  location: z.string().min(1, 'Location is required'),
});

type PropertyFormData = z.infer<typeof propertySchema>;

export const PropertyForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      type: 'sale',
      bedrooms: 1,
      bathrooms: 1,
    },
  });

  const onSubmit = async (data: PropertyFormData) => {
    try {
      await propertyApi.create(data);
      toast.success('Property created successfully');
      reset();
    } catch (error) {
      toast.error('Failed to create property');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        label="Property Title"
        required
        error={errors.title?.message}
      >
        <Input {...register('title')} placeholder="Enter property title" />
      </FormField>

      <FormField
        label="Description"
        required
        error={errors.description?.message}
      >
        <textarea
          {...register('description')}
          className="w-full p-3 border rounded-lg"
          rows={4}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Price" required error={errors.price?.message}>
          <Input
            {...register('price', { valueAsNumber: true })}
            type="number"
            placeholder="0"
          />
        </FormField>

        <FormField label="Type" required error={errors.type?.message}>
          <select {...register('type')} className="w-full p-3 border rounded-lg">
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </FormField>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <FormField label="Bedrooms" required error={errors.bedrooms?.message}>
          <Input
            {...register('bedrooms', { valueAsNumber: true })}
            type="number"
            min="1"
          />
        </FormField>

        <FormField label="Bathrooms" required error={errors.bathrooms?.message}>
          <Input
            {...register('bathrooms', { valueAsNumber: true })}
            type="number"
            min="1"
          />
        </FormField>

        <FormField label="Area (sqft)" required error={errors.area?.message}>
          <Input
            {...register('area', { valueAsNumber: true })}
            type="number"
          />
        </FormField>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" type="button" onClick={() => reset()}>
          Reset
        </Button>
        <Button variant="primary" type="submit" loading={isSubmitting}>
          Create Property
        </Button>
      </div>
    </form>
  );
};
```

---

## 6. Performance Optimization

### 6.1 Code Splitting

```tsx
// Lazy load pages
import { lazy, Suspense } from 'react';

const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const PropertiesPage = lazy(() => import('@/pages/admin/PropertiesPage'));

// In routes
<Route
  path="/admin/dashboard"
  element={
    <Suspense fallback={<PageLoader />}>
      <AdminDashboard />
    </Suspense>
  }
/>
```

### 6.2 Memoization

```tsx
// useMemo for expensive calculations
const sortedProperties = useMemo(() => {
  return properties.sort((a, b) => b.price - a.price);
}, [properties]);

// useCallback for event handlers passed to children
const handleDelete = useCallback((id: string) => {
  // Delete logic
}, []);

// React.memo for components that re-render often
export const PropertyCard = React.memo<PropertyCardProps>(({ property }) => {
  // Component logic
});
```

### 6.3 Virtual Scrolling for Long Lists

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

export const PropertyList: React.FC<{ properties: Property[] }> = ({ properties }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: properties.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200, // Estimated row height
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const property = properties[virtualItem.index];
          return (
            <div
              key={property.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <PropertyCard property={property} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

### 6.4 Image Optimization

```tsx
// Lazy load images
import { LazyLoadImage } from 'react-lazy-load-image-component';

<LazyLoadImage
  src={property.image}
  alt={property.title}
  effect="blur"
  className="w-full h-48 object-cover"
/>

// Or use native loading="lazy"
<img
  src={property.image}
  alt={property.title}
  loading="lazy"
  className="w-full h-48 object-cover"
/>
```

---

## 7. TypeScript Best Practices

### 7.1 Type Definitions

```tsx
// types/models.ts
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'sale' | 'rent';
  status: 'active' | 'pending' | 'sold' | 'archived';
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: string;
  images: string[];
  agentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  properties: Property[];
  totalSales: number;
  rating: number;
  status: 'active' | 'inactive';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'customer';
  avatar?: string;
}

// types/api.ts
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface PropertyFilters {
  type?: 'sale' | 'rent';
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  location?: string;
  search?: string;
}
```

### 7.2 Generic Components

```tsx
// Generic DataTable
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({ data, columns, onRowClick }: DataTableProps<T>) {
  // Implementation
}

// Usage
<DataTable<Property>
  data={properties}
  columns={propertyColumns}
  onRowClick={(property) => navigate(`/properties/${property.id}`)}
/>
```

---

## 8. Testing Strategy

### 8.1 Component Testing (Vitest + React Testing Library)

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies variant classes', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByText('Primary');
    expect(button).toHaveClass('bg-primary-600');
  });
});
```

### 8.2 Hook Testing

```tsx
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

describe('useLocalStorage', () => {
  it('returns initial value', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('updates value', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
  });

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'initial'));

    act(() => {
      result.current[1]('persisted');
    });

    expect(localStorage.getItem('test')).toBe(JSON.stringify('persisted'));
  });
});
```

---

## 9. Accessibility Checklist

- [ ] Semantic HTML (`<button>`, `<nav>`, `<main>`, `<header>`)
- [ ] ARIA labels for icon-only buttons (`aria-label`)
- [ ] ARIA attributes for interactive elements (`aria-expanded`, `aria-selected`)
- [ ] Keyboard navigation (Tab, Enter, Escape, Arrow keys)
- [ ] Focus visible styles (`:focus-visible`)
- [ ] Color contrast WCAG AA compliance (4.5:1 for text)
- [ ] Alt text for images
- [ ] Form labels and error messages
- [ ] Skip to main content link
- [ ] Heading hierarchy (h1 → h2 → h3)

---

## 10. Development Workflow

### 10.1 Git Workflow

```bash
# Feature branch
git checkout -b feature/property-filters

# Commit convention
git commit -m "feat: add property price range filter"
git commit -m "fix: resolve sidebar collapse animation"
git commit -m "refactor: extract PropertyCard component"
git commit -m "docs: update component library docs"
git commit -m "test: add PropertyForm validation tests"

# Types: feat, fix, refactor, docs, test, style, chore
```

### 10.2 Code Review Checklist

- [ ] TypeScript types are defined and accurate
- [ ] No `any` types without justification
- [ ] Components follow established patterns
- [ ] Accessibility requirements met
- [ ] Error states handled
- [ ] Loading states shown
- [ ] Empty states provided
- [ ] Responsive design implemented
- [ ] Performance optimizations applied (memoization, lazy loading)
- [ ] No console.log() left in code
- [ ] Tests written for new functionality

---

## 11. Deployment Checklist

- [ ] Environment variables configured (`.env.production`)
- [ ] Build succeeds without warnings (`npm run build`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Tests pass (`npm run test`)
- [ ] Bundle size optimized (<500KB gzipped)
- [ ] Images optimized (WebP, lazy loading)
- [ ] API endpoints point to production
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Analytics configured (Google Analytics, etc.)
- [ ] SEO meta tags added
- [ ] PWA manifest configured
- [ ] HTTPS enabled
- [ ] CORS configured on backend

---

## 12. Performance Benchmarks

### Target Metrics

- **Initial Load**: < 2 seconds
- **Time to Interactive**: < 3 seconds
- **First Contentful Paint**: < 1.5 seconds
- **Largest Contentful Paint**: < 2.5 seconds
- **Cumulative Layout Shift**: < 0.1
- **Bundle Size**: < 500KB gzipped

### Monitoring Tools

- Lighthouse CI
- Web Vitals
- Bundle Analyzer
- React DevTools Profiler

---

**Version**: 1.0.0
**Last Updated**: 2025-12-31
**Status**: Ready for Implementation
