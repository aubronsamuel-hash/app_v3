import { PropsWithChildren } from 'react';

export function Badge({ children }: PropsWithChildren) {
  return <span className="inline-block rounded bg-gray-200 px-2 py-1 text-xs">{children}</span>;
}
