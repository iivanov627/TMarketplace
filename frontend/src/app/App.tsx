import { MantineProvider, createTheme, type MantineColorsTuple } from '@mantine/core';
import { BrowserRouter } from 'react-router';
import '@mantine/core/styles.css';
import { AppRouter } from './router';

const yellowBrand: MantineColorsTuple = [
  "#fffce0",
  "#fff7ca",
  "#ffef99",
  "#ffe663",
  "#ffdd2d",
  "#ffda18",
  "#ffd701",
  "#e3be00",
  "#caa900",
  "#ae9100"
];

const theme = createTheme({
  colors: { yellowBrand },
  primaryColor: 'yellowBrand',
  fontFamily: 'Inter, sans-serif',
  headings: { fontFamily: 'Inter, sans-serif' },
});

export function App() {
  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </MantineProvider>
  );
}