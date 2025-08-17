import { useTemplates } from '../hooks/useTemplates'
import { Button } from '../components/ui/Button'
import { useState } from 'react'
import { Input } from '../components/ui/Input'
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table'
import { EmptyState } from '../components/common/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'

export default function Templates() {
  const { list, create, remove } = useTemplates()
  const [title, setTitle] = useState('')
  const items = list.data?.items ?? []
  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault()
          create.mutate({ title })
          setTitle('')
        }}
        className="mb-4 flex gap-2"
      >
        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="New template title" required />
        <Button type="submit">Add</Button>
      </form>
      {list.isLoading && <Skeleton className="h-20" />}
      {!list.isLoading && items.length === 0 && <EmptyState title="No templates" />}
      {!list.isLoading && items.length > 0 && (
        <Table>
          <THead>
            <TR>
              <TH>Title</TH>
              <TH></TH>
            </TR>
          </THead>
          <TBody>
            {items.map(t => (
              <TR key={t.id}>
                <TD>{t.title}</TD>
                <TD>
                  <Button variant="outline" onClick={() => remove.mutate(t.id)}>
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
