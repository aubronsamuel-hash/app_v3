import Router from './router';
import { ApiProvider } from './providers/ApiProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { ToastProvider } from './providers/ToastProvider';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ApiProvider>
          <Router />
        </ApiProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
