export interface ToastMessage {
  id: number
  title: string
  variant?: 'success' | 'error'
}

export function Toast({ message, onClose }: { message: ToastMessage; onClose: (id: number) => void }) {
  const color = message.variant === 'error' ? 'bg-red-600' : 'bg-green-600'
  return (
    <div className={`${color} text-white px-4 py-2 rounded shadow mb-2`} role="status">
      <div className="flex justify-between items-center">
        <span>{message.title}</span>
        <button onClick={() => onClose(message.id)} aria-label="Close">
          ×
        </button>
      </div>
    </div>
  )
}
