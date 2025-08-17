import { HTMLAttributes } from 'react'
import clsx from 'clsx'

export function Toolbar({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('flex items-center gap-2 mb-4', className)} {...props} />
}
