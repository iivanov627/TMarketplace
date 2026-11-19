import { Badge, Box, Button, Group, Stack, Text, Title } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { IconArrowLeft, IconShoppingCart } from '@tabler/icons-react';
import { useLocation, useNavigate, useParams } from 'react-router';

import { useProduct } from '../../../entities/product';
import { isApiError } from '../../../shared/api';
import { ROUTES } from '../../../shared/config/routes';
import { getErrorMessage } from '../../../shared/lib/errors/getErrorMessage';
import { useGoBack } from '../../../shared/lib/navigation/useGoBack';
import { Amount, CircleIconButton, EmptyState, ErrorState, ProductImage } from '../../../shared/ui';

import { ProductPageSkeleton } from './ProductPageSkeleton';

export function ProductPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const goBack = useGoBack(ROUTES.CATALOG);

  // Временная заглушка авторизации (как в каталоге)
  const isAuthenticated = false;

  const { data: product, isPending, isError, error, refetch } = useProduct(id);

  useDocumentTitle(product?.name ?? 'Товар');

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { state: { from: location } });
      return;
    }
    console.log('Добавляем товар в корзину:', id);
  };

  if (isError) {
    // Если сервер вернул 404 или в моках товар не найден
    if ((isApiError(error) && error.isNotFound) || error?.message === 'Товар не найден') {
      return (
        <EmptyState
          message="Товар не найден. Возможно, он был снят с продажи."
          actionLabel="Вернуться в каталог"
          onAction={() => navigate(ROUTES.CATALOG)}
        />
      );
    }
    return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />;
  }

  if (isPending || !product) {
    return <ProductPageSkeleton />;
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <Stack gap="md" pb="xl">
      
      <Box pos="relative">
        <ProductImage src={product.imageUrl} alt={product.name} size="full" />
        <Box pos="absolute" top={12} left={12}>
          <CircleIconButton aria-label="Назад в каталог" onClick={goBack}>
            <IconArrowLeft size={20} />
          </CircleIconButton>
        </Box>
      </Box>

      
      <Stack gap={6}>
        <Title order={1} fz={22} lh={1.3}>
          {product.name}
        </Title>

        <Group justify="space-between" align="center">
          <Amount value={product.price} variant="bonus" fz={26} fw={700} />
          {isOutOfStock ? (
            <Badge color="gray" variant="light">
              Нет в наличии
            </Badge>
          ) : (
            <Text size="xs" c="dimmed">
              В наличии: {product.stock} шт.
            </Text>
          )}
        </Group>
      </Stack>

     
      {product.description && (
        <Stack gap={6}>
          <Title order={2} fz={16}>
            Описание
          </Title>
          <Text size="sm" c="gray.7" style={{ whiteSpace: 'pre-line' }}>
            {product.description}
          </Text>
        </Stack>
      )}

      
      <Box pt="sm">
        <Button
          fullWidth
          size="lg"
          leftSection={<IconShoppingCart size={20} />}
          disabled={isOutOfStock}
          onClick={handleAddToCart}
        >
          {isOutOfStock ? 'Нет в наличии' : 'Добавить в корзину'}
        </Button>
        {!isAuthenticated && !isOutOfStock && (
          <Text size="xs" c="dimmed" ta="center" mt={6}>
            Войдите в аккаунт, чтобы добавить товар в корзину
          </Text>
        )}
      </Box>
    </Stack>
  );
}
