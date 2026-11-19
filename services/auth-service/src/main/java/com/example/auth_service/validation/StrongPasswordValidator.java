package com.example.auth_service.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class StrongPasswordValidator implements ConstraintValidator<StrongPassword, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {

        if (value == null) {
            return true;
        }

        boolean hasSpecSymbol = false;
        boolean hasNumber = false;
        boolean hasLetter = false;

        for (char c : value.toCharArray()) {
            if (Character.isDigit(c)) {
                hasNumber = true;
            } else if (Character.isLetter(c)) {
                hasLetter = true;
            } else {
                hasSpecSymbol = true;
            }
        }

        return hasNumber && hasLetter && hasSpecSymbol;
    }
}
