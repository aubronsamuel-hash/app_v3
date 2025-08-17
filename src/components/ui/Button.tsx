import { forwardRef, ButtonHTMLAttributes } from 'react';
import { LucideIcon, Plus, Search, Trash2, Menu } from 'lucide-react';
import { cn } from '../../lib/cn';

const variantClasses = {
  default: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  destructive: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'bg-transparent hover:bg-gray-100',
  link: 'underline text-blue-600 hover:text-blue-700',
};

const variantIcons: Record<Variant, LucideIcon | null> = {
  default: Plus,
  secondary: Search,
  destructive: Trash2,
  ghost: Menu,
  link: null,
};

export type Variant = keyof typeof variantClasses;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: LucideIcon | null;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', className, icon, children, ...props }, ref) => {
    const Icon = icon ?? variantIcons[variant];
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          className,
        )}
        {...props}
      >
        {Icon && <Icon className="mr-2 h-4 w-4" aria-hidden="true" />}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
