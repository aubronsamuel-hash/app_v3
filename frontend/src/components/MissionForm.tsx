import { useState } from 'react'

interface Props {
  onCreate: (title: string, description: string) => void
}

export default function MissionForm({ onCreate }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    onCreate(title, description)
    setTitle('')
    setDescription('')
  }

  return (
    <form onSubmit={submit} className="flex gap-2 mb-4">
      <input className="border p-1" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <input className="border p-1" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
      <button className="bg-green-500 text-white px-2" type="submit">Add</button>
    </form>
  )
}
