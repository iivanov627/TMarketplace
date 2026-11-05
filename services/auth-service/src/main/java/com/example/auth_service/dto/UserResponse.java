package com.example.auth_service.dto;

import java.util.Set;
import java.util.UUID;

public record UserResponse(UUID id, String login, Set<String> roles) {
}
