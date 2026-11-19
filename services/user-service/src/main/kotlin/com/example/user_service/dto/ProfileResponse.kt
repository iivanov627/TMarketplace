package com.example.user_service.dto

import com.example.user_service.entity.Profile
import java.util.UUID

data class ProfileResponse(
    val userId: UUID,
    val lastName: String?,
    val firstName: String?,
    val middleName: String?,
)

fun Profile.toResponse(): ProfileResponse = ProfileResponse(
    userId = this.userId,
    lastName = this.lastName,
    firstName = this.firstName,
    middleName = this.middleName
)