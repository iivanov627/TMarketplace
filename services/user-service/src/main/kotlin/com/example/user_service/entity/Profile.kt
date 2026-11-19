package com.example.user_service.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "profiles")
class Profile(@Column(name = "user_id") val userId: UUID) {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null
    var lastName: String? = null
    var firstName: String? = null
    var middleName: String? = null

    @Column(insertable = false, updatable = false)
    var createdAt: Instant? = null
        protected set

}