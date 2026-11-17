import { Group, Title, ActionIcon } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useNavigate } from 'react-router';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  withBack?: boolean;
  rightSection?: ReactNode;
}

export function PageHeader({ title, withBack, rightSection }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <Group justify="space-between" mb="md" wrap="nowrap">
      <Group gap="xs" wrap="nowrap">
        {withBack && (
          <ActionIcon variant="subtle" color="gray" onClick={() => navigate(-1)}>
            <IconArrowLeft size={20} />
          </ActionIcon>
        )}
        <Title order={2} fz={24} fw={700}>
          {title}
        </Title>
      </Group>
      {rightSection}
    </Group>
  );
}