import { useParams } from 'react-router-dom'
import { useMission } from '../hooks/useMission'
import { Tabs } from '../components/ui/Tabs'
import { useFiles } from '../hooks/useFiles'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useState } from 'react'

export default function MissionDetail() {
  const { id = '' } = useParams()
  const missionId = Number(id)
  const mission = useMission(missionId)
  const files = useFiles(missionId)
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null)

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: mission.isLoading ? (
        'Loading...'
      ) : (
        <div>
          <h2 className="text-xl mb-2">{mission.data?.title}</h2>
          <p>Status: {mission.data?.status}</p>
        </div>
      ),
    },
    { id: 'assignments', label: 'Assignments', content: <div>Assignments</div> },
    {
      id: 'files',
      label: 'Files',
      content: (
        <div>
          <ul className="mb-2">
            {files.list.data?.map(f => (
              <li key={f.id} className="flex justify-between items-center border-b py-1">
                <a href={f.url} target="_blank" rel="noreferrer">
                  {f.name}
                </a>
                <Button variant="outline" onClick={() => files.remove.mutate(f.id)}>
                  Delete
                </Button>
              </li>
            ))}
          </ul>
          <Input type="file" multiple onChange={e => setUploadFiles(e.target.files)} />
          <Button
            className="mt-2"
            onClick={() => {
              if (uploadFiles) files.upload.mutate(Array.from(uploadFiles))
            }}
          >
            Upload
          </Button>
        </div>
      ),
    },
  ]

  return <Tabs tabs={tabs} />
}
