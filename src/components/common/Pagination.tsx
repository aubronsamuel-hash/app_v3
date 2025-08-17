import Button from '../ui/Button';

interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
      >
        Prev
      </Button>
      <span className="text-sm">
        {page} / {totalPages}
      </span>
      <Button
        variant="secondary"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
      >
        Next
      </Button>
    </div>
  );
}
