package com.angularShop.angularShop.repositories.identity

import com.angularShop.angularShop.models.identity.Role
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface RoleRepository: JpaRepository<Role, Long> {
    fun findByName(roleName: String): Role?
}