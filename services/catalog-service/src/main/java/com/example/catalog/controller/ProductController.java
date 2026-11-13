package com.example.catalog.controller;

import com.example.catalog.dto.ProductResponse;
import com.example.catalog.dto.ProductDraftRequest;
import com.example.catalog.dto.ProductInventoryUpdateRequest;
import com.example.catalog.service.ProductService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.server.ResponseStatusException;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Товары", description = "Публичный каталог товаров")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Список опубликованных товаров")
    public List<ProductResponse> getPublishedProducts(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        return productService.getPublishedProducts(q, categoryId, minPrice, maxPrice);
    }

    @PostMapping("/drafts")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Создать черновик товара")
    @SecurityRequirement(name = "bearerAuth")
    public ProductResponse createDraft(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody ProductDraftRequest request) {
        boolean admin = isAdmin(jwt);
        UUID sellerId = admin ? request.sellerId() : currentUserId(jwt);
        if (!admin && !sellerId.equals(request.sellerId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Seller can create products only for their own account");
        }
        ProductDraftRequest ownedRequest = new ProductDraftRequest(sellerId, request.categoryId(), request.name(),
                request.description(), request.price(), request.stock());
        return productService.createDraft(ownedRequest);
    }

    @PutMapping("/{productId}/draft")
    @Operation(summary = "Изменить черновик товара")
    @SecurityRequirement(name = "bearerAuth")
    public ProductResponse updateDraft(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID productId,
            @Valid @RequestBody ProductDraftRequest request) {
        boolean admin = isAdmin(jwt);
        UUID sellerId = admin ? null : currentUserId(jwt);
        return productService.updateDraft(productId, sellerId, admin, request);
    }

    @PatchMapping("/{productId}/price-stock")
    @Operation(summary = "Изменить цену и остаток черновика")
    @SecurityRequirement(name = "bearerAuth")
    public ProductResponse updatePriceAndStock(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID productId,
            @Valid @RequestBody ProductInventoryUpdateRequest request) {
        boolean admin = isAdmin(jwt);
        UUID sellerId = admin ? null : currentUserId(jwt);
        return productService.updatePriceAndStock(productId, sellerId, admin, request);
    }

    @PostMapping("/{productId}/submit-for-moderation")
    @Operation(summary = "Отправить черновик на модерацию")
    @SecurityRequirement(name = "bearerAuth")
    public ProductResponse submitForModeration(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID productId) {
        boolean admin = isAdmin(jwt);
        UUID sellerId = admin ? null : currentUserId(jwt);
        return productService.submitForModeration(productId, sellerId, admin);
    }

    @PostMapping("/{productId}/reject")
    @Operation(summary = "Отклонить товар")
    @SecurityRequirement(name = "bearerAuth")
    public ProductResponse rejectProduct(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID productId) {
        boolean admin = isAdmin(jwt);
        if (!admin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can reject products");
        }
        return productService.rejectProduct(productId);
    }

    @PatchMapping("/{productId}/archive")
    @Operation(summary = "Отправить товар в архив")
    @SecurityRequirement(name = "bearerAuth")
    public ProductResponse archiveProduct(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID productId) {
        boolean admin = isAdmin(jwt);
        UUID sellerId = admin ? null : currentUserId(jwt);
        return productService.archiveProduct(productId, sellerId, admin);
    }

    @PatchMapping("/{productId}/unarchive")
    @Operation(summary = "Восстановить товар из архива")
    @SecurityRequirement(name = "bearerAuth")
    public ProductResponse unarchiveProduct(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID productId) {
        boolean admin = isAdmin(jwt);
        UUID sellerId = admin ? null : currentUserId(jwt);
        return productService.unarchiveProduct(productId, sellerId, admin);
    }

    @PatchMapping("/{productId}/hide")
    @Operation(summary = "Скрыть опубликованный товар")
    @SecurityRequirement(name = "bearerAuth")
    public ProductResponse hideProduct(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID productId) {
        boolean admin = isAdmin(jwt);
        UUID sellerId = admin ? null : currentUserId(jwt);
        return productService.hideProduct(productId, sellerId, admin);
    }

    @PatchMapping("/{productId}/unhide")
    @Operation(summary = "Вернуть скрытый товар в публикацию")
    @SecurityRequirement(name = "bearerAuth")
    public ProductResponse unhideProduct(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID productId) {
        boolean admin = isAdmin(jwt);
        UUID sellerId = admin ? null : currentUserId(jwt);
        return productService.unhideProduct(productId, sellerId, admin);
    }

    @DeleteMapping("/{productId}")
    @Operation(summary = "Удалить товар навсегда")
    @SecurityRequirement(name = "bearerAuth")
    public ProductResponse deleteProduct(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID productId) {
        boolean admin = isAdmin(jwt);
        UUID sellerId = admin ? null : currentUserId(jwt);
        return productService.deleteProduct(productId, sellerId, admin);
    }

    @GetMapping("/health")
    public String health() {
        return "catalog-service is running";
    }

    private boolean isAdmin(Jwt jwt) {
        return jwt.getClaimAsStringList("roles") != null
                && jwt.getClaimAsStringList("roles").contains("ADMIN");
    }

    private UUID currentUserId(Jwt jwt) {
        String id = jwt.getClaimAsString("userId");
        if (id == null || id.isBlank()) {
            id = jwt.getSubject();
        }
        try {
            return UUID.fromString(id);
        } catch (IllegalArgumentException | NullPointerException exception) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "JWT must contain a UUID userId claim or UUID subject");
        }
    }
}
