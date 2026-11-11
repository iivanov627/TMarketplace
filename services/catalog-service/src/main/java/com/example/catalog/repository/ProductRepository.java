package com.example.catalog.repository;

import com.example.catalog.entity.Product;
import com.example.catalog.entity.ProductStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {

    @Query("""
            select distinct p from Product p
            join p.productPrices currentPrice on currentPrice.endDate is null
            where p.status = :status
              and (:categoryId is null or p.category.id = :categoryId)
              and (:minPrice is null or currentPrice.price >= :minPrice)
              and (:maxPrice is null or currentPrice.price <= :maxPrice)
            order by p.createdAt desc
            """)
    List<Product> searchPublished(
            @Param("status") ProductStatus status,
            @Param("categoryId") UUID categoryId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice);

    Optional<Product> findByIdAndSellerId(UUID id, UUID sellerId);
}
