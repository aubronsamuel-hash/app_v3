import { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export default function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded bg-gray-200 dark:bg-gray-700', className)}
      {...props}
    />
  );
}
