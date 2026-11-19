package com.example.catalog.dto;

import com.example.catalog.entity.ProductStatus;

import java.math.BigDecimal;
import java.util.UUID;

public record ProductResponse(
        UUID id,
        UUID sellerId,
        UUID categoryId,
        String name,
        String description,
        BigDecimal price,
        Integer stock,
        ProductStatus status
) {
}
