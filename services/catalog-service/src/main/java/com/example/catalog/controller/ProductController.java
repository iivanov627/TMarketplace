package com.example.catalog.controller;

import com.example.catalog.dto.ProductResponse;
import com.example.catalog.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Товары", description = "Публичный каталог товаров")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Список опубликованных товаров")
    public List<ProductResponse> getPublishedProducts() {
        return productService.getPublishedProducts();
    }

    @GetMapping("/health")
    public String health() {
        return "catalog-service is running";
    }
}
