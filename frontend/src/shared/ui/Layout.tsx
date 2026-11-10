import { AppShell } from "@mantine/core";
import { Outlet, useNavigate } from "react-router";

import { BottomNav } from "./BottomNav";
import { Header } from "./Header";

export function Layout() {
  const navigate = useNavigate();
  // Пока захардкодим, что пользователь не авторизован.
  // Позже это будет из контекста/JWT.
  const isAuthenticated = false;

  return (
    <AppShell
      header={{ height: 60 }}
      footer={{ height: 60 }}
      padding="md"
      styles={{
        main: {
          backgroundColor: "#F8F9FF",
        },
      }}
    >
      {/* ВЕРХНЯЯ ПАНЕЛЬ */}
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>

      <AppShell.Footer>
        <BottomNav />
      </AppShell.Footer>
    </AppShell>
  );
}
