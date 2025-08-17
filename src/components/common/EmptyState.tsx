import { ReactNode } from 'react';
import Button from '../ui/Button';

interface Props {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
}

export default function EmptyState({ title, actionLabel, onAction, children }: Props) {
  return (
    <div className="text-center py-10">
      <p className="text-sm text-gray-600 mb-4">{title}</p>
      {children}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="secondary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
