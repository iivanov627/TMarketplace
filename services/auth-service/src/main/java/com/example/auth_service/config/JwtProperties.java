package com.example.auth_service.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.validation.annotation.Validated;

/**
 * @param secret
 * @param accessTokenExpiration
 * @param refreshTokenExpiration
 */
@Validated
@ConfigurationProperties(prefix = "jwt")
public record JwtProperties(
        @NotBlank String secret,
        @Positive long accessTokenExpiration,
        @Positive long refreshTokenExpiration,
        @DefaultValue("auth-service") String issuer) {
}
