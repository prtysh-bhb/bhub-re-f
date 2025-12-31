# Component Library Specification
## Enterprise-Grade React Components for Real Estate Dashboard

> **Architecture**: Composable, accessible, type-safe components
> **Style**: shadcn/ui pattern with Radix UI primitives + Tailwind CSS
> **Principles**: Consistency, flexibility, performance, accessibility

---

## 1. Core Components

### 1.1 Button

**Purpose**: Primary interactive element for actions

#### Variants
```tsx
type ButtonVariant = 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
}
```

#### Visual Specifications

| Variant | Background | Text | Border | Hover | Use Case |
|---------|-----------|------|--------|-------|----------|
| default | neutral-100 | neutral-900 | none | neutral-200 | Standard actions |
| primary | primary-600 | white | none | primary-700 | Primary CTAs |
| secondary | neutral-200 | neutral-900 | none | neutral-300 | Secondary actions |
| destructive | error-600 | white | none | error-700 | Delete, remove |
| outline | transparent | neutral-900 | neutral-300 | neutral-100 | Tertiary actions |
| ghost | transparent | neutral-900 | none | neutral-100 | Subtle actions |
| link | transparent | primary-600 | none | primary-700 | Text links |

#### Sizes

| Size | Height | Padding X | Padding Y | Font Size | Icon Size |
|------|--------|-----------|-----------|-----------|-----------|
| sm | 32px | 12px | 6px | 14px | 16px |
| md | 40px | 16px | 10px | 16px | 20px |
| lg | 48px | 24px | 12px | 18px | 24px |
| icon | 40px | 10px | 10px | - | 20px |

#### Implementation Example

```tsx
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', loading, leftIcon, rightIcon, children, disabled, fullWidth, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',

          // Variants
          {
            'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700': variant === 'default',
            'bg-primary-600 text-white hover:bg-primary-700 shadow-sm': variant === 'primary',
            'bg-neutral-200 text-neutral-900 hover:bg-neutral-300': variant === 'secondary',
            'bg-error-600 text-white hover:bg-error-700 shadow-sm': variant === 'destructive',
            'border border-neutral-300 bg-transparent hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800': variant === 'outline',
            'hover:bg-neutral-100 dark:hover:bg-neutral-800': variant === 'ghost',
            'text-primary-600 underline-offset-4 hover:underline': variant === 'link',
          },

          // Sizes
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-base': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
            'h-10 w-10': size === 'icon',
          },

          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" />}
        {!loading && leftIcon && leftIcon}
        {children}
        {!loading && rightIcon && rightIcon}
      </button>
    );
  }
);
```

#### Usage Examples

```tsx
// Primary action
<Button variant="primary">Save Changes</Button>

// With icon
<Button variant="outline" leftIcon={<Plus />}>Add Property</Button>

// Loading state
<Button variant="primary" loading>Saving...</Button>

// Destructive
<Button variant="destructive" leftIcon={<Trash />}>Delete</Button>

// Icon only
<Button variant="ghost" size="icon">
  <Settings />
</Button>
```

---

### 1.2 Card

**Purpose**: Container for grouped content

#### Anatomy
- `Card` - Main container
- `CardHeader` - Title section
- `CardTitle` - Heading text
- `CardDescription` - Subtitle/description
- `CardContent` - Main content area
- `CardFooter` - Actions/meta

#### Visual Specifications

| Variant | Background | Border | Shadow | Padding |
|---------|-----------|--------|--------|---------|
| default | white / neutral-900 | none | sm | 24px |
| bordered | white / neutral-900 | neutral-200 | none | 24px |
| elevated | white / neutral-900 | none | md | 24px |

#### Implementation

```tsx
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg bg-white dark:bg-neutral-900 shadow-sm',
        'border border-neutral-200 dark:border-neutral-800',
        className
      )}
      {...props}
    />
  )
);

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
);

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-neutral-500 dark:text-neutral-400', className)}
      {...props}
    />
  )
);

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
);
```

#### Usage Examples

