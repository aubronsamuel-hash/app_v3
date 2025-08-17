import { AppRouter } from './router'
import { ApiProvider } from './providers/ApiProvider'
import { ThemeProvider } from './providers/ThemeProvider'
import { ToastProvider } from './providers/ToastProvider'

export default function App() {
  return (
    <ThemeProvider>
      <ApiProvider>
        <ToastProvider>
          <AppRouter />
        </ToastProvider>
      </ApiProvider>
    </ThemeProvider>
  )
}
