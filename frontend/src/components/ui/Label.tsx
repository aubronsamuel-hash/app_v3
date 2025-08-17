import { LabelHTMLAttributes } from 'react'
import clsx from 'clsx'

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={clsx('block text-sm font-medium mb-1', className)} {...props} />
}
