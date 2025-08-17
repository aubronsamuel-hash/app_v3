import { ReactNode } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export function Modal({ open, onClose, children }: Props) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow relative">
        {children}
        <button className="absolute top-1 right-1" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
    </div>
  )
}
