import { Anchor, Box, Card, Stack, Text } from '@mantine/core';
import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { ROUTES } from '../../../shared/config/routes';
import { Amount, ProductImage } from '../../../shared/ui';
import type { Product } from '../model/types';

interface ProductCardProps {
  product: Product;
  actions?: ReactNode;
  favorite?: ReactNode;
}

export function ProductCard({ product, actions, favorite }: ProductCardProps) {
  const to = ROUTES.PRODUCT(product.id);

  return (
    <Card
      p={{ base: 8, sm: 'xs' }}
      h="100%"
      w="100%"
      style={{ minWidth: 0, overflow: 'hidden' }}
    >
      <Stack gap={6} h="100%" w="100%" justify="space-between">
        <Stack gap={6} w="100%">
          <Box pos="relative" w="100%">
            <Link
              to={to}
              aria-label={product.name}
              style={{ display: 'block', width: '100%' }}
            >
              <ProductImage src={product.imageUrl} alt={product.name} />
            </Link>
            {favorite && (
              <Box pos="absolute" top={8} right={8}>
                {favorite}
              </Box>
            )}
          </Box>

          <Anchor
            component={Link}
            to={to}
            underline="never"
            c="inherit"
            px={2}
            display="block"
            w="100%"
          >
            <Amount value={product.price} variant="bonus" fw={700} />
            <Text
              size="xs"
              c="dimmed"
              lineClamp={2}
              mih={32}
              style={{ overflowWrap: 'anywhere' }}
            >
              {product.name}
            </Text>
          </Anchor>
        </Stack>

        {actions}
      </Stack>
    </Card>
  );
}
