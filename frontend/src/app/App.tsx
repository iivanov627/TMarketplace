import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router';
import '@mantine/core/styles.css';
import { AppRouter } from './router';

export function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </MantineProvider>
  );
}