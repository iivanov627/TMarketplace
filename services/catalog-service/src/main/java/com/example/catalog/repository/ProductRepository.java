package com.example.catalog.repository;

import com.example.catalog.entity.Product;
import com.example.catalog.entity.ProductStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, UUID> {

    List<Product> findAllByStatusOrderByCreatedAtDesc(ProductStatus status);

    List<Product> findAllByCategory_IdAndStatusOrderByCreatedAtDesc(UUID categoryId, ProductStatus status);

    List<Product> findAllByStatusAndCategory_IdAndPriceBetweenOrderByCreatedAtDesc(
            ProductStatus status, UUID categoryId, java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice);

    List<Product> findAllByStatusAndCategory_IdAndPriceGreaterThanEqualOrderByCreatedAtDesc(
            ProductStatus status, UUID categoryId, java.math.BigDecimal minPrice);

    List<Product> findAllByStatusAndCategory_IdAndPriceLessThanEqualOrderByCreatedAtDesc(
            ProductStatus status, UUID categoryId, java.math.BigDecimal maxPrice);

    List<Product> findAllByStatusAndPriceBetweenOrderByCreatedAtDesc(
            ProductStatus status, java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice);

    List<Product> findAllByStatusAndPriceGreaterThanEqualOrderByCreatedAtDesc(
            ProductStatus status, java.math.BigDecimal minPrice);

    List<Product> findAllByStatusAndPriceLessThanEqualOrderByCreatedAtDesc(
            ProductStatus status, java.math.BigDecimal maxPrice);

    Optional<Product> findByIdAndSellerId(UUID id, UUID sellerId);
}
