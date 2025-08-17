import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table';
import SearchInput from '../components/common/SearchInput';
import Toolbar from '../components/common/Toolbar';
import EmptyState from '../components/common/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { toast } from '../components/ui/Toast';
import {
  useTemplatesList,
  useCreateTemplate,
  useUpdateTemplate,
  useDeleteTemplate,
  useApplyTemplate,
} from '../hooks/useTemplates';
import type { Template, TemplateInput } from '../types/template';

interface PositionForm {
  label: string;
  count: number;
  skills: string;
}

function TemplateForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Template;
  onSave: (data: TemplateInput) => Promise<void> | void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [positions, setPositions] = useState<PositionForm[]>(
    initial?.positions.map((p) => ({
      label: p.label,
      count: p.count,
      skills: Object.keys(p.skills || {}).join(', '),
    })) ?? [{ label: '', count: 1, skills: '' }],
  );
  const [errors, setErrors] = useState<boolean[]>(positions.map(() => false));

  const updatePosition = (idx: number, field: keyof PositionForm, value: string) => {
    const next = positions.slice();
    if (field === 'count') {
      next[idx].count = Number(value);
    } else if (field === 'label') {
      next[idx].label = value;
    } else {
      next[idx].skills = value;
    }
    setPositions(next);
  };

  const addPosition = () => {
    setPositions([...positions, { label: '', count: 1, skills: '' }]);
    setErrors([...errors, false]);
  };

  const removePosition = (idx: number) => {
    setPositions(positions.filter((_, i) => i !== idx));
    setErrors(errors.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = positions.map((p) => p.count < 1);
    setErrors(errs);
    if (errs.some(Boolean)) return;
    const data: TemplateInput = {
      title,
      notes,
      positions: positions.map((p) => ({
        label: p.label,
        count: p.count,
        skills: p.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .reduce<Record<string, unknown>>((acc, s) => {
            acc[s] = true;
            return acc;
          }, {}),
      })),
    };
    await onSave(data);
  };

  return (
    <Modal open onClose={onCancel}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Positions</h3>
          {positions.map((p, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-2 items-end">
              <div>
                <label className="block text-xs" htmlFor={`label-${idx}`}>
                  Label
                </label>
                <input
                  id={`label-${idx}`}
                  className="w-full border rounded px-2 py-1"
                  value={p.label}
                  onChange={(e) => updatePosition(idx, 'label', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs" htmlFor={`count-${idx}`}>
                  Count
                </label>
                <input
                  id={`count-${idx}`}
                  type="number"
                  min={1}
                  className="w-full border rounded px-2 py-1"
                  value={p.count}
                  onChange={(e) => updatePosition(idx, 'count', e.target.value)}
                  aria-invalid={errors[idx] || undefined}
                />
                {errors[idx] && (
                  <span className="text-xs text-red-600">Must be ≥ 1</span>
                )}
              </div>
              <div>
                <label className="block text-xs" htmlFor={`skills-${idx}`}>
                  Skills
                </label>
                <input
                  id={`skills-${idx}`}
                  className="w-full border rounded px-2 py-1"
                  value={p.skills}
                  onChange={(e) => updatePosition(idx, 'skills', e.target.value)}
                  placeholder="comma separated"
                />
              </div>
              <div className="col-span-3 text-right">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removePosition(idx)}
                  className="text-xs"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addPosition}>
            Add Position
          </Button>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            className="w-full border rounded px-3 py-2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Modal>
  );
}

function ApplyDialog({
  template,
  onClose,
}: {
  template: Template;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const apply = useApplyTemplate(template.id);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [titleOverride, setTitleOverride] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const mission = await apply.mutateAsync({
        start,
        end,
        title_override: titleOverride || undefined,
        notes: notes || undefined,
      });
      toast.success('Template applied');
      navigate(`/missions/${mission.id}`);
    } catch (err) {
      const message = (err as { message?: string }).message || 'Failed';
      toast.error(message);
    }
  };

  return (
    <Modal open onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold">Apply Template</h2>
        <div>
          <label className="block text-sm" htmlFor="start">
            Start
          </label>
          <input
            id="start"
            type="datetime-local"
            className="w-full border rounded px-2 py-1"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm" htmlFor="end">
            End
          </label>
          <input
            id="end"
            type="datetime-local"
            className="w-full border rounded px-2 py-1"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm" htmlFor="title_override">
            Title Override
          </label>
          <input
            id="title_override"
            className="w-full border rounded px-2 py-1"
            value={titleOverride}
            onChange={(e) => setTitleOverride(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm" htmlFor="apply_notes">
            Notes
          </label>
          <textarea
            id="apply_notes"
            className="w-full border rounded px-2 py-1"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Apply</Button>
        </div>
      </form>
    </Modal>
  );
}

export default function Templates() {
  const [search, setSearch] = useState('');
  const list = useTemplatesList(search ? { q: search } : undefined);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Template | undefined>();
  const create = useCreateTemplate();
  const update = useUpdateTemplate(editing?.id ?? 0);
  const [applyTemplate, setApplyTemplate] = useState<Template | null>(null);
  const del = useDeleteTemplate();
  const [confirmDelete, setConfirmDelete] = useState<Template | null>(null);

  const openNew = () => {
    setEditing(undefined);
    setFormOpen(true);
  };
  const openEdit = (t: Template) => {
    setEditing(t);
    setFormOpen(true);
  };
  const handleSave = async (data: TemplateInput) => {
    try {
      if (editing) {
        await update.mutateAsync(data);
        toast.success('Template updated');
      } else {
        await create.mutateAsync(data);
        toast.success('Template created');
      }
      setFormOpen(false);
    } catch (err) {
      const message = (err as { message?: string }).message || 'Failed';
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await del.mutateAsync(confirmDelete.id);
      toast.success('Template deleted');
    } catch (err) {
      const message = (err as { message?: string }).message || 'Failed';
      toast.error(message);
    }
    setConfirmDelete(null);
  };

  return (
    <div>
      <Toolbar>
        <SearchInput
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={openNew}>New template</Button>
      </Toolbar>
      {list.isLoading ? (
        <Skeleton className="h-32" />
      ) : list.data && list.data.length > 0 ? (
        <Table>
          <THead>
            <TR>
              <TH>Title</TH>
              <TH>Positions</TH>
              <TH>Actions</TH>
            </TR>
          </THead>
          <TBody>
            {list.data.map((t) => (
              <TR key={t.id}>
                <TD>{t.title}</TD>
                <TD>{t.positions.length}</TD>
                <TD className="space-x-2">
                  <Button
                    variant="link"
                    onClick={() => openEdit(t)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="link"
                    onClick={() => setConfirmDelete(t)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="link"
                    onClick={() => setApplyTemplate(t)}
                  >
                    Apply
                  </Button>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      ) : (
        <EmptyState title="No templates" actionLabel="New template" onAction={openNew} />
      )}
      {formOpen && (
        <TemplateForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => setFormOpen(false)}
        />
      )}
      {applyTemplate && (
        <ApplyDialog
          template={applyTemplate}
          onClose={() => setApplyTemplate(null)}
        />
      )}
      {confirmDelete && (
        <ConfirmDialog
          open={true}
          title="Delete template?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

