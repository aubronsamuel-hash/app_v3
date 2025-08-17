import { createContext, ReactNode, useContext, useState } from 'react';
import { cn } from '../../lib/cn';

interface TabsContextValue {
  active: string;
  setActive: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

export function Tabs({ defaultValue, children }: { defaultValue: string; children: ReactNode }) {
  const [active, setActive] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ active, setActive }}>{children}</TabsContext.Provider>
  );
}

export function TabsList({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('flex border-b', className)}>{children}</div>;
}

export function TabsTrigger({ value, children }: { value: string; children: ReactNode }) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('TabsTrigger must be used within Tabs');
  const isActive = ctx.active === value;
  return (
    <button
      onClick={() => ctx.setActive(value)}
      className={cn(
        'px-4 py-2 text-sm',
        isActive ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600',
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children }: { value: string; children: ReactNode }) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('TabsContent must be used within Tabs');
  return ctx.active === value ? <div className="p-4">{children}</div> : null;
}
