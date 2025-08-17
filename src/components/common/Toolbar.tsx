import { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export default function Toolbar({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-between gap-2 mb-4', className)}
      {...props}
    />
  );
}
