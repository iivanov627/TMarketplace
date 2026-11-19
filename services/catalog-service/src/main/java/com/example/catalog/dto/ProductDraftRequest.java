package com.example.catalog.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public record ProductDraftRequest(
        @NotNull UUID sellerId,
        @NotNull UUID categoryId,
        @NotBlank String name,
        @NotBlank String description,
        @NotNull @DecimalMin("0.01") BigDecimal price,
        @NotNull @Min(0) Integer stock
) {
}
