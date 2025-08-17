import { HTMLAttributes } from 'react'
import clsx from 'clsx'

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={clsx('px-2 py-0.5 text-xs rounded bg-gray-200 dark:bg-gray-700', className)} {...props} />
}
