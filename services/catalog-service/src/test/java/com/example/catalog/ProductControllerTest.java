package com.example.catalog;

import com.example.catalog.entity.Category;
import com.example.catalog.entity.Product;
import com.example.catalog.entity.ProductStatus;
import com.example.catalog.repository.CategoryRepository;
import com.example.catalog.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ProductRepository products;

    @Autowired
    CategoryRepository categories;

    @BeforeEach
    void setUp() {
        products.deleteAll();
        categories.deleteAll();
        Category category = categories.save(Category.builder().name("Книги").slug("books").build());
        products.save(product(category, "Опубликован", ProductStatus.PUBLISHED));
        products.save(product(category, "Черновик", ProductStatus.DRAFT));
    }

    @Test
    void returnsOnlyPublishedProducts() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("Опубликован"))
                .andExpect(jsonPath("$[0].status").value("PUBLISHED"));
    }

    private Product product(Category category, String name, ProductStatus status) {
        return Product.builder()
                .sellerId(UUID.randomUUID())
                .category(category)
                .name(name)
                .description("Описание")
                .price(new BigDecimal("10.00"))
                .stock(3)
                .status(status)
                .build();
    }
}
