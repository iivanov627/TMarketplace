package com.example.catalog.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Document(indexName = "${catalog.search.index:products}", createIndex = false)
public record ProductSearchDocument(
        @Id UUID id,
        @Field(type = FieldType.Keyword) UUID sellerId,
        @Field(type = FieldType.Keyword) UUID categoryId,
        @Field(type = FieldType.Text) String name,
        @Field(type = FieldType.Text) String description,
        @Field(type = FieldType.Double) BigDecimal price,
        @Field(type = FieldType.Integer) Integer stock,
        @Field(type = FieldType.Keyword) ProductStatus status,
        @Field(type = FieldType.Date) Instant createdAt) {

    public static ProductSearchDocument from(Product product) {
        return new ProductSearchDocument(product.getId(), product.getSellerId(), product.getCategory().getId(),
                product.getName(), product.getDescription(), product.getPrice(), product.getStock(),
                product.getStatus(), product.getCreatedAt());
    }
}
