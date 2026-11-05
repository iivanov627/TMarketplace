package com.example.auth_service.service;

import com.example.auth_service.dto.LoginRequest;
import com.example.auth_service.dto.RegisterRequest;
import com.example.auth_service.dto.TokenResponse;
import com.example.auth_service.dto.UserResponse;
import com.example.auth_service.entity.Role;
import com.example.auth_service.entity.User;
import com.example.auth_service.exception.AccountDisabledException;
import com.example.auth_service.exception.InvalidCredentialsException;
import com.example.auth_service.exception.InvalidRefreshTokenException;
import com.example.auth_service.exception.LoginAlreadyTakenException;
import com.example.auth_service.repository.RoleRepository;
import com.example.auth_service.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private static final String DEFAULT_ROLE = "BUYER";
    private static final int BCRYPT_MAX_BYTES = 72;

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    private String dummyHash;

    @PostConstruct
    void init() {
        dummyHash = passwordEncoder.encode("dummy-password-for-timing");
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (isTooLongForBcrypt(request.password())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Password must not exceed " + BCRYPT_MAX_BYTES + " bytes in UTF-8");
        }
        String login = normalize(request.login());
        if (userRepository.existsByLogin(login)) {
            throw new LoginAlreadyTakenException(login);
        }

        Role role = roleRepository.findByName(DEFAULT_ROLE)
                .orElseThrow(() -> new IllegalStateException(
                        "Role " + DEFAULT_ROLE + " not found in database - check migrations"));

        User user = new User(login, passwordEncoder.encode(request.password()));
        user.addRole(role);

        User saved;
        try {
            saved = userRepository.saveAndFlush(user);
        } catch (DataIntegrityViolationException e) {
            throw new LoginAlreadyTakenException(login);
        }
        log.info("User registered: id={}", saved.getId());
        return toResponse(saved);
    }

    @Transactional
    public TokenResponse login(LoginRequest request) {
        User user = userRepository.findByLogin(normalize(request.login())).orElse(null);

        boolean hasPassword = user != null && user.getPasswordHash() != null;
        String hashToCheck = hasPassword ? user.getPasswordHash() : dummyHash;
        boolean passwordMatches = !isTooLongForBcrypt(request.password())
                && passwordEncoder.matches(request.password(), hashToCheck);

        if (!hasPassword || !passwordMatches) {
            throw new InvalidCredentialsException();
        }

        if (!user.isActive()) {
            throw new AccountDisabledException();
        }
        log.info("User logged in: id={}", user.getId());
        return issueTokens(user);
    }

    @Transactional(noRollbackFor = InvalidRefreshTokenException.class)
    public TokenResponse refresh(String rawRefreshToken) {
        UUID userId = refreshTokenService.consume(rawRefreshToken);

        User user = userRepository.findById(userId).filter(User::isActive).orElse(null);
        if (user == null) {
            refreshTokenService.revokeAll(userId);
            throw new InvalidRefreshTokenException();
        }
        return issueTokens(user);
    }

    @Transactional
    public void logout(String rawRefreshToken) {
        refreshTokenService.revoke(rawRefreshToken);
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(UUID userId) {
        User user = userRepository.findById(userId)
                .filter(User::isActive)
                .orElseThrow(AccountDisabledException::new);
        return toResponse(user);
    }

    private TokenResponse issueTokens(User user) {
        String access = jwtService.generateAccessToken(user);
        String refresh = refreshTokenService.create(user.getId());
        return new TokenResponse(access, refresh, "Bearer", jwtService.accessTokenTtlSeconds());
    }

    private UserResponse toResponse(User user) {
        Set<String> roleNames = user.getRoles().stream().map(Role::getName).collect(Collectors.toSet());
        return new UserResponse(user.getId(), user.getLogin(), roleNames);
    }

    private static String normalize(String login) {
        return login.trim().toLowerCase(Locale.ROOT);
    }

    private static boolean isTooLongForBcrypt(String password) {
        return password.getBytes(StandardCharsets.UTF_8).length > BCRYPT_MAX_BYTES;
    }
}
