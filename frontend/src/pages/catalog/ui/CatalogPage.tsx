import {
  Box,
  Button,
  Group,
  Pagination,
  SimpleGrid,
  Stack,
} from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";

import {
  ProductCard,
  ProductCardSkeleton,
  useProducts,
} from "../../../entities/product";
import { ROUTES } from "../../../shared/config/routes";
import { getErrorMessage } from "../../../shared/lib/errors/getErrorMessage";
import { EmptyState, ErrorState } from "../../../shared/ui";

import { CatalogFilters } from "./CatalogFilters";
import { useCatalogParams } from "../model/useCatalogParams";
import { PAGE_SIZE } from "../model/constants";

import { notifications } from "@mantine/notifications";
import { useViewer } from "../../../entities/session";

// Адаптивная сетка: 2 колонки на телефоне, 3 на планшете, 4 на десктопе
const GRID_COLS = { base: 2, sm: 3, md: 4 };

export function CatalogPage() {
  useDocumentTitle("Каталог");

  const navigate = useNavigate();
  const location = useLocation();

  const viewer = useViewer();
  const isGuest = viewer.role === "guest";
  const canBuy = viewer.role === "guest" || viewer.role === "buyer";

  const { params, update, reset } = useCatalogParams();
  // Ключ нужен, чтобы при нажатии «Сбросить фильтры» внутренние поля ввода в CatalogFilters тоже очистились
  const [filtersKey, setFiltersKey] = useState(0);

  const { data, isPending, isError, error, refetch, isPlaceholderData } =
    useProducts({
      q: params.q || undefined,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      page: params.page,
      size: PAGE_SIZE,
    });

  const hasFilters =
    Boolean(params.q) ||
    params.minPrice !== undefined ||
    params.maxPrice !== undefined;

  const handleReset = () => {
    reset();
    setFiltersKey((prev) => prev + 1);
  };

  const handlePage = (page: number) => {
    update({ page }, { push: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = (productId: string) => {
    if (isGuest) {
      navigate(ROUTES.LOGIN, { state: { from: location } });
      return;
    }
    notifications.show({
      title: "Добавлено в корзину",
      message: `Товар (ID: ${productId.slice(0, 8)}...) готов к заказу`,
      color: "green",
    });
  };

  return (
    <Stack gap="md">
      <CatalogFilters key={filtersKey} value={params} onChange={update} />

      {/* Показываем верхнюю кнопку сброса только если есть товары (чтобы не дублировать кнопку из EmptyState) */}
      {hasFilters && data && data.items.length > 0 && (
        <Group justify="flex-end">
          <Button variant="subtle" size="compact-sm" onClick={handleReset}>
            Сбросить фильтры
          </Button>
        </Group>
      )}

      {isError ? (
        <ErrorState
          message={getErrorMessage(error)}
          onRetry={() => refetch()}
        />
      ) : isPending ? (
        <SimpleGrid
          cols={GRID_COLS}
          spacing={{ base: 8, sm: "sm" }}
          verticalSpacing={{ base: 8, sm: "sm" }}
        >
          {Array.from({ length: PAGE_SIZE }, (_, i) => (
            <Box key={i} style={{ minWidth: 0 }}>
              <ProductCardSkeleton />
            </Box>
          ))}
        </SimpleGrid>
      ) : data.items.length === 0 ? (
        <EmptyState
          message={
            hasFilters
              ? "Ничего не найдено. Попробуйте изменить запрос или фильтры"
              : "В каталоге пока нет товаров"
          }
          actionLabel={hasFilters ? "Сбросить фильтры" : undefined}
          onAction={hasFilters ? handleReset : undefined}
        />
      ) : (
        <>
          <Box
            opacity={isPlaceholderData ? 0.6 : 1}
            style={{ transition: "opacity 150ms" }}
          >
            <SimpleGrid
              cols={GRID_COLS}
              spacing={{ base: 8, sm: "sm" }}
              verticalSpacing={{ base: 8, sm: "sm" }}
            >
              {data.items.map((product) => (
                <Box key={product.id} style={{ minWidth: 0 }}>
                  <ProductCard
                    product={product}
                    actions={
                      canBuy ? (
                        <Button
                          fullWidth
                          size="xs"
                          disabled={product.stock <= 0}
                          onClick={() => handleAddToCart(product.id)}
                        >
                          {product.stock <= 0 ? "Нет в наличии" : "В корзину"}
                        </Button>
                      ) : undefined
                    }
                  />
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          {data.totalPages > 1 && (
            <Group justify="center">
              <Pagination
                total={data.totalPages}
                value={params.page}
                onChange={handlePage}
                radius="md"
              />
            </Group>
          )}
        </>
      )}
    </Stack>
  );
}
