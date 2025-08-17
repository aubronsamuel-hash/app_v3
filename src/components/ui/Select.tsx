import { SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn('border rounded px-2 py-1 w-full', className)} {...props} />;
}
