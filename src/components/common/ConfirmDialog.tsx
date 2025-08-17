import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface Props {
  open: boolean;
  title: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({ open, title, onConfirm, onClose }: Props) {
  return (
    <Modal open={open} onClose={onClose}>
      <p className="mb-4">{title}</p>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => { onConfirm(); onClose(); }}>Confirm</Button>
      </div>
    </Modal>
  );
}
