import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMissionsList } from '../hooks/useMissions';
import { usePublish, useDuplicate, useClose, useCancel } from '../hooks/useMissionActions';
import { Toolbar } from '../components/common/Toolbar';
import { SearchInput } from '../components/common/SearchInput';
import { DateRangePicker } from '../components/common/DateRangePicker';
import { Pagination } from '../components/common/Pagination';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Skeleton } from '../components/ui/Skeleton';
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Label } from '../components/ui/Label';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { toast } from 'react-hot-toast';
import type { Mission } from '../types/mission';

function positionsCount(m: Mission) {
  return m.positions.reduce((sum, p) => sum + p.count, 0);
}

export default function Missions() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [range, setRange] = useState({ from: '', to: '' });
  const [page, setPage] = useState(1);
  const params = {
    q: q || undefined,
    status: status || undefined,
    date_from: range.from || undefined,
    date_to: range.to || undefined,
    page,
  };
  const { data, isLoading } = useMissionsList(params);
  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const pageSize = data?.pageSize ?? 1;

  const publish = usePublish();
  const duplicate = useDuplicate();
  const close = useClose();
  const cancel = useCancel();
  const navigate = useNavigate();

  const [menuId, setMenuId] = useState<number | null>(null);
  const [confirm, setConfirm] = useState<{ id: number; action: 'close' | 'cancel' } | null>(null);
  const [dupId, setDupId] = useState<number | null>(null);
  const [titleSuffix, setTitleSuffix] = useState('');
  const [shiftDays, setShiftDays] = useState('');

  const handleDuplicateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (dupId == null) return;
    try {
      const newMission = await duplicate.mutateAsync({
        id: dupId,
        title_suffix: titleSuffix,
        shift_days: shiftDays ? Number(shiftDays) : undefined,
      });
      toast.success('Mission duplicated');
      navigate(`/missions/${newMission.id}`);
    } catch (err) {
      const message = (err as { message?: string }).message ?? 'Duplicate failed';
      toast.error(message);
    }
  };

  const handlePublish = async (id: number) => {
    const message = window.prompt('Message (optional)') || undefined;
    try {
      await publish.mutateAsync({ id, message });
      toast.success('Mission published');
    } catch (err) {
      const msg = (err as { message?: string }).message ?? 'Publish failed';
      toast.error(msg);
    }
  };

  const handleClose = async (id: number) => {
    try {
      await close.mutateAsync({ id });
      toast.success('Mission closed');
    } catch (err) {
      const msg = (err as { message?: string }).message ?? 'Close failed';
      toast.error(msg);
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await cancel.mutateAsync({ id });
      toast.success('Mission cancelled');
    } catch (err) {
      const msg = (err as { message?: string }).message ?? 'Cancel failed';
      toast.error(msg);
    }
  };

  return (
    <div>
      <Toolbar>
        <SearchInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" />
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-40">
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="closed">Closed</option>
          <option value="cancelled">Cancelled</option>
        </Select>
        <DateRangePicker from={range.from} to={range.to} onChange={setRange} />
        <Link to="/missions/new" className="ml-auto">
          <Button>New mission</Button>
        </Link>
      </Toolbar>
      {isLoading && <Skeleton className="h-48" />}
      {!isLoading && items.length === 0 && <EmptyState title="No missions" />}
      {!isLoading && items.length > 0 && (
        <>
          <Table>
            <THead>
              <TR>
                <TH>Title</TH>
                <TH>Start</TH>
                <TH>End</TH>
                <TH>Status</TH>
                <TH>Positions</TH>
                <TH></TH>
              </TR>
            </THead>
            <TBody>
              {items.map((m) => (
                <TR key={m.id}>
                  <TD>{m.title}</TD>
                  <TD>{m.start}</TD>
                  <TD>{m.end}</TD>
                  <TD>{m.status}</TD>
                  <TD>{positionsCount(m)}</TD>
                  <TD className="relative">
                    <Button
                      variant="outline"
                      onClick={() => setMenuId(menuId === m.id ? null : m.id)}
                    >
                      Actions
                    </Button>
                    {menuId === m.id && (
                      <div className="absolute right-0 mt-1 bg-white border rounded shadow z-10">
                        <button
                          className="block w-full text-left px-3 py-1 hover:bg-gray-100"
                          onClick={() => {
                            setMenuId(null);
                            handlePublish(m.id);
                          }}
                        >
                          Publish
                        </button>
                        <button
                          className="block w-full text-left px-3 py-1 hover:bg-gray-100"
                          onClick={() => {
                            setMenuId(null);
                            setDupId(m.id);
                          }}
                        >
                          Duplicate
                        </button>
                        <button
                          className="block w-full text-left px-3 py-1 hover:bg-gray-100"
                          onClick={() => {
                            setMenuId(null);
                            setConfirm({ id: m.id, action: 'close' });
                          }}
                        >
                          Close
                        </button>
                        <button
                          className="block w-full text-left px-3 py-1 hover:bg-gray-100"
                          onClick={() => {
                            setMenuId(null);
                            setConfirm({ id: m.id, action: 'cancel' });
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
          <div className="mt-4">
            <Pagination
              page={page}
              total={total}
              pageSize={pageSize}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </>
      )}
      <ConfirmDialog
        open={confirm !== null}
        title={confirm?.action === 'close' ? 'Close mission?' : 'Cancel mission?'}
        onConfirm={() => {
          if (!confirm) return;
          if (confirm.action === 'close') {
            handleClose(confirm.id);
          } else {
            handleCancel(confirm.id);
          }
        }}
        onClose={() => setConfirm(null)}
      />
      <Modal open={dupId !== null} onClose={() => setDupId(null)}>
        <form className="space-y-3" onSubmit={handleDuplicateSubmit}>
          <div>
            <Label htmlFor="title_suffix">Title suffix</Label>
            <Input
              id="title_suffix"
              value={titleSuffix}
              onChange={(e) => setTitleSuffix(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="shift_days">Shift days</Label>
            <Input
              id="shift_days"
              type="number"
              value={shiftDays}
              onChange={(e) => setShiftDays(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setDupId(null)}>
              Cancel
            </Button>
            <Button type="submit">Duplicate</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
