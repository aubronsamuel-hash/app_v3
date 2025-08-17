import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Table, TBody, TD, TH, THead, TR } from '../components/ui/Table';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Label from '../components/ui/Label';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import { useMission, useUpdateMission } from '../hooks/useMissions';
import {
  useAssignments,
  useAssignmentsAdd,
  useAssignmentsUpdate,
} from '../hooks/useAssignments';
import {
  useFilesList,
  useUploadFile,
  useDeleteFile,
  useMissionIcs,
} from '../hooks/useFiles';
import type { MissionInput } from '../types/mission';
import type { AssignmentInput } from '../types/assignment';
import toast from 'react-hot-toast';
import { downloadBlob } from '../lib/download';
import { useBeforeUnload, useBlocker } from 'react-router-dom';

function errorMessage(e: unknown) {
  return (e as { message?: string }).message ?? 'Error';
}

function useUnsavedChanges(when: boolean) {
  useBeforeUnload(
    useCallback(
      (e: BeforeUnloadEvent) => {
        if (!when) return;
        e.preventDefault();
        e.returnValue = '';
      },
      [when],
    ),
  );
  const blocker = useBlocker(when);
  useEffect(() => {
    if (blocker.state === 'blocked') {
      if (window.confirm('Discard unsaved changes?')) blocker.proceed();
      else blocker.reset();
    }
  }, [blocker]);
}

export default function MissionDetail() {
  const { id: idParam } = useParams();
  const missionId = Number(idParam);

  const { data: mission } = useMission(missionId);
  const updateMission = useUpdateMission(missionId);

  const [form, setForm] = useState<MissionInput | null>(null);

  useEffect(() => {
    if (mission) {
      const { id, created_by, ...rest } = mission;
      void id;
      void created_by;
      setForm(rest);
    }
  }, [mission]);

  const dirty =
    !!mission && !!form &&
    (
      form.title !== mission.title ||
      form.start !== mission.start ||
      form.end !== mission.end ||
      form.location !== mission.location ||
      (form.notes ?? '') !== (mission.notes ?? '')
    );

  useUnsavedChanges(dirty);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    updateMission.mutate(form, {
      onSuccess: () => toast.success('Mission updated'),
      onError: (e) => toast.error(errorMessage(e)),
    });
  }

  // Assignments
  const { data: assignments } = useAssignments(missionId);
  const addAssignment = useAssignmentsAdd();
  const updateAssignment = useAssignmentsUpdate();
  const [addOpen, setAddOpen] = useState(false);
  const [newAssign, setNewAssign] = useState<{ role: string; userId: string; email: string }>(
    { role: '', userId: '', email: '' },
  );

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    const payload: AssignmentInput = {
      mission_id: missionId,
      role_label: newAssign.role,
      status: 'pending',
    };
    if (newAssign.userId) payload.user_id = Number(newAssign.userId);
    if (newAssign.email) payload.email = newAssign.email;
    addAssignment.mutate(payload, {
      onSuccess: () => {
        toast.success('Assignment added');
        setAddOpen(false);
        setNewAssign({ role: '', userId: '', email: '' });
      },
      onError: (e) => toast.error(errorMessage(e)),
    });
  }

  function changeStatus(id: number, status: string) {
    updateAssignment.mutate(
      { id, data: { status } },
      {
        onSuccess: () => toast.success('Status updated'),
        onError: (e) => toast.error(errorMessage(e)),
      },
    );
  }

  // Files
  const { data: files } = useFilesList(missionId);
  const upload = useUploadFile(missionId);
  const del = useDeleteFile(missionId);
  const ics = useMissionIcs(missionId);

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files;
    if (!f) return;
    Array.from(f).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File “${file.name}” too large`);
        return;
      }
      upload.mutate(file, {
        onSuccess: () => toast.success('Uploaded'),
        onError: (err) => toast.error(errorMessage(err)),
      });
    });
    e.target.value = '';
  }

  function onDelete(id: number) {
    del.mutate(id, {
      onSuccess: () => toast.success('Deleted'),
      onError: (e) => toast.error(errorMessage(e)),
    });
  }

  function onExport() {
    ics.mutate(undefined, {
      onSuccess: (blob) => {
        downloadBlob(blob, `mission-${missionId}.ics`);
        toast.success('ICS exported');
      },
      onError: (e) => toast.error(errorMessage(e)),
    });
  }

  if (!mission || !form) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="assignments">Assignments</TabsTrigger>
        <TabsTrigger value="files">Files</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <form onSubmit={onSubmit} className="flex flex-col gap-4 max-w-xl">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={form.title} onChange={onChange} />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="start">Start</Label>
              <Input
                id="start"
                name="start"
                type="datetime-local"
                value={form.start}
                onChange={onChange}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="end">End</Label>
              <Input
                id="end"
                name="end"
                type="datetime-local"
                value={form.end}
                onChange={onChange}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={form.location}
              onChange={onChange}
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" value={form.notes ?? ''} onChange={onChange} />
          </div>
          <div>
            <Label>Status</Label>
            <div className="p-2 text-sm border rounded bg-gray-50">{mission.status}</div>
          </div>
          <div>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </TabsContent>

      <TabsContent value="assignments">
        <div className="mb-4">
          <Button onClick={() => setAddOpen(true)}>Add assignment</Button>
        </div>
        <Table>
          <THead>
            <TR>
              <TH>User</TH>
              <TH>Role</TH>
              <TH>Status</TH>
              <TH>Responded</TH>
              <TH>Channel</TH>
            </TR>
          </THead>
          <TBody>
            {assignments?.map((a) => (
              <TR key={a.id}>
                <TD>{a.user_id ?? a.email ?? '-'}</TD>
                <TD>{a.role_label}</TD>
                <TD>
                  <Select value={a.status} onChange={(e) => changeStatus(a.id, e.target.value)}>
                    <option value="pending">pending</option>
                    <option value="accepted">accepted</option>
                    <option value="declined">declined</option>
                  </Select>
                </TD>
                <TD>{a.responded_at ? new Date(a.responded_at).toLocaleString() : '-'}</TD>
                <TD>{a.channel ?? '-'}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
        <Modal open={addOpen} onClose={() => setAddOpen(false)}>
          <form onSubmit={handleAdd} className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">Add Assignment</h2>
            <div>
              <Label htmlFor="role">Role label</Label>
              <Input
                id="role"
                value={newAssign.role}
                onChange={(e) => setNewAssign({ ...newAssign, role: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                value={newAssign.userId}
                onChange={(e) => setNewAssign({ ...newAssign, userId: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Invite email</Label>
              <Input
                id="email"
                type="email"
                value={newAssign.email}
                onChange={(e) => setNewAssign({ ...newAssign, email: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button type="button" variant="secondary" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add</Button>
            </div>
          </form>
        </Modal>
      </TabsContent>

      <TabsContent value="files">
        <div className="flex items-center gap-4 mb-4">
          <input
            type="file"
            multiple
            accept="application/pdf,image/*"
            onChange={onUpload}
          />
          <Button type="button" onClick={onExport}>
            Export ICS
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {files?.map((f) => (
            <div key={f.id} className="relative">
              {f.content_type.startsWith('image/') ? (
                <img src={f.url} alt={f.name} className="w-full h-32 object-cover" />
              ) : (
                <a href={f.url} target="_blank" rel="noopener" className="block p-4 border rounded">
                  {f.name}
                </a>
              )}
              <button
                onClick={() => onDelete(f.id)}
                className="absolute top-1 right-1 text-xs bg-red-600 text-white rounded px-1"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
