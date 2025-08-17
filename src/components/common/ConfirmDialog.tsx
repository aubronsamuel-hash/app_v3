import Button from '../ui/Button';
import Modal from '../ui/Modal';

interface Props {
  open: boolean;
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, title, description, onConfirm, onCancel }: Props) {
  return (
    <Modal open={open} onClose={onCancel}>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {description && <p className="mb-4 text-sm text-gray-600">{description}</p>}
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
}
