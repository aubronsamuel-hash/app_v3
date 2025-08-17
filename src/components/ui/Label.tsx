import { forwardRef, LabelHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('block text-sm font-medium text-gray-700 dark:text-gray-300', className)}
      {...props}
    />
  ),
);

Label.displayName = 'Label';

export default Label;