```tsx
// Basic card
<Card>
  <CardHeader>
    <CardTitle>Property Analytics</CardTitle>
    <CardDescription>View performance metrics for your listings</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Chart or content */}
  </CardContent>
  <CardFooter>
    <Button variant="outline">View Details</Button>
  </CardFooter>
</Card>

// Stats card
<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
    <DollarSign className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">$45,231.89</div>
    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
  </CardContent>
</Card>
```

---

### 1.3 Input

**Purpose**: Text input fields for forms

#### Variants
- Text, Email, Password, Number, Tel, URL
- Search (with icon)
- With prefix/suffix icons
- With validation states

#### Implementation

```tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, helperText, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              'flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm',
              'ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium',
              'placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-primary-500 focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'dark:border-neutral-700 dark:bg-neutral-900 dark:ring-offset-neutral-950',
              'dark:placeholder:text-neutral-500 dark:focus-visible:ring-neutral-300',
              error && 'border-error-500 focus-visible:ring-error-500',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-neutral-500">{helperText}</p>
        )}
      </div>
    );
  }
);
```

#### Usage Examples

```tsx
// Basic input
<Input placeholder="Enter property address" />

// With icon
<Input
  type="search"
  placeholder="Search properties..."
  leftIcon={<Search className="w-4 h-4" />}
/>

// With error
<Input
  type="email"
  placeholder="Email address"
  error="Please enter a valid email"
/>

// Password with toggle
<Input
  type={showPassword ? 'text' : 'password'}
  placeholder="Password"
  rightIcon={
    <button onClick={() => setShowPassword(!showPassword)}>
      {showPassword ? <EyeOff /> : <Eye />}
    </button>
  }
/>
```

---

### 1.4 Badge

**Purpose**: Status indicators, labels, tags

#### Variants

```tsx
type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'outline';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}
```

#### Visual Specifications

| Variant | Background | Text | Border | Use Case |
|---------|-----------|------|--------|----------|
| default | neutral-100 | neutral-700 | none | Generic labels |
| primary | primary-100 | primary-700 | none | Important info |
| success | success-100 | success-700 | none | Active, approved |
| warning | warning-100 | warning-700 | none | Pending, featured |
| error | error-100 | error-700 | none | Rejected, error |
| info | info-100 | info-700 | none | Informational |
| outline | transparent | neutral-700 | neutral-300 | Subtle labels |

#### Implementation

```tsx
const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
          {
            'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300': variant === 'default',
            'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400': variant === 'primary',
            'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400': variant === 'success',
            'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400': variant === 'warning',
            'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400': variant === 'error',
            'bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-400': variant === 'info',
            'border border-neutral-300 text-neutral-700 dark:border-neutral-700 dark:text-neutral-300': variant === 'outline',
          },
          className
        )}
        {...props}
      />
    );
  }
);
```

#### Usage Examples

```tsx
// Property status
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending Approval</Badge>
<Badge variant="error">Rejected</Badge>

// Property type
<Badge variant="primary">Featured</Badge>
<Badge variant="info">Hot Deal</Badge>

// With icon
<Badge variant="success">
  <Check className="w-3 h-3" />
  Verified
</Badge>
```

---

### 1.5 Data Table

**Purpose**: Display large datasets with sorting, filtering, pagination

#### Features
- Sortable columns
- Row selection
- Pagination
- Column visibility toggle
- Search/filter
- Responsive (horizontal scroll on mobile)
- Skeleton loading state

#### Implementation Architecture

```tsx
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (row: TData) => void;
  loading?: boolean;
}

// Column definition example
const columns: ColumnDef<Property>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Property" />
    ),
    cell: ({ row }) => {
      const property = row.original;
      return (
        <div className="flex items-center gap-3">
          <img
            src={property.image}
            alt={property.title}
            className="w-12 h-12 rounded-md object-cover"
          />
          <div>
            <div className="font-medium">{property.title}</div>
            <div className="text-sm text-neutral-500">{property.location}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge variant={status === 'active' ? 'success' : 'warning'}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const property = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-error-600">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
```

#### Visual Specifications

