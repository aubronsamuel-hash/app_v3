import { PropsWithChildren, createContext, useContext, useState } from 'react'
import { Toast, ToastMessage } from '../../components/ui/Toast'

interface ToastCtx {
  success: (msg: string) => void
  error: (msg: string) => void
}

const ToastContext = createContext<ToastCtx>({ success: () => {}, error: () => {} })

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const remove = (id: number) => setToasts(t => t.filter(x => x.id !== id))
  const add = (title: string, variant: 'success' | 'error') => {
    const id = Date.now()
    setToasts(t => [...t, { id, title, variant }])
    setTimeout(() => remove(id), 3000)
  }
  const ctx: ToastCtx = {
    success: msg => add(msg, 'success'),
    error: msg => add(msg, 'error'),
  }
  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <div className="fixed top-2 right-2 z-50">
        {toasts.map(t => (
          <Toast key={t.id} message={t} onClose={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
