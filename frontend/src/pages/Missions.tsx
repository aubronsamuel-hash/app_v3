import { useState } from 'react'
import { useMissions, useMissionActions } from '../hooks/useMissions'
import { Toolbar } from '../components/common/Toolbar'
import { SearchInput } from '../components/common/SearchInput'
import { Button } from '../components/ui/Button'
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table'
import { Pagination } from '../components/common/Pagination'
import { EmptyState } from '../components/common/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'
import { ConfirmDialog } from '../components/common/ConfirmDialog'

export default function Missions() {
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const filters = { q, page }
  const { data, isLoading } = useMissions(filters)
  const actions = useMissionActions()
  const [confirmId, setConfirmId] = useState<number | null>(null)
  const total = data?.total ?? 0
  const items = data?.items ?? []
  return (
    <div>
      <Toolbar>
        <SearchInput value={q} onChange={e => setQ(e.target.value)} />
      </Toolbar>
      {isLoading && <Skeleton className="h-32" />}
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
              {items.map(m => (
                <TR key={m.id}>
                  <TD>{m.title}</TD>
                  <TD>{m.start}</TD>
                  <TD>{m.end}</TD>
                  <TD>{m.status}</TD>
                  <TD>{m.positions}</TD>
                  <TD className="space-x-2">
                    <Button variant="outline" onClick={() => actions.publish.mutate(m.id)}>
                      Publish
                    </Button>
                    <Button variant="outline" onClick={() => actions.duplicate.mutate(m.id)}>
                      Duplicate
                    </Button>
                    <Button variant="outline" onClick={() => actions.close.mutate(m.id)}>
                      Close
                    </Button>
                    <Button variant="outline" onClick={() => setConfirmId(m.id)}>
                      Cancel
                    </Button>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
          <div className="mt-4">
            <Pagination page={page} total={total} pageSize={data!.pageSize} onPageChange={p => setPage(p)} />
          </div>
        </>
      )}
      <ConfirmDialog
        open={confirmId !== null}
        title="Cancel mission?"
        onConfirm={() => {
          if (confirmId) actions.cancel.mutate(confirmId)
        }}
        onClose={() => setConfirmId(null)}
      />
    </div>
  )
}
