import './App.css';
import { AppRouter } from './routes/router';
import { useAuthInit } from './features/auth/useAuthInit';
import { ThemeProvider } from './components/Theme/theme-provider';

function App() {
  useAuthInit();
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
