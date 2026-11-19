package com.example.auth_service.dto;

/**
 * @param expiresIn
 */
public record TokenResponse(String accessToken, String refreshToken, String tokenType, long expiresIn) {
}
