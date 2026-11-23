package com.example.catalog.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import com.example.catalog.exception.ElasticsearchUnavailableException;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.indices.CreateIndexRequest;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import com.example.catalog.entity.Product;
import com.example.catalog.entity.ProductSearchDocument;
import com.example.catalog.entity.ProductStatus;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.concurrent.atomic.AtomicBoolean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import co.elastic.clients.elasticsearch._types.SortOrder;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class ElasticsearchProductSearchService {

    private static final Logger log = LoggerFactory.getLogger(ElasticsearchProductSearchService.class);
    private final ElasticsearchClient client;
    private final String indexName;

    private final AtomicBoolean indexInitialized = new AtomicBoolean(false);

    public ElasticsearchProductSearchService(
            ElasticsearchClient client,
            @Value("${catalog.search.index:products}") String indexName) {
        this.client = client;
        this.indexName = indexName;
    }

    @PostConstruct
    public void init() {
        try {
            ensureIndex();
        } catch (Exception e) {
            log.warn("Failed to initialize Elasticsearch index on startup: {}", e.getMessage());
        }
    }

    @CircuitBreaker(name = "elasticsearch", fallbackMethod = "fallbackSearch")
    public Page<ProductSearchDocument> searchPublished(
            String text,
            UUID categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable
    ) {
        Query query = Query.of(q -> q.bool(bool -> {
            if (text == null || text.isBlank()) {
                bool.must(m -> m.matchAll(matchAll -> matchAll));
            } else {
                bool.must(m -> m.multiMatch(mm -> mm
                        .query(text)
                        .fields("name^3", "description")));
            }
            bool.filter(f -> f.term(t -> t.field("status").value(ProductStatus.PUBLISHED.name())));
            if (categoryId != null) {
                bool.filter(f -> f.term(t -> t.field("categoryId").value(categoryId.toString())));
            }
            if (minPrice != null) {
                bool.filter(f -> f.range(r -> r.number(n -> n.field("price").gte(minPrice.doubleValue()))));
            }
            if (maxPrice != null) {
                bool.filter(f -> f.range(r -> r.number(n -> n.field("price").lte(maxPrice.doubleValue()))));
            }
            return bool;
        }));

        try {
            SearchResponse<ProductSearchDocument> response = client.search(s -> s
                            .index(indexName)
                            .from(Math.toIntExact(pageable.getOffset()))
                            .size(pageable.getPageSize())
                            .trackTotalHits(t -> t.enabled(true))
                            .sort(sort -> sort.field(f -> f
                                    .field("createdAt")
                                    .order(SortOrder.Desc)))
                            .query(query),
                    ProductSearchDocument.class);

            List<ProductSearchDocument> content = response.hits().hits().stream()
                    .map(hit -> hit.source())
                    .filter(Objects::nonNull)
                    .toList();

            long total = response.hits().total() != null
                    ? response.hits().total().value()
                    : content.size();

            return new PageImpl<>(content, pageable, total);

        } catch (IOException | RuntimeException exception) {
            throw new ElasticsearchUnavailableException(exception);
        }
    }

    public Page<ProductSearchDocument> fallbackSearch(
            String text,
            UUID categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable,
            Throwable t
    ) {
        log.warn("Elasticsearch is unavailable", t);
        throw new ElasticsearchUnavailableException(t);
    }

    public void index(Product product) {
        try {
            ensureIndex();
            client.index(i -> i.index(indexName)
                    .id(product.getId().toString())
                    .document(ProductSearchDocument.from(product)));
        } catch (IOException | RuntimeException exception) {
            log.warn("Could not index product {} in Elasticsearch; SQL search alias remains available",
                    product.getId(), exception);
        }
    }

    private void ensureIndex() throws IOException {
        if (indexInitialized.get()) {
            return;
        }

        synchronized (this) {
            if (indexInitialized.get()) return;

            if (!client.indices().exists(e -> e.index(indexName)).value()) {
                CreateIndexRequest request = CreateIndexRequest.of(create -> create
                        .index(indexName)
                        .mappings(mapping -> mapping
                                .properties("id", p -> p.keyword(k -> k))
                                .properties("sellerId", p -> p.keyword(k -> k))
                                .properties("categoryId", p -> p.keyword(k -> k))
                                .properties("name", p -> p.text(t -> t))
                                .properties("description", p -> p.text(t -> t))
                                .properties("price", p -> p.double_(d -> d))
                                .properties("stock", p -> p.integer(i -> i))
                                .properties("status", p -> p.keyword(k -> k))
                                .properties("createdAt", p -> p.date(d -> d))));
                client.indices().create(request);
                log.info("Created Elasticsearch index: {}", indexName);
            }
            indexInitialized.set(true);
        }
    }
}
