import {
  Amount,
  StatusBadge,
  ProductImage,
  Surface,
  PageHeader,
  KeyValueRow,
  ConfirmDialog,
  EmptyState,
  Loader,
  ErrorState,
  AppLink,
  SearchInput,
  BonusInput,
  ImageUploadField,
  FilterChips,
  SwitchRow,
  SelectableCard,
  InlineSelect,
  CircleIconButton,
  BottomActionBar,
  Logo,
  TabBar,
  TabBarItem,
} from '../../shared/ui';
import { Stack, Group, Title, Divider, Radio } from '@mantine/core';
import { useState } from 'react';
import { IconHeart, IconHome, IconShoppingCart, IconUser } from '@tabler/icons-react';

export function UiKitPage() {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [search, setSearch] = useState('');
  const [bonus, setBonus] = useState<number | string>(1500);
  const [chips, setChips] = useState<string[]>(['all']);
  const [switchOn, setSwitchOn] = useState(true);
  const [payment, setPayment] = useState('bonus');
  const [sort, setSort] = useState('price-asc');

  return (
    <Stack p="md" gap="xl">
      <Title order={2}>UI Kit</Title>

      {/* Logo */}
      <section>
        <Title order={4}>Logo</Title>
        <Logo />
      </section>

      <Divider />


      <Divider />

      {/* Badge / StatusBadge */}
      <section>
        <Title order={4}>Badge / StatusBadge</Title>
        <Group>
          <StatusBadge tone="success">Оплачен</StatusBadge>
          <StatusBadge tone="warning">В обработке</StatusBadge>
          <StatusBadge tone="danger">Отменён</StatusBadge>
          <StatusBadge tone="info">Новый</StatusBadge>
          <StatusBadge tone="neutral">Черновик</StatusBadge>
        </Group>
      </section>

      <Divider />

      {/* Amount */}
      <section>
        <Title order={4}>Amount</Title>
        <Group>
          <Amount value={12400} variant="bonus" size="lg" />
          <Amount value={1645} variant="money" size="sm" />
        </Group>
      </section>

      <Divider />

      {/* ProductImage */}
      <section>
        <Title order={4}>ProductImage</Title>
        <Group>
          <ProductImage size="thumb" />
          <ProductImage size="card" />
        </Group>
      </section>

      <Divider />

      {/* Surface / PageHeader / KeyValueRow */}
      <section>
        <Title order={4}>Surface + PageHeader + KeyValueRow</Title>
        <Surface p="md">
          <PageHeader title="Заголовок страницы" withBack />
          <Stack gap="xs" mt="md">
            <KeyValueRow label="Товары" value="3 шт." />
            <KeyValueRow label="Доставка" value="0 Б" />
            <KeyValueRow label="Итого" value="1 500 Б" emphasized />
          </Stack>
        </Surface>
      </section>

      <Divider />

      {/* SearchInput / BonusInput */}
      <section>
        <Title order={4}>SearchInput / BonusInput</Title>
        <Stack>
          <SearchInput value={search} onChange={(e) => setSearch(e.currentTarget.value)} />
          <BonusInput value={bonus} onChange={setBonus} />
        </Stack>
      </section>

      <Divider />

      {/* ImageUploadField */}
      <section>
        <Title order={4}>ImageUploadField</Title>
        <ImageUploadField value={undefined} onChange={() => {}} />
      </section>

      <Divider />

      {/* FilterChips */}
      <section>
        <Title order={4}>FilterChips</Title>
        <FilterChips
          options={[
            { value: 'all', label: 'Все' },
            { value: 'new', label: 'Новые' },
            { value: 'paid', label: 'Оплаченные' },
          ]}
          value={chips}
          onChange={setChips}
          multiple
        />
      </section>

      <Divider />

      {/* SwitchRow */}
      <section>
        <Title order={4}>SwitchRow</Title>
        <SwitchRow
          label="Показывать в каталоге"
          description="Если выключить, товар будет скрыт"
          checked={switchOn}
          onChange={setSwitchOn}
        />
      </section>

      <Divider />

      {/* SelectableCard */}
      <section>
        <Title order={4}>SelectableCard</Title>
        <Radio.Group value={payment} onChange={setPayment}>
          <Stack gap="sm">
            <SelectableCard value="bonus" label="Бонусами" description="Спишется 1 500 Б" />
            <SelectableCard value="card" label="Картой" description="Оплата при получении" />
          </Stack>
        </Radio.Group>
      </section>

      <Divider />

      {/* InlineSelect */}
      <section>
        <Title order={4}>InlineSelect</Title>
        <InlineSelect
          options={[
            { value: 'price-asc', label: 'Сначала дешевле' },
            { value: 'price-desc', label: 'Сначала дороже' },
          ]}
          value={sort}
          onChange={setSort}
        />
      </section>

      <Divider />

      {/* CircleIconButton */}
      <section>
        <Title order={4}>CircleIconButton</Title>
        <Group>
          <CircleIconButton><IconHeart size={18} /></CircleIconButton>
          <CircleIconButton><IconHome size={18} /></CircleIconButton>
        </Group>
      </section>

      <Divider />

      {/* TabBar */}
      <section>
        <Title order={4}>TabBar / TabBarItem</Title>
        <TabBar>
          <TabBarItem icon={<IconHome size={24} />} label="Каталог" to="/catalog" active />
          <TabBarItem icon={<IconShoppingCart size={24} />} label="Корзина" to="/cart" badge={3} />
          <TabBarItem icon={<IconUser size={24} />} label="Профиль" to="/profile" />
        </TabBar>
      </section>

      <Divider />

      {/* ConfirmDialog */}
      <section>
        <Title order={4}>ConfirmDialog</Title>
        <ConfirmDialog
          opened={dialogOpened}
          onClose={() => setDialogOpened(false)}
          onConfirm={() => setDialogOpened(false)}
          title="Удалить товар?"
          description="Это действие нельзя отменить."
          danger
        />
      </section>

      <Divider />

      {/* Состояния */}
      <section>
        <Title order={4}>PageLoader / ErrorState / EmptyState</Title>
        <Stack>
          <Loader />
          <ErrorState message="Не удалось загрузить данные" onRetry={() => {}} />
          <EmptyState message="Товаров не найдено" actionLabel="Сбросить фильтры" onAction={() => {}} />
        </Stack>
      </section>

      <Divider />

      {/* AppLink */}
      <section>
        <Title order={4}>AppLink</Title>
        <AppLink to="/register">Зарегистрироваться</AppLink>
      </section>

      <Divider />

      {/* BottomActionBar — осторожно, он fixed внизу */}
      <section>
        <Title order={4}>BottomActionBar</Title>
        <BottomActionBar
          leftContent={<Amount value={1500} variant="bonus" />}
          buttonLabel="Оформить заказ"
          onButtonClick={() => {}}
        />
      </section>
    </Stack>
  );
}