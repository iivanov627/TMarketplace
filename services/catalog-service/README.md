# Catalog service

Java 21 / Spring Boot service for product catalog. The default profile uses an in-memory H2 database and inserts a demo category with one published product and one draft, so it can be started without PostgreSQL or other services.

## Product fields and publication rules

- Required: seller ID, category, name, description, price and stock.
- Name is limited to 200 characters; category name and slug are limited to 100 characters.
- Price must be at least `0.01`; stock must be zero or greater.
- New products default to `DRAFT`. Only products with status `PUBLISHED` appear in the public list. Other statuses are `PENDING_MODERATION`, `REJECTED` and `ARCHIVED`.
- A category has a unique slug and can have a parent category.

## Run

From this directory:

```bash
mvn spring-boot:run
```

Requires JDK 21+ and Maven 3.6+. The HTTP port defaults to `8082` and can be changed with `PORT`.

## Check

- Swagger UI: <http://localhost:8082/swagger-ui.html>
- OpenAPI JSON: <http://localhost:8082/v3/api-docs>
- Health: `curl http://localhost:8082/api/products/health`
- Public list: `curl http://localhost:8082/api/products`
- Filter by category and price: `curl 'http://localhost:8082/api/products?categoryId=<UUID>&minPrice=100&maxPrice=5000'`
- H2 console: <http://localhost:8082/h2-console> (JDBC URL `jdbc:h2:mem:catalogdb`, user `sa`, empty password)

The public list should contain `Демонстрационный товар` with status `PUBLISHED` and omit `Черновик для проверки фильтра`.

## Draft and inventory API

Create a draft with `POST /api/products/drafts` and JSON fields `sellerId`, `categoryId`, `name`, `description`, `price`, and `stock`. Creation always sets status to `DRAFT`.

Edit all draft fields with `PUT /api/products/{productId}/draft?sellerId=<seller UUID>` and the same JSON body. The seller ID in the body must match the owner. Only draft products can be fully edited.

Change price and stock with `PATCH /api/products/{productId}/price-stock?sellerId=<seller UUID>` and body `{"price":1499.00,"stock":8}`. Price must be at least `0.01`; stock must be zero or more. The supplied seller ID must own the product.

The public list accepts any combination of `categoryId`, `minPrice`, and `maxPrice`; both price bounds are inclusive. If `minPrice` is greater than `maxPrice`, the service returns HTTP 400. Seller IDs are passed explicitly for this prototype; replace this with the authenticated seller identity from JWT before treating the write endpoints as production-secure.

Run the automated check from this directory with `mvn test`. It verifies that drafts are excluded from the public product list.

To use a persistent database, provide a PostgreSQL datasource configuration and run with the `prod` profile; demo seed data is disabled in that profile.
