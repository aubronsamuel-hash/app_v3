import { HTMLAttributes } from 'react'
import clsx from 'clsx'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('border rounded p-4 bg-white dark:bg-gray-800', className)} {...props} />
}
