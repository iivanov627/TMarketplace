import { Stack, Title, Divider, Group } from '@mantine/core';
import { Loader } from '../../shared/ui/Loader';
import { ErrorMessage } from '../../shared/ui/ErrorState';
import { EmptyState } from '../../shared/ui/EmptyState';

export function UiKitPage() {
  return (
    <Stack gap="xl" p="md">
      <Title order={2}>UI Kit</Title>

      <Divider label="Loader" />
      <Group>
        <Loader />
      </Group>

      <Divider label="ErrorMessage" />
      <Stack>
        <ErrorMessage message="Не удалось загрузить товары" />
        <ErrorMessage message="Очень длинное сообщение об ошибке, которое должно корректно переноситься на узком экране и не ломать вёрстку, даже если оно занимает несколько строк подряд." />
      </Stack>

      <Divider label="EmptyState" />
      <Stack>
        {/* С кнопкой */}
        <EmptyState
          title="Товаров не найдено"
          message="Попробуйте изменить запрос или сбросить фильтры"
          resetLabel="Сбросить фильтры"
          onReset={() => alert('reset filters')}
        />
        {/* Без кнопки */}
        <EmptyState
          title="Заказов пока нет"
          message="Ваши заказы появятся здесь после покупки"
        />
        {/* Короткий текст */}
        <EmptyState title="Пусто" message="Ничего нет" />
      </Stack>
    </Stack>
  );
}