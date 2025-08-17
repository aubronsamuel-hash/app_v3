import { Button } from '../ui/Button';

interface Props {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, total, pageSize, onPageChange }: Props) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="flex items-center gap-2">
      <Button onClick={() => onPageChange(page - 1)} disabled={page <= 1} variant="outline">
        Prev
      </Button>
      <span>
        {page} / {pages}
      </span>
      <Button onClick={() => onPageChange(page + 1)} disabled={page >= pages} variant="outline">
        Next
      </Button>
    </div>
  );
}
