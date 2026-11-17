import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router";
import "@mantine/core/styles.css";
import { AppRouter } from "./router";
import { theme } from "../shared/config/theme"

export function App() {
  return (
    <MantineProvider theme={theme}>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
    </MantineProvider>
  );
}
