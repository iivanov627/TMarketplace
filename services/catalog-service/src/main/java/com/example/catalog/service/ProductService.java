package com.example.catalog.service;

import com.example.catalog.dto.ProductResponse;
import com.example.catalog.dto.ProductDraftRequest;
import com.example.catalog.dto.ProductInventoryUpdateRequest;
import com.example.catalog.entity.ProductSearchDocument;
import com.example.catalog.entity.Category;
import com.example.catalog.entity.Product;
import com.example.catalog.entity.ProductSearchAlias;
import com.example.catalog.entity.ProductStatus;
import com.example.catalog.repository.CategoryRepository;
import com.example.catalog.repository.ProductRepository;
import com.example.catalog.repository.ProductSearchAliasRepository;
import com.example.catalog.exception.ElasticsearchUnavailableException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private static final Logger log = LoggerFactory.getLogger(ProductService.class);

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductSearchAliasRepository searchAliases;
    private final ElasticsearchProductSearchService elasticsearchSearch;

    @Transactional(readOnly = true)
    public List<ProductResponse> getPublishedProducts(
            String query, UUID categoryId, BigDecimal minPrice, BigDecimal maxPrice) {
        if (minPrice != null && maxPrice != null && minPrice.compareTo(maxPrice) > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "minPrice must be less than or equal to maxPrice");
        }

        String normalizedQuery = normalizeQuery(query);
        try {
            List<ProductSearchDocument> results = elasticsearchSearch.searchPublished(
                    normalizedQuery, categoryId, minPrice, maxPrice);
            if (results != null) {
                return results.stream().map(this::toResponse).toList();
            }
        } catch (ElasticsearchUnavailableException exception) {
            log.warn("Elasticsearch is unavailable; searching the SQL alias table instead");
        }

        List<ProductSearchAlias> fallbackResults = normalizedQuery == null
                ? searchAliases.searchWithoutText(ProductStatus.PUBLISHED, categoryId, minPrice, maxPrice)
                : searchAliases.searchWithText(
                ProductStatus.PUBLISHED, categoryId, minPrice, maxPrice, normalizedQuery);
        return fallbackResults.stream().map(this::toResponse).toList();
    }

    @Transactional
    public ProductResponse createDraft(ProductDraftRequest request) {
        Category category = getCategory(request.categoryId());
        Product product = Product.builder()
                .sellerId(request.sellerId()).category(category).name(request.name())
                .description(request.description()).price(request.price()).stock(request.stock())
                .status(ProductStatus.DRAFT).build();
        return saveAndUpdateSearchAlias(product);
    }

    @Transactional
    public ProductResponse updateDraft(UUID productId, UUID sellerId, boolean admin, ProductDraftRequest request) {
        Product product = getProductForActor(productId, sellerId, admin);
        ensureDraftOrRejected(product);

        if (product.getStatus() == ProductStatus.REJECTED) {
            product.setStatus(ProductStatus.DRAFT);
        }

        if (!product.getSellerId().equals(request.sellerId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "sellerId cannot be changed");
        }
        product.setCategory(getCategory(request.categoryId()));
        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setStock(request.stock());
        return saveAndUpdateSearchAlias(product);
    }

    @Transactional
    public ProductResponse updatePriceAndStock(
            UUID productId, UUID sellerId, boolean admin, ProductInventoryUpdateRequest request) {
        Product product = getProductForActor(productId, sellerId, admin);

        if (product.getStatus() == ProductStatus.REJECTED) {
            product.setStatus(ProductStatus.DRAFT);
        }

        product.setPrice(request.price());
        product.setStock(request.stock());
        return saveAndUpdateSearchAlias(product);
    }

    @Transactional
    public ProductResponse submitForModeration(UUID productId, UUID sellerId, boolean admin) {
        Product product = getProductForActor(productId, sellerId, admin);
        ensureDraftOrRejected(product);
        product.setStatus(ProductStatus.PENDING_MODERATION);
        return saveAndUpdateSearchAlias(product);
    }

    @Transactional
    public ProductResponse rejectProduct(UUID productid) {
        Product product = productRepository.findById(productid)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        if (product.getStatus() != ProductStatus.PENDING_MODERATION) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Only products pending moderation can be rejected");
        }

        product.setStatus(ProductStatus.REJECTED);
        return saveAndUpdateSearchAlias(product);
    }

    @Transactional
    public ProductResponse hideProduct(UUID productId, UUID sellerId, boolean admin) {
        Product product = getProductForActor(productId, sellerId, admin);

        if (product.getStatus() != ProductStatus.PUBLISHED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Only published products can be hidden");
        }

        product.setStatus(ProductStatus.HIDDEN);
        return saveAndUpdateSearchAlias(product);
    }

    @Transactional
    public ProductResponse unhideProduct(UUID productId, UUID sellerId, boolean admin) {
        Product product = getProductForActor(productId, sellerId, admin);

        if (product.getStatus() != ProductStatus.HIDDEN) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Only hidden products can be unhidden");
        }

        product.setStatus(ProductStatus.PUBLISHED);
        return saveAndUpdateSearchAlias(product);
    }

    @Transactional
    public ProductResponse archiveProduct(UUID productId, UUID sellerId, boolean admin) {
        Product product = getProductForActor(productId, sellerId, admin);

        if (product.getStatus() != ProductStatus.PUBLISHED && product.getStatus() != ProductStatus.HIDDEN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only published or hidden products can be archived");
        }

        product.setStatus(ProductStatus.ARCHIVED);
        return saveAndUpdateSearchAlias(product);
    }

    @Transactional
    public ProductResponse unarchiveProduct(UUID productId, UUID sellerId, boolean admin) {
        Product product = getProductForActor(productId, sellerId, admin);

        if (product.getStatus() != ProductStatus.ARCHIVED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product is not archived");
        }

        product.setStatus(ProductStatus.DRAFT);
        return saveAndUpdateSearchAlias(product);
    }

    @Transactional
    public ProductResponse deleteProduct(UUID productId, UUID sellerId, boolean admin) {
        Product product = getProductForActor(productId, sellerId, admin);

        if (product.getStatus() == ProductStatus.DELETED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Product is already deleted");
        }

        product.setStatus(ProductStatus.DELETED);
        return saveAndUpdateSearchAlias(product);
    }

    private ProductResponse saveAndUpdateSearchAlias(Product product) {
        product.attachPriceAndInventory();
        product = productRepository.save(product);
        ProductResponse response = toResponse(product);
        searchAliases.save(ProductSearchAlias.from(product));
        elasticsearchSearch.index(product);
        return response;
    }

    private Category getCategory(UUID categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
    }

    private Product getSellerProduct(UUID productId, UUID sellerId) {
        return productRepository.findByIdAndSellerId(productId, sellerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    }

    private Product getProductForActor(UUID productId, UUID sellerId, boolean admin) {
        if (admin) {
            return productRepository.findById(productId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        }
        return getSellerProduct(productId, sellerId);
    }

    private void ensureDraftOrRejected(Product product) {
        if (product.getStatus() != ProductStatus.DRAFT && product.getStatus() != ProductStatus.REJECTED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Only draft or rejected products can be edited");
        }
    }

    private ProductResponse toResponse(Product product) {
        return new ProductResponse(product.getId(), product.getSellerId(), product.getCategory().getId(),
                product.getName(), product.getDescription(), product.getPrice(), product.getStock(), product.getStatus());
    }

    private ProductResponse toResponse(ProductSearchAlias product) {
        return new ProductResponse(product.getProductId(), product.getSellerId(), product.getCategoryId(),
                product.getName(), product.getDescription(), product.getPrice(), product.getStock(), product.getStatus());
    }

    private ProductResponse toResponse(ProductSearchDocument product) {
        return new ProductResponse(product.id(), product.sellerId(), product.categoryId(),
                product.name(), product.description(), product.price(), product.stock(), product.status());
    }

    private String normalizeQuery(String query) {
        return query == null || query.isBlank() ? null : query.trim();
    }
}
