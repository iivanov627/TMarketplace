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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

import java.time.LocalDateTime;

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
    public Page<ProductResponse> getProducts(
            String query,
            UUID categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable
    ) {
        if (minPrice != null && maxPrice != null
                && minPrice.compareTo(maxPrice) > 0) {
            throw new ResponseStatusException
                    (HttpStatus.BAD_REQUEST, "minPrice must be less than or equal to maxPrice"
                    );
        }

        String normalizedQuery = normalizeQuery(query);
        try {
            Page<ProductSearchDocument> results =
                    elasticsearchSearch.searchPublished(
                            normalizedQuery,
                            categoryId,
                            minPrice,
                            maxPrice,
                            pageable
                    );
            return results.map(this::toResponse);

        } catch (ElasticsearchUnavailableException exception) {
            log.warn("Elasticsearch is unavailable; searching the SQL alias table instead");
        }

        Page<ProductSearchAlias> fallbackResults = normalizedQuery == null
                ? searchAliases.searchWithoutText(
                ProductStatus.PUBLISHED,
                categoryId,
                minPrice,
                maxPrice,
                pageable
        )
                : searchAliases.searchWithText(
                ProductStatus.PUBLISHED,
                categoryId,
                minPrice,
                maxPrice,
                normalizedQuery,
                pageable
        );

        return fallbackResults.map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductCard(UUID productId, UUID sellerId, boolean admin) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        if (!admin && product.getStatus() != ProductStatus.PUBLISHED) {
            if (sellerId == null || !product.getSellerId().equals(sellerId)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
            }
        }

        return toResponse(product);
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
    public ProductResponse approveProduct(UUID producId) {
        Product product = productRepository.findById(producId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        if (product.getStatus() != ProductStatus.PENDING_MODERATION) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Only products pending moderation can be approved");
        }

        product.setStatus(ProductStatus.APPROVED);
        return saveAndUpdateSearchAlias(product);
    }

    @Transactional
    public ProductResponse publishProduct(UUID productId, UUID sellerId, boolean admin) {
        Product product = getProductForActor(productId, sellerId, admin);

        if (product.getStatus() != ProductStatus.APPROVED) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Only approved products can be published"
            );
        }

        product.setStatus(ProductStatus.PUBLISHED);
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
        product.setArchivedAt(LocalDateTime.now());

        return saveAndUpdateSearchAlias(product);
    }

    @Transactional
    public ProductResponse unarchiveProduct(UUID productId, UUID sellerId, boolean admin) {
        Product product = getProductForActor(productId, sellerId, admin);

        if (product.getStatus() != ProductStatus.ARCHIVED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product is not archived");
        }

        product.setStatus(ProductStatus.DRAFT);
        product.setArchivedAt(null);

        return saveAndUpdateSearchAlias(product);
    }

    @Transactional
    public void deleteExpiredArchivedProduct(UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Product not found"
                ));

        LocalDateTime expirationDate = LocalDateTime.now().minusDays(30);

        if (product.getStatus() != ProductStatus.ARCHIVED
                || product.getArchivedAt() == null
                || product.getArchivedAt().isAfter(expirationDate)) {
            return;
        }

        searchAliases.deleteByProductId(productId);
        elasticsearchSearch.delete(productId);
        productRepository.delete(product);

        log.info("Product permanently deleted after 30 days in archive: {}", productId);
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

    @EventListener(ApplicationReadyEvent.class)
    @Transactional(readOnly = true)
    public void reindexProductsOnStartup() {
        List<Product> allProducts = productRepository.findAll();

        log.info("Starting Elasticsearch reindexing. Products found: {}", allProducts.size());

        allProducts.forEach(elasticsearchSearch::index);

        log.info("Elasticsearch reindexing completed");
    }

    private String normalizeQuery(String query) {
        return query == null || query.isBlank() ? null : query.trim();
    }
}
