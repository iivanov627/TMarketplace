package com.example.catalog.entity;

import jakarta.persistence.*;
import lombok.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import com.fasterxml.jackson.databind.JsonNode;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "products")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "seller_id", nullable = false)
    @NotNull
    private UUID sellerId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    @NotNull
    private Category category;

    @Column(nullable = false, length = 150)
    @NotBlank
    private String name;

    @Column(nullable = false, length = 2000)
    @NotBlank
    private String description;

    @Transient
    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal price;

    @Transient
    @NotNull
    @Min(0)
    private Integer stock;

    @Convert(converter = ProductStatusConverter.class)
    @Column(name = "status_id", nullable = false)
    private ProductStatus status;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<ProductPrice> productPrices = new ArrayList<>();

    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private ProductInventory productInventory;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private JsonNode attributes;

    public BigDecimal getPrice() {
        if (productPrices != null && !productPrices.isEmpty()) {
            return productPrices.stream()
                    .filter(priceRow -> priceRow.getEndDate() == null)
                    .max(java.util.Comparator.comparing(ProductPrice::getStartDate))
                    .map(ProductPrice::getPrice)
                    .orElse(price);
        }
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
        if (productPrices == null) productPrices = new ArrayList<>();
        ProductPrice current = productPrices.stream()
                .filter(priceRow -> priceRow.getEndDate() == null)
                .max(java.util.Comparator.comparing(ProductPrice::getStartDate))
                .orElse(null);
        if (current != null && current.getPrice().compareTo(price) == 0) return;
        if (current != null) current.closeAt(Instant.now());
        productPrices.add(new ProductPrice(this, price));
    }

    public Integer getStock() {
        return productInventory == null ? stock : productInventory.getQuantity();
    }

    public void setStock(Integer stock) {
        this.stock = stock;
        if (productInventory != null) productInventory.setQuantity(stock);
    }

    public void attachPriceAndInventory() {
        if ((productPrices == null || productPrices.isEmpty()) && price != null) {
            productPrices = new ArrayList<>();
            productPrices.add(new ProductPrice(this, price));
        }
        if (productInventory == null && stock != null) productInventory = new ProductInventory(this, stock);
    }

    @PostLoad
    protected void loadPriceAndInventory() {
        price = getPrice();
        stock = productInventory == null ? null : productInventory.getQuantity();
    }

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();

        createdAt = now;
        updatedAt = now;

        if (status == null) {
            status = ProductStatus.DRAFT;
        }
        attachPriceAndInventory();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
