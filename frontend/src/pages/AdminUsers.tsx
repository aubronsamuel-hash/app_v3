import { useUsers } from '../hooks/useUsers'
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table'
import { Button } from '../components/ui/Button'
import { useState } from 'react'
import { Input } from '../components/ui/Input'
import { EmptyState } from '../components/common/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'

export default function AdminUsers() {
  const { list, create, remove } = useUsers()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('user')
  const items = list.data?.items ?? []

  return (
    <div>
      <form
        className="flex gap-2 mb-4"
        onSubmit={e => {
          e.preventDefault()
          create.mutate({ username: name, email, role })
          setName('')
          setEmail('')
        }}
      >
        <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <Input placeholder="Role" value={role} onChange={e => setRole(e.target.value)} required />
        <Button type="submit">Add</Button>
      </form>
      {list.isLoading && <Skeleton className="h-20" />}
      {!list.isLoading && items.length === 0 && <EmptyState title="No users" />}
      {!list.isLoading && items.length > 0 && (
        <Table>
          <THead>
            <TR>
              <TH>Name</TH>
              <TH>Email</TH>
              <TH>Role</TH>
              <TH></TH>
            </TR>
          </THead>
          <TBody>
            {items.map(u => (
              <TR key={u.id}>
                <TD>{u.username}</TD>
                <TD>{u.email}</TD>
                <TD>{u.role}</TD>
                <TD>
                  <Button variant="outline" onClick={() => remove.mutate(u.id)}>
                    Delete
                  </Button>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  )
}
