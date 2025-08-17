import { ReactNode, useState } from 'react'

interface Tab {
  id: string
  label: string
  content: ReactNode
}

export function Tabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.id)
  return (
    <div>
      <div className="flex border-b">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`px-3 py-2 -mb-px border-b-2 ${active === t.id ? 'border-blue-600' : 'border-transparent'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="p-2">{tabs.find(t => t.id === active)?.content}</div>
    </div>
  )
}
