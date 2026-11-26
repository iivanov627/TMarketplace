import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { AppRouter } from "./router";
import { cssVariablesResolver, theme } from "../shared/config/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";
import { ErrorBoundary } from "../shared/ui/ErrorBoundary";
import { configureApiClient } from "../shared/api";
import { sessionStore } from "../entities/session";

configureApiClient({
  getAccessToken: () => sessionStore.getState().accessToken,
  onUnauthorized: () => sessionStore.clear(),
});

const queryClient = new QueryClient();

export function App() {
  return (
    <MantineProvider theme={theme} cssVariablesResolver={cssVariablesResolver}>
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
