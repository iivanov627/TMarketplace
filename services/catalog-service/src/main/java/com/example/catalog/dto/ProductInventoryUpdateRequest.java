package com.example.catalog.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ProductInventoryUpdateRequest(
        @NotNull @DecimalMin("0.01") BigDecimal price,
        @NotNull @Min(0) Integer stock
) {
}
