import { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import Badge from '../components/ui/Badge';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import Modal from '../components/ui/Modal';
import Toast, { toast } from '../components/ui/Toast';
import Skeleton from '../components/ui/Skeleton';
import Toolbar from '../components/common/Toolbar';
import SearchInput from '../components/common/SearchInput';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import DateRangePicker from '../components/common/DateRangePicker';

export default function Dev() {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [range, setRange] = useState({ start: '', end: '' });

  return (
    <div className="p-4 space-y-8">
      <section>
        <h2 className="mb-2 font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => toast.success('Clicked')}>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">Form</h2>
        <div className="flex flex-col gap-2 w-64">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your name" />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Select id="role" defaultValue="user">
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" rows={3} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Badge & Card</h2>
        <Badge className="mr-2">New</Badge>
        <Card className="w-64 mt-2">
          <CardHeader>Card Header</CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Table</h2>
        <Table className="w-full max-w-md">
          <THead>
            <TR>
              <TH>Name</TH>
              <TH>Role</TH>
            </TR>
          </THead>
          <TBody>
            <TR>
              <TD>Alice</TD>
              <TD>Admin</TD>
            </TR>
          </TBody>
        </Table>
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Tabs</h2>
        <Tabs defaultValue="one">
          <TabsList>
            <TabsTrigger value="one">One</TabsTrigger>
            <TabsTrigger value="two">Two</TabsTrigger>
          </TabsList>
          <TabsContent value="one">First tab</TabsContent>
          <TabsContent value="two">Second tab</TabsContent>
        </Tabs>
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Modal & Dialog</h2>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Button variant="secondary" className="ml-2" onClick={() => setConfirm(true)}>
          Confirm
        </Button>
        <Modal open={open} onClose={() => setOpen(false)}>
          <p>Modal content</p>
        </Modal>
        <ConfirmDialog
          open={confirm}
          title="Are you sure?"
          onCancel={() => setConfirm(false)}
          onConfirm={() => setConfirm(false)}
        />
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Toast & Skeleton</h2>
        <Button onClick={() => toast.success('Hello')}>Show Toast</Button>
        <Skeleton className="h-4 w-32 mt-2" />
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Toolbar & SearchInput & Pagination</h2>
        <Toolbar>
          <SearchInput placeholder="Search" />
          <Pagination page={1} totalPages={5} onChange={() => {}} />
        </Toolbar>
      </section>

      <section>
        <h2 className="mb-2 font-semibold">EmptyState & DateRangePicker</h2>
        <EmptyState title="No data" actionLabel="Reload" onAction={() => {}} />
        <DateRangePicker start={range.start} end={range.end} onChange={setRange} />
      </section>
      <Toast />
    </div>
  );
}
