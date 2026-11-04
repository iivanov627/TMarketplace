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
- H2 console: <http://localhost:8082/h2-console> (JDBC URL `jdbc:h2:mem:catalogdb`, user `sa`, empty password)

The public list should contain `Демонстрационный товар` with status `PUBLISHED` and omit `Черновик для проверки фильтра`.

Run the automated check from this directory with `mvn test`. It verifies that drafts are excluded from the public product list.

To use a persistent database, provide a PostgreSQL datasource configuration and run with the `prod` profile; demo seed data is disabled in that profile.
