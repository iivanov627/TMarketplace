import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router";
import "@mantine/core/styles.css";
import { AppRouter } from "./router";
import { theme } from "../shared/config/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function App() {
  return (
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
      </QueryClientProvider>
    </MantineProvider>
  );
}