```css
/* Table styles */
.data-table {
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

/* Header */
.data-table-header {
  background: var(--color-neutral-50);
  border-bottom: 1px solid var(--color-neutral-200);
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-neutral-700);
}

/* Row */
.data-table-row {
  border-bottom: 1px solid var(--color-neutral-100);
  transition: background-color 150ms;
}

.data-table-row:hover {
  background: var(--color-neutral-50);
}

/* Cell padding */
.data-table-cell {
  padding: 1rem;
}
```

---

### 1.6 Modal/Dialog

**Purpose**: Overlay for focused tasks, confirmations, forms

#### Sizes
- `sm` - 400px (confirmations)
- `md` - 600px (forms)
- `lg` - 800px (detailed forms)
- `xl` - 1000px (complex interfaces)
- `full` - 90vw/90vh (maximum content)

#### Implementation

```tsx
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  size = 'md',
  children,
  footer,
}) => {
  if (!open) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw] max-h-[90vh]',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog */}
      <div
        className={cn(
          'relative w-full bg-white dark:bg-neutral-900 rounded-lg shadow-2xl',
          'animate-scaleIn overflow-hidden',
          sizeClasses[size]
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        {/* Header */}
        {(title || description) && (
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
            {title && (
              <h2
                id="dialog-title"
                className="text-xl font-semibold text-neutral-900 dark:text-neutral-100"
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                id="dialog-description"
                className="mt-1 text-sm text-neutral-500 dark:text-neutral-400"
              >
                {description}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}

        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
```

#### Usage Examples

```tsx
// Confirmation dialog
<Dialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Delete Property"
  description="Are you sure you want to delete this property? This action cannot be undone."
  size="sm"
  footer={
    <>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={handleDelete}>
        Delete
      </Button>
    </>
  }
>
  <p>Property: <strong>{property.title}</strong></p>
</Dialog>

// Form dialog
<Dialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Add New Property"
  size="lg"
>
  <PropertyForm onSubmit={handleSubmit} />
</Dialog>
```

---

## 2. Dashboard-Specific Components

### 2.1 Stat Card

**Purpose**: Display key metrics with trend indicators

```tsx
interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down';
    period: string;
  };
  icon?: React.ReactNode;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          {icon && (
            <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600">
              {icon}
            </div>
          )}
        </div>
        <div className="flex items-end justify-between">
          <h3 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {value}
          </h3>
          {change && (
            <div className={cn(
              'flex items-center gap-1 text-sm font-medium',
              change.trend === 'up' ? 'text-success-600' : 'text-error-600'
            )}>
              {change.trend === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{Math.abs(change.value)}%</span>
            </div>
          )}
        </div>
        {change && (
          <p className="mt-2 text-xs text-neutral-500">
            {change.trend === 'up' ? '+' : '-'}{change.value}% from {change.period}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
```

### 2.2 Property Card

**Purpose**: Display property listings in grid/list

```tsx
interface PropertyCardProps {
  property: {
    id: string;
    image: string;
    title: string;
    location: string;
    price: number;
    type: 'sale' | 'rent';
    bedrooms: number;
    bathrooms: number;
    area: number;
    status: 'active' | 'pending' | 'sold';
    featured?: boolean;
  };
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onEdit, onDelete, onClick }) => {
  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.featured && (
            <Badge variant="warning">
              <Star className="w-3 h-3" />
              Featured
            </Badge>
          )}
          <Badge variant={property.type === 'sale' ? 'primary' : 'success'}>
            For {property.type === 'sale' ? 'Sale' : 'Rent'}
          </Badge>
        </div>

        {/* Actions */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-error-600"
            >
              <Trash className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
          <Badge variant={
            property.status === 'active' ? 'success' :
            property.status === 'pending' ? 'warning' : 'default'
          }>
            {property.status}
          </Badge>
        </div>

        <div className="flex items-center gap-1 text-sm text-neutral-500 mb-3">
          <MapPin className="w-4 h-4" />
          <span className="line-clamp-1">{property.location}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-bold text-primary-600">
            ${property.price.toLocaleString()}
            {property.type === 'rent' && <span className="text-sm font-normal text-neutral-500">/mo</span>}
          </div>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 text-sm text-neutral-600">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="w-4 h-4" />
            <span>{property.area} sqft</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```

