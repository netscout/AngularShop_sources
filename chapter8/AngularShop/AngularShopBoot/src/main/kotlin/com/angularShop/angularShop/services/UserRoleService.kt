package com.angularShop.angularShop.services

import com.angularShop.angularShop.models.identity.UserRole
import com.angularShop.angularShop.repositories.identity.UserRoleRepository
import org.springframework.stereotype.Service

@Service
class UserRoleService (
        private val userRoleRepository: UserRoleRepository
) {
    fun getUserRoles(): MutableList<UserRole> =
            userRoleRepository.findAll()

    fun addUserRole(userRole: UserRole) : Boolean {
        return userRoleRepository.save(userRole) != null
    }
}