package com.example.user_service.repository

import com.example.user_service.entity.Profile
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface ProfileRepository : JpaRepository<Profile, UUID> {
    fun findByUserId(userId: UUID): Profile?
}