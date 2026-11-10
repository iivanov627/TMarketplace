import { Flex, Group, Title, Button, ThemeIcon } from "@mantine/core";
import { Link } from "react-router";
import { IconBuildingStore, IconLogin} from "@tabler/icons-react";

export function Header() {
  return (
    <Flex h="100%" px="md" justify="space-between" align="center">
      {/* Логотип и название */}
      <Group gap="xs">
        <ThemeIcon size={40} radius={12} color="yellowBrand" variant="filled">
          <IconBuildingStore size={22} style={{ color: "#000000" }} />
        </ThemeIcon>
        <Title
          order={4}
          renderRoot={(props) => <Link to="/catalog" {...props} />}
          style={{
            lineHeight: "24px",
            letterSpacing: "-0.45px",
            color: "#000000",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Маркетплейс
        </Title>
      </Group>

      <Button
        component={Link}
        to="/login"
        variant="filled"
        color="yellowBrand"
        leftSection={<IconLogin size={14} stroke={2.5} />}
        style={{
          padding: "6px 14px",
          fontSize: 12,
          color: "#000000",
          fontWeight: 600,
        }}
        styles={{
          root: { backgroundColor: "#FFDD2D" },
          label: { color: "#000000" },
        }}
      >
        Войти
      </Button>
    </Flex>
  );
}
