package com.example.auth_service.service;

import com.example.auth_service.dto.RegisterRequest;
import com.example.auth_service.dto.UserResponse;
import com.example.auth_service.entity.Role;
import com.example.auth_service.entity.User;
import com.example.auth_service.exception.LoginAlreadyTakenException;
import com.example.auth_service.repository.RoleRepository;
import com.example.auth_service.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String DEFAULT_ROLE = "CUSTOMER";

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByLogin(request.login())) {
            throw new LoginAlreadyTakenException(request.login());
        }

        String passwordHash = passwordEncoder.encode(request.password());

        User user = new User(request.login(), passwordHash);

        Role customerRole = roleRepository.findByName(DEFAULT_ROLE)
                                          .orElseThrow(() -> new IllegalStateException("Role " + DEFAULT_ROLE + " not found in database — check migrations"));

        user.addRole(customerRole);

        User savedUser = userRepository.save(user);

        Set<String> roleNames = savedUser.getRoles()
                                         .stream()
                                         .map(Role::getName)
                                         .collect(Collectors.toSet());

        return new UserResponse(savedUser.getId(), savedUser.getLogin(), roleNames);
    }
}
