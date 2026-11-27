import { Anchor, SegmentedControl, Stack, Text, Title } from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";
import { IconArrowLeft } from "@tabler/icons-react";
import { useState } from "react";
import { Link, Navigate } from "react-router";

import { useViewer } from "../../../entities/session";
import { ROUTES } from "../../../shared/config/routes";
import { RegisterForm } from "./RegisterForm";

type RegisterTab = "buyer" | "seller";

export function RegisterPage() {
  useDocumentTitle("Регистрация");

  const viewer = useViewer();
  const [accountType, setAccountType] = useState<RegisterTab>("buyer");

  if (viewer.role !== "guest") {
    return <Navigate to={ROUTES.CATALOG} replace />;
  }

  return (
    <Stack gap="lg" pb="xl" maw={440} mx="auto" w="100%">
      <Anchor
        component={Link}
        to={ROUTES.CATALOG}
        size="sm"
        c="dimmed"
        display="inline-flex"
        w="fit-content"
        style={{ alignItems: "center", gap: 6 }}
      >
        <IconArrowLeft size={16} />В каталог
      </Anchor>

      <Title order={1} fz={24}>
        Регистрация
      </Title>

      <Stack gap={6}>
        <SegmentedControl
          fullWidth
          size="xl"
          radius="lg"
          color="yellowBrand"
          bg="white"
          value={accountType}
          onChange={(value) => setAccountType(value as RegisterTab)}
          styles={{
            root: {
              border: "1px solid var(--mantine-color-gray-2)",
              padding: 4,
            },
            label: {
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "6px 12px",
            },
          }}
          data={[
            { label: "Покупатель", value: "buyer" },
            { label: "Продавец", value: "seller" },
          ]}
        />
      </Stack>

      {accountType === "buyer" ? <RegisterForm /> : <></>}

      <Text ta="center" size="sm" c="dimmed">
        Уже есть аккаунт?{" "}
        <Anchor component={Link} to={ROUTES.LOGIN} fw={600} c="dark">
          Войти
        </Anchor>
      </Text>
    </Stack>
  );
}
