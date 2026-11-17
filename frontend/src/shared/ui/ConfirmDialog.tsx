import { Modal, Text, Group, Button } from '@mantine/core';

interface ConfirmDialogProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  danger?: boolean;
}

export function ConfirmDialog({
  opened,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Подтвердить',
  cancelLabel = 'Отмена',
  loading,
  danger,
}: ConfirmDialogProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} centered radius={20}>
      {description && <Text size="sm" mb="lg">{description}</Text>}
      <Group justify="flex-end" gap="sm">
        <Button variant="default" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          color={danger ? 'red' : 'yellowBrand'}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </Group>
    </Modal>
  );
}