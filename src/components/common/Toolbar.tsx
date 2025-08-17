import { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export function Toolbar({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center gap-2 mb-4', className)} {...props} />;
}
