import { Group } from "@mantine/core";
import { Link } from "react-router";

import { ROUTES } from "../../../shared/config/routes";
import { Logo } from "../../../shared/ui";
import { AccountSlot } from "./AccountSlot";

interface HeaderProps {
  withAccount?: boolean;
}

export function Header({ withAccount = true }: HeaderProps) {
  return (
    <Group h="100%" px="md" justify="space-between" wrap="nowrap">
      <Logo />
      {withAccount && <AccountSlot />}
    </Group>
  );
}
