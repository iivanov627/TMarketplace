package com.example.catalog.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "product_search_aliases")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSearchAlias {

    @Id
    @Column(name = "product_id")
    private UUID productId;

    @Column(nullable = false)
    private UUID sellerId;

    @Column(nullable = false)
    private UUID categoryId;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer stock;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private ProductStatus status;

    @Column(nullable = false)
    private Instant createdAt;

    public static ProductSearchAlias from(Product product) {
        return ProductSearchAlias.builder()
                .productId(product.getId())
                .sellerId(product.getSellerId())
                .categoryId(product.getCategory().getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .status(product.getStatus())
                .createdAt(product.getCreatedAt())
                .build();
    }
}
