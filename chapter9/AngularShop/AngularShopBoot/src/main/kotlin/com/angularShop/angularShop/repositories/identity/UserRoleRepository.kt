package com.angularShop.angularShop.repositories.identity

import com.angularShop.angularShop.models.identity.UserRole
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRoleRepository: JpaRepository<UserRole, Long> {
    fun findByUserId(userId: Long): List<UserRole>?
    fun findByRoleId(roleId: Long): List<UserRole>?
}