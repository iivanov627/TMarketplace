import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { AppRouter } from "./router";
import { theme } from "../shared/config/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";
import { ErrorBoundary } from "../shared/ui/ErrorBoundary";

const queryClient = new QueryClient();

export function App() {
  return (
    <MantineProvider theme={theme}>
      <Notifications position="top-center" />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ErrorBoundary>
            <AppRouter />
          </ErrorBoundary>
        </BrowserRouter>
      </QueryClientProvider>
    </MantineProvider>
  );
}
