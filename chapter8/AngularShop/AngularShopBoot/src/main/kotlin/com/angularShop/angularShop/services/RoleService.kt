package com.angularShop.angularShop.services

import com.angularShop.angularShop.models.identity.Role
import com.angularShop.angularShop.repositories.identity.RoleRepository
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service

@Service
class RoleService (
        private val roleRepository: RoleRepository
) {
    fun getRoles(): MutableList<Role> =
            roleRepository.findAll()

    fun getRoleById(roleId: Long) : ResponseEntity<Role> =
            roleRepository.findById(roleId).map {
                role -> ResponseEntity.ok(role)
            }.orElse(ResponseEntity.notFound().build())

    fun getRoleByName(roleName: String) : Role =
            roleRepository.findByName(roleName)?.let {
                role -> role
            } ?: throw Exception("$roleName not found")
}