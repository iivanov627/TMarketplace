package com.example.user_service.controller

import com.example.user_service.dto.ProfileResponse
import com.example.user_service.dto.toResponse
import com.example.user_service.service.ProfileService
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/user")
class ProfileController(
    private val profileService: ProfileService,
) {

    @GetMapping("/me")
    fun me(@AuthenticationPrincipal jwt: Jwt): ProfileResponse {
        return profileService.getOrCreate(UUID.fromString(jwt.subject)).toResponse()
    }
}