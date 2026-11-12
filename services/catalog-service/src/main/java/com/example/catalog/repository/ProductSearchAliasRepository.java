package com.example.catalog.repository;

import com.example.catalog.entity.ProductSearchAlias;
import com.example.catalog.entity.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface ProductSearchAliasRepository extends JpaRepository<ProductSearchAlias, UUID> {

    @Query("""
            select p from ProductSearchAlias p
            where p.status = :status
              and (:categoryId is null or p.categoryId = :categoryId)
              and (:minPrice is null or p.price >= :minPrice)
              and (:maxPrice is null or p.price <= :maxPrice)
            order by p.createdAt desc
            """)
    List<ProductSearchAlias> searchWithoutText(
            @Param("status") ProductStatus status,
            @Param("categoryId") UUID categoryId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice);

    @Query("""
            select p from ProductSearchAlias p
            where p.status = :status
              and (:categoryId is null or p.categoryId = :categoryId)
              and (:minPrice is null or p.price >= :minPrice)
              and (:maxPrice is null or p.price <= :maxPrice)
              and (lower(p.name) like lower(concat('%', :query, '%'))
                   or lower(p.description) like lower(concat('%', :query, '%')))
            order by p.createdAt desc
            """)
    List<ProductSearchAlias> searchWithText(
            @Param("status") ProductStatus status,
            @Param("categoryId") UUID categoryId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("query") String query);
}
