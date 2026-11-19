package com.example.auth_service.dto;

import com.example.auth_service.validation.StrongPassword;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @Schema(example = "user@gmail.com")
        @NotBlank
        @Size(min = 6, max = 100)
        @Email(regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
                message = "login must be a valid email")
        String login,

        @Schema(example = "Password1!")
        @NotBlank
        @Size(min = 8, max = 72)
        @Pattern(regexp = "^[\\x21-\\x7E]+$",
                message = "password may contain only latin letters, digits and special characters")
        @StrongPassword
        String password) {

}
