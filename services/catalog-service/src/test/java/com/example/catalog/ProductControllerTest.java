package com.example.catalog;

import com.example.catalog.entity.Category;
import com.example.catalog.entity.Product;
import com.example.catalog.entity.ProductStatus;
import com.example.catalog.repository.CategoryRepository;
import com.example.catalog.repository.ProductRepository;
import com.example.catalog.repository.ProductSearchAliasRepository;
import com.example.catalog.entity.ProductSearchAlias;
import com.example.catalog.entity.ProductSearchDocument;
import com.example.catalog.exception.ElasticsearchUnavailableException;
import com.example.catalog.service.ElasticsearchProductSearchService;
import com.example.catalog.service.ProductService;
import com.example.catalog.dto.ProductDraftRequest;
import com.example.catalog.dto.ProductInventoryUpdateRequest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.UUID;
import java.io.IOException;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.Mockito.when;

@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ProductRepository products;

    @Autowired
    CategoryRepository categories;

    @Autowired
    ProductSearchAliasRepository searchAliases;

    @Autowired
    ProductService productService;

    @MockBean
    ElasticsearchProductSearchService elasticsearchSearch;

    Product publishedProduct;

    @BeforeEach
    void setUp() {
        searchAliases.deleteAll();
        products.deleteAll();
        categories.deleteAll();
        Category category = categories.save(Category.builder().name("Книги").build());
        publishedProduct = products.save(product(category, "Опубликован", ProductStatus.PUBLISHED));
        Product draft = products.save(product(category, "Черновик", ProductStatus.DRAFT));
        searchAliases.save(ProductSearchAlias.from(publishedProduct));
        searchAliases.save(ProductSearchAlias.from(draft));
        when(elasticsearchSearch.searchPublished(null, null, null, null))
                .thenReturn(List.of(ProductSearchDocument.from(publishedProduct)));
    }

    @Test
    void returnsOnlyPublishedProducts() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("Опубликован"))
                .andExpect(jsonPath("$[0].status").value("PUBLISHED"));
    }

    @Test
    void fallsBackToSqlAliasWhenElasticsearchIsUnavailable() throws Exception {
        when(elasticsearchSearch.searchPublished("Опубликован", null, null, null))
                .thenThrow(new ElasticsearchUnavailableException(new IOException("connection refused")));

        mockMvc.perform(get("/api/products").param("q", "Опубликован"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("Опубликован"));
    }

    @Test
    void createsAndUpdatesSqlAliasWithProductChanges() {
        UUID sellerId = UUID.fromString("11111111-1111-1111-1111-111111111111");
        UUID categoryId = categories.findAll().getFirst().getId();
        ProductDraftRequest createRequest = new ProductDraftRequest(sellerId, categoryId,
                "Новый товар", "Первое описание", new BigDecimal("50.00"), 4);

        var created = productService.createDraft(createRequest);
        var createdAlias = searchAliases.findById(created.id()).orElseThrow();
        assertThat(createdAlias.getName()).isEqualTo("Новый товар");
        assertThat(createdAlias.getPrice()).isEqualByComparingTo("50.00");

        ProductDraftRequest editRequest = new ProductDraftRequest(sellerId, categoryId,
                "Обновлённый товар", "Новое описание", new BigDecimal("75.00"), 8);
        productService.updateDraft(created.id(), sellerId, false, editRequest);

        var updatedAlias = searchAliases.findById(created.id()).orElseThrow();
        assertThat(updatedAlias.getName()).isEqualTo("Обновлённый товар");
        assertThat(updatedAlias.getDescription()).isEqualTo("Новое описание");
        assertThat(updatedAlias.getPrice()).isEqualByComparingTo("75.00");
        assertThat(updatedAlias.getStock()).isEqualTo(8);

        productService.updatePriceAndStock(created.id(), sellerId, false,
                new ProductInventoryUpdateRequest(new BigDecimal("80.00"), 9));
        var inventoryAlias = searchAliases.findById(created.id()).orElseThrow();
        assertThat(inventoryAlias.getPrice()).isEqualByComparingTo("80.00");
        assertThat(inventoryAlias.getStock()).isEqualTo(9);
        verify(elasticsearchSearch, org.mockito.Mockito.times(3)).index(any(Product.class));
    }

    private Product product(Category category, String name, ProductStatus status) {
        Product product = Product.builder()
                .sellerId(UUID.fromString("11111111-1111-1111-1111-111111111111"))
                .category(category)
                .name(name)
                .description("Описание")
                .price(new BigDecimal("10.00"))
                .stock(3)
                .status(status)
                .build();
        product.attachPriceAndInventory();
        return product;
    }
}
