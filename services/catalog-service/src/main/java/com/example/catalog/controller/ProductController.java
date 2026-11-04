package com.example.catalog.controller;

import com.example.catalog.dto.ProductResponse;
import com.example.catalog.dto.ProductDraftRequest;
import com.example.catalog.dto.ProductInventoryUpdateRequest;
import com.example.catalog.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Товары", description = "Публичный каталог товаров")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Список опубликованных товаров")
    public List<ProductResponse> getPublishedProducts(
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        return productService.getPublishedProducts(categoryId, minPrice, maxPrice);
    }

    @PostMapping("/drafts")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Создать черновик товара")
    public ProductResponse createDraft(@Valid @RequestBody ProductDraftRequest request) {
        return productService.createDraft(request);
    }

    @PutMapping("/{productId}/draft")
    @Operation(summary = "Изменить черновик товара")
    public ProductResponse updateDraft(
            @PathVariable UUID productId,
            @RequestParam UUID sellerId,
            @Valid @RequestBody ProductDraftRequest request) {
        return productService.updateDraft(productId, sellerId, request);
    }

    @PatchMapping("/{productId}/price-stock")
    @Operation(summary = "Изменить цену и остаток черновика")
    public ProductResponse updatePriceAndStock(
            @PathVariable UUID productId,
            @RequestParam UUID sellerId,
            @Valid @RequestBody ProductInventoryUpdateRequest request) {
        return productService.updatePriceAndStock(productId, sellerId, request);
    }

    @GetMapping("/health")
    public String health() {
        return "catalog-service is running";
    }
}
