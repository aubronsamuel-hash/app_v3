import { InputHTMLAttributes } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/Input';

export function SearchInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      <Input className="pl-8" type="search" {...props} />
    </div>
  );
}
