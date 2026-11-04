package com.example.catalog.service;

import com.example.catalog.dto.ProductResponse;
import com.example.catalog.entity.ProductStatus;
import com.example.catalog.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<ProductResponse> getPublishedProducts() {

        return productRepository
                .findAllByStatusOrderByCreatedAtDesc(ProductStatus.PUBLISHED)
                .stream()
                .map(product -> new ProductResponse(
                        product.getId(),
                        product.getSellerId(),
                        product.getCategory().getId(),
                        product.getName(),
                        product.getDescription(),
                        product.getPrice(),
                        product.getStock(),
                        product.getStatus()
                ))
                .toList();
    }
}
