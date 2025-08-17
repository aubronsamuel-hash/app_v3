import { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
}

export function Button({ variant = 'primary', className, ...props }: Props) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded focus:outline-none focus:ring transition-colors',
        variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
        variant === 'outline' && 'border border-blue-600 text-blue-600 hover:bg-blue-50',
        className
      )}
      {...props}
    />
  );
}
