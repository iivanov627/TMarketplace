package com.example.catalog.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "product_inventory", uniqueConstraints = @UniqueConstraint(columnNames = "product_id"))
@Getter
@NoArgsConstructor
public class ProductInventory {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public ProductInventory(Product product, Integer quantity) {
        this.product = product;
        this.quantity = quantity;
        this.updatedAt = Instant.now();
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
        this.updatedAt = Instant.now();
    }
}
