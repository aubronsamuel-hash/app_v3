import { InputHTMLAttributes } from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../lib/cn';

export default function SearchInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      <input
        className="pl-7 pr-3 py-2 border rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
      />
    </div>
  );
}
