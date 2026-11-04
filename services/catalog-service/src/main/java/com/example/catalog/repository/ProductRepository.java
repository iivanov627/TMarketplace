package com.example.catalog.repository;

import com.example.catalog.entity.Product;
import com.example.catalog.entity.ProductStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {

    List<Product> findAllByStatusOrderByCreatedAtDesc(ProductStatus status);
}
