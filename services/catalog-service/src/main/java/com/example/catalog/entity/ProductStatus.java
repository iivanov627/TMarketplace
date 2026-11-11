package com.example.catalog.entity;

public enum ProductStatus {

    DRAFT("00000000-0000-0000-0000-000000000001"),
    PENDING_MODERATION("00000000-0000-0000-0000-000000000002"),
    PUBLISHED("00000000-0000-0000-0000-000000000003"),
    REJECTED("00000000-0000-0000-0000-000000000004"),
    ARCHIVED("00000000-0000-0000-0000-000000000005");

    private final java.util.UUID id;

    ProductStatus(String id) {
        this.id = java.util.UUID.fromString(id);
    }

    public java.util.UUID id() {
        return id;
    }

    public static ProductStatus fromId(java.util.UUID id) {
        for (ProductStatus status : values()) {
            if (status.id.equals(id)) return status;
        }
        throw new IllegalArgumentException("Unknown product status id: " + id);
    }
}
