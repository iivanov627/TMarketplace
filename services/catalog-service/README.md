# Catalog service

Java 21 / Spring Boot service for the product catalog. PostgreSQL stores catalog data; Liquibase creates and versions the schema on startup. The default profile adds one demo category, a published product, and a draft.

## Database schema

The service maps `products`, `product_statuses`, `product_prices`, `product_inventory`, and `categories` to the provided catalog schema. Product status is stored as `status_id`; the current price and quantity are stored in their own tables. Product/category attributes use PostgreSQL `jsonb`. `product_search_aliases` is an additional SQL projection used by the search fallback.

Product names are limited to 150 characters, descriptions to 2,000, and category names to 100. Prices must be at least `0.01`; stock must be zero or greater. New products default to `DRAFT`, and only `PUBLISHED` products appear in public search.

## Run

Requires JDK 21+, Maven 3.6+, and PostgreSQL. Create the `catalog_db` database, then run from this directory:

```bash
mvn spring-boot:run
```

The default connection is `jdbc:postgresql://localhost:5432/catalog_db`, username `postgres`, password `postgres`. Override these with `CATALOG_DATABASE_URL`, `CATALOG_DATABASE_USERNAME`, and `CATALOG_DATABASE_PASSWORD`. Liquibase applies the schema migrations; Hibernate validates the schema at startup. If the old BIGINT catalog tables are present, the first migration moves them to `catalog_legacy` so their data is retained while the new UUID-based tables are created in `public`.

To run auth-service and catalog-service together locally, copy the repository-root `.env.example` to `.env`, set your database credentials and a random Base64 JWT secret, then load it in each service terminal before starting Maven:

```bash
set -a
source ../../.env
set +a
mvn spring-boot:run
```

Run this from either `services/auth-service` or `services/catalog-service`. The actual repository-root `.env` is git-ignored and should not be committed.

## Check the API

- Swagger UI: <http://localhost:8080/swagger-ui.html>
- OpenAPI JSON: <http://localhost:8080/v3/api-docs>
- Health: `curl http://localhost:8080/api/products/health`
- Public list: `curl http://localhost:8080/api/products`
- Text search and filters: `curl 'http://localhost:8080/api/products?q=телефон&categoryId=<UUID>&minPrice=100&maxPrice=5000'`
- Category and price filter: `curl 'http://localhost:8080/api/products?categoryId=<UUID>&minPrice=100&maxPrice=5000'`

The public list should contain `Демонстрационный товар` with status `PUBLISHED` and omit `Черновик для проверки фильтра`.

## Roles and moderation

Write operations require a JWT signed by auth-service with HS256. Both services must receive the same Base64 `JWT_SECRET` (at least 32 decoded bytes) and `JWT_ISSUER` (defaults to `auth-service`). The catalog validates the signature, issuer, expiry, and roles locally; it does not call auth-service for each request or fetch a JWKS. The token must contain `roles` as an array with `SELLER` or `ADMIN`, and the seller UUID in `sub` or `userId`. `seller_id` is UUID and intentionally has no cross-database FK.

In Swagger, click **Authorize** and enter the bearer token. `POST /api/products/drafts` creates a draft; `POST /api/products/{productId}/submit-for-moderation` moves it to `PENDING_MODERATION`.

## Search and product editing

`GET /api/products` searches Elasticsearch across name and description and filters by status, category, and price. Product writes update Elasticsearch best-effort and transactionally update the `product_search_aliases` SQL projection. The projection serves as fallback when Elasticsearch is unavailable or returns no results.

Create a draft with `POST /api/products/drafts` and JSON fields `sellerId`, `categoryId`, `name`, `description`, `price`, and `stock`. Edit a draft using `PUT /api/products/{productId}/draft`. Change price and stock using `PATCH /api/products/{productId}/price-stock` with body `{"price":1499.00,"stock":8}`. Price history is represented by `product_prices`; currently the service keeps one row per product and updates its start date when the price changes.

Set the `CATALOG_DATABASE_*` variables for deployment. Demo seed data is disabled with the `prod` profile.
