package com.example.auth_service.service;

import com.example.auth_service.config.JwtProperties;
import com.example.auth_service.entity.RefreshToken;
import com.example.auth_service.exception.InvalidRefreshTokenException;
import com.example.auth_service.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final RefreshTokenRepository repository;
    private final JwtProperties props;

    @Transactional
    public String create(UUID userId) {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        String raw = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        repository.save(RefreshToken.builder()
                .userId(userId)
                .tokenHash(hash(raw))
                .expiresAt(Instant.now().plusMillis(props.refreshTokenExpiration()))
                .build());
        return raw;
    }

    @Transactional(noRollbackFor = InvalidRefreshTokenException.class)
    public UUID consume(String rawToken) {
        RefreshToken token = repository.findByTokenHash(hash(rawToken))
                .orElseThrow(InvalidRefreshTokenException::new);

        if (token.isRevoked()) {
            int revoked = repository.revokeAllByUserId(token.getUserId());
            log.warn("Reuse of revoked refresh token detected: userId={}, revokedSessions={}",
                    token.getUserId(), revoked);
            throw new InvalidRefreshTokenException();
        }

        if (repository.revokeIfActive(token.getId(), Instant.now()) == 0) {
            throw new InvalidRefreshTokenException();
        }
        return token.getUserId();
    }

    @Transactional
    public void revoke(String rawToken) {
        repository.findByTokenHash(hash(rawToken))
                .ifPresent(t -> repository.revokeIfActive(t.getId(), Instant.now()));
    }

    @Transactional
    public void revokeAll(UUID userId) {
        repository.revokeAllByUserId(userId);
    }

    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void deleteExpired() {
        int deleted = repository.deleteExpiredBefore(Instant.now());
        log.info("Expired refresh tokens deleted: {}", deleted);
    }

    private static String hash(String raw) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(raw.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 is not available", e);
        }
    }
}
