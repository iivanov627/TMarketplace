package com.example.catalog.config;

import com.example.catalog.entity.Category;
import com.example.catalog.entity.Product;
import com.example.catalog.entity.ProductSearchAlias;
import com.example.catalog.entity.ProductStatus;
import com.example.catalog.repository.CategoryRepository;
import com.example.catalog.repository.ProductRepository;
import com.example.catalog.repository.ProductSearchAliasRepository;
import com.example.catalog.service.ElasticsearchProductSearchService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.math.BigDecimal;
import java.util.UUID;

@Configuration
@Profile("!prod")
public class DemoDataConfiguration {

    @Bean
    CommandLineRunner loadDemoData(CategoryRepository categories, ProductRepository products) {
    CommandLineRunner loadDemoData(
            CategoryRepository categories,
            ProductRepository products,
            ProductSearchAliasRepository searchAliases,
            ElasticsearchProductSearchService elasticsearchSearch) {
        return args -> {
            if (categories.count() != 0) {
                return;
            }

            Category electronics = categories.save(Category.builder()
                    .name("Электроника")
                    .build());
            Product published = Product.builder()
                    .sellerId(UUID.fromString("11111111-1111-1111-1111-111111111111"))
                    .category(electronics)
                    .name("Демонстрационный товар")
                    .description("Опубликованный товар для проверки каталога")
                    .price(new BigDecimal("1299.00"))
                    .stock(5)
                    .status(ProductStatus.PUBLISHED)
                    .build();
            published.attachPriceAndInventory();
            published = products.save(published);
            Product draft = Product.builder()
                    .sellerId(UUID.fromString("11111111-1111-1111-1111-111111111111"))
                    .category(electronics)
                    .name("Черновик для проверки фильтра")
                    .description("Этот товар не должен появиться в публичном списке")
                    .price(new BigDecimal("999.00"))
                    .stock(2)
                    .status(ProductStatus.DRAFT)
                    .build());
                    .build();
            draft.attachPriceAndInventory();
            draft = products.save(draft);
        };
    }
}
