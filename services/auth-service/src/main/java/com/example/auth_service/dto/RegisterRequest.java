package com.example.auth_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank
        @Size(min = 4, max = 100)
        @Pattern(regexp = "^\\S+$", message = "login must not contain whitespace")
        String login,

        @NotBlank
        @Size(min = 8, max = 72)
        @Pattern(regexp = "^[\\x21-\\x7E]+$",
                message = "password may contain only latin letters, digits and special characters")
        String password) {
}
