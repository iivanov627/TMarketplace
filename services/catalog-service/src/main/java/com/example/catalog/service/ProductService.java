package com.example.catalog.service;

import com.example.catalog.dto.ProductResponse;
import com.example.catalog.dto.ProductDraftRequest;
import com.example.catalog.dto.ProductInventoryUpdateRequest;
import com.example.catalog.entity.Category;
import com.example.catalog.entity.Product;
import com.example.catalog.entity.ProductStatus;
import com.example.catalog.repository.CategoryRepository;
import com.example.catalog.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<ProductResponse> getPublishedProducts(UUID categoryId, BigDecimal minPrice, BigDecimal maxPrice) {
        if (minPrice != null && maxPrice != null && minPrice.compareTo(maxPrice) > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "minPrice must be less than or equal to maxPrice");
        }

        return productRepository.searchPublished(ProductStatus.PUBLISHED, categoryId, minPrice, maxPrice).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ProductResponse createDraft(ProductDraftRequest request) {
        Category category = getCategory(request.categoryId());
        Product product = Product.builder()
                .sellerId(request.sellerId()).category(category).name(request.name())
                .description(request.description()).price(request.price()).stock(request.stock())
                .status(ProductStatus.DRAFT).build();
        return toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateDraft(UUID productId, UUID sellerId, ProductDraftRequest request) {
        Product product = getSellerProduct(productId, sellerId);
        ensureDraft(product);
        if (!product.getSellerId().equals(request.sellerId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "sellerId cannot be changed");
        }
        product.setCategory(getCategory(request.categoryId()));
        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setStock(request.stock());
        return toResponse(product);
    }

    @Transactional
    public ProductResponse updatePriceAndStock(UUID productId, UUID sellerId, ProductInventoryUpdateRequest request) {
        Product product = getSellerProduct(productId, sellerId);
        product.setPrice(request.price());
        product.setStock(request.stock());
        return toResponse(product);
    }

    private Category getCategory(UUID categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
    }

    private Product getSellerProduct(UUID productId, UUID sellerId) {
        return productRepository.findByIdAndSellerId(productId, sellerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    }

    private void ensureDraft(Product product) {
        if (product.getStatus() != ProductStatus.DRAFT) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Only draft products can be edited");
        }
    }

    private ProductResponse toResponse(Product product) {
        return new ProductResponse(product.getId(), product.getSellerId(), product.getCategory().getId(),
                product.getName(), product.getDescription(), product.getPrice(), product.getStock(), product.getStatus());
    }
}