---

## 3. Form Components

### 3.1 Form Field

**Purpose**: Consistent form field wrapper with label, error, helper text

```tsx
interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ label, required, error, helperText, children }) => {
  return (
    <div className="w-full space-y-2">
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
        {required && <span className="text-error-600 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-error-600 dark:text-error-400 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-neutral-500">{helperText}</p>
      )}
    </div>
  );
};
```

### 3.2 Select

**Purpose**: Dropdown selection (using react-select)

```tsx
interface SelectProps {
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
  multiple?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  searchable = false,
  multiple = false,
}) => {
  return (
    <ReactSelect
      options={options}
      value={options.find(opt => opt.value === value)}
      onChange={(option) => onChange(option?.value || '')}
      placeholder={placeholder}
      isDisabled={disabled}
      isSearchable={searchable}
      isMulti={multiple}
      className="react-select-container"
      classNamePrefix="react-select"
      styles={{
        control: (base, state) => ({
          ...base,
          borderColor: error
            ? 'var(--color-error-500)'
            : state.isFocused
            ? 'var(--color-primary-500)'
            : 'var(--color-neutral-300)',
          boxShadow: state.isFocused
            ? '0 0 0 2px var(--color-primary-500)'
            : 'none',
          '&:hover': {
            borderColor: 'var(--color-neutral-400)',
          },
        }),
      }}
    />
  );
};
```

---

## 4. Navigation Components

### 4.1 Tabs

**Purpose**: Switch between views/sections

```tsx
// Already using @radix-ui/react-tabs
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Usage
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
    <TabsTrigger value="reports">Reports</TabsTrigger>
  </TabsList>

  <TabsContent value="overview">
    {/* Overview content */}
  </TabsContent>

  <TabsContent value="analytics">
    {/* Analytics content */}
  </TabsContent>

  <TabsContent value="reports">
    {/* Reports content */}
  </TabsContent>
</Tabs>
```

---

## 5. Feedback Components

### 5.1 Toast Notifications

**Purpose**: Temporary feedback messages (using Sonner)

```tsx
import { toast } from 'sonner';

// Success
toast.success('Property created successfully!');

// Error
toast.error('Failed to delete property. Please try again.');

// Warning
toast.warning('You have unsaved changes.');

// Info
toast.info('New update available.');

// Loading
const toastId = toast.loading('Uploading images...');
// Later...
toast.success('Images uploaded!', { id: toastId });

// With action
toast('Property published!', {
  action: {
    label: 'View',
    onClick: () => navigate(`/properties/${id}`),
  },
});
```

### 5.2 Skeleton Loader

**Purpose**: Loading placeholder

```tsx
const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800',
        className
      )}
      {...props}
    />
  );
};

// Usage
<Card>
  <CardHeader>
    <Skeleton className="h-6 w-48" />
    <Skeleton className="h-4 w-64 mt-2" />
  </CardHeader>
  <CardContent>
    <Skeleton className="h-40 w-full" />
  </CardContent>
</Card>
```

---

## 6. Component Best Practices

### 6.1 TypeScript

```tsx
// ✅ Good - Explicit prop types with defaults
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  loading = false,
  ...props
}) => { /* ... */ };

// ❌ Bad - Any types, missing props
const Button = (props: any) => { /* ... */ };
```

### 6.2 Composition

```tsx
// ✅ Good - Composable components
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>{content}</CardContent>
</Card>

// ❌ Bad - Monolithic props
<Card title="Title" content={content} />
```

### 6.3 Accessibility

```tsx
// ✅ Good - Semantic HTML, ARIA
<button
  aria-label="Close dialog"
  aria-expanded={isOpen}
  role="button"
>
  <X />
</button>

// ❌ Bad - Div button, no labels
<div onClick={close}>
  <X />
</div>
```

---

**Version**: 1.0.0
**Last Updated**: 2025-12-31
**Status**: Active Development
