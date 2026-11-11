package com.example.catalog.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.UUID;

@Converter
public class ProductStatusConverter implements AttributeConverter<ProductStatus, UUID> {
    @Override
    public UUID convertToDatabaseColumn(ProductStatus status) {
        return status == null ? null : status.id();
    }

    @Override
    public ProductStatus convertToEntityAttribute(UUID id) {
        return id == null ? null : ProductStatus.fromId(id);
    }
}
