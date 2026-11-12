package com.example.catalog.exception;

public class ElasticsearchUnavailableException extends RuntimeException {
    public ElasticsearchUnavailableException(Throwable cause) {
        super("Elasticsearch product search is unavailable", cause);
    }
}
