import { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive';
}

export default function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    destructive: 'bg-red-100 text-red-800',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
