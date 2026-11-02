package com.example.auth_service.dto;

import java.util.Set;

public record UserResponse(Long id, String login, Set<String> roles) {
}
