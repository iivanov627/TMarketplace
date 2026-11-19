package com.example.user_service.service

import com.example.user_service.entity.Profile
import com.example.user_service.repository.ProfileRepository
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class ProfileService(private val profileRepository: ProfileRepository) {
    fun getOrCreate(userId: UUID): Profile {
        return try {
            profileRepository.findByUserId(userId) ?: profileRepository.save(Profile(userId))
        } catch (e: DataIntegrityViolationException) {
            profileRepository.findByUserId(userId) ?: throw IllegalStateException("Profile for user $userId not found after unique constraint violation")
        }
    }
}