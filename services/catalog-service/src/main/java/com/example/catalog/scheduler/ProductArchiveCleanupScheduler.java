package com.example.catalog.scheduler;

import com.example.catalog.entity.Product;
import com.example.catalog.entity.ProductStatus;
import com.example.catalog.repository.ProductRepository;
import com.example.catalog.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ProductArchiveCleanupScheduler {

    private final ProductRepository productRepository;
    private final ProductService productService;

    @Scheduled(cron = "0 0 3 * * *")
    public void deleteExpiredArchivedProducts() {
        LocalDateTime expirationDate = LocalDateTime.now().minusDays(30);

        List<Product> expiredProducts =
                productRepository.findAllByStatusAndArchivedAtBefore(
                        ProductStatus.ARCHIVED,
                        expirationDate
                );

        for (Product product : expiredProducts) {
            try {
                productService.deleteExpiredArchivedProduct(product.getId());
            } catch (Exception exception) {
                log.error(
                        "Failed to delete expired archived product: {}",
                        product.getId(),
                        exception
                );
            }
        }

        log.info("Expired archived products processed: {}", expiredProducts.size());
    }
}