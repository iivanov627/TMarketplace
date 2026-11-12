package com.example.catalog;

import com.example.catalog.entity.Category;
import com.example.catalog.entity.Product;
import com.example.catalog.entity.ProductStatus;
import com.example.catalog.repository.CategoryRepository;
import com.example.catalog.repository.ProductRepository;
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
    ProductService productService;

    @MockBean
    ElasticsearchProductSearchService elasticsearchSearch;

    Product publishedProduct;

    @BeforeEach
    void setUp() {
        products.deleteAll();
        categories.deleteAll();
        Category category = categories.save(Category.builder().name("Книги").build());
        publishedProduct = products.save(product(category, "Опубликован", ProductStatus.PUBLISHED));
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
    void returnsServiceUnavailableWhenElasticsearchIsUnavailable() throws Exception {
        when(elasticsearchSearch.searchPublished("Опубликован", null, null, null))
                .thenThrow(new ElasticsearchUnavailableException(new IOException("connection refused")));

        mockMvc.perform(get("/api/products").param("q", "Опубликован"))
                .andExpect(status().isServiceUnavailable());
    }

    @Test
    void createsAndUpdatesProductAndIndexesChanges() {
        UUID sellerId = UUID.fromString("11111111-1111-1111-1111-111111111111");
        UUID categoryId = categories.findAll().getFirst().getId();
        ProductDraftRequest createRequest = new ProductDraftRequest(sellerId, categoryId,
                "Новый товар", "Первое описание", new BigDecimal("50.00"), 4);

        var created = productService.createDraft(createRequest);
        var createdProduct = products.findById(created.id()).orElseThrow();
        assertThat(createdProduct.getName()).isEqualTo("Новый товар");
        assertThat(createdProduct.getPrice()).isEqualByComparingTo("50.00");

        ProductDraftRequest editRequest = new ProductDraftRequest(sellerId, categoryId,
                "Обновлённый товар", "Новое описание", new BigDecimal("75.00"), 8);
        productService.updateDraft(created.id(), sellerId, false, editRequest);

        var updatedProduct = products.findById(created.id()).orElseThrow();
        assertThat(updatedProduct.getName()).isEqualTo("Обновлённый товар");
        assertThat(updatedProduct.getDescription()).isEqualTo("Новое описание");
        assertThat(updatedProduct.getPrice()).isEqualByComparingTo("75.00");
        assertThat(updatedProduct.getStock()).isEqualTo(8);

        productService.updatePriceAndStock(created.id(), sellerId, false,
                new ProductInventoryUpdateRequest(new BigDecimal("80.00"), 9));
        var updatedInventory = products.findById(created.id()).orElseThrow();
        assertThat(updatedInventory.getPrice()).isEqualByComparingTo("80.00");
        assertThat(updatedInventory.getStock()).isEqualTo(9);
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
