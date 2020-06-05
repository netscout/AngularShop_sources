package com.angularShop.angularShop.controllers

import com.angularShop.angularShop.models.identity.User
import com.angularShop.angularShop.models.identity.UserRole
import com.angularShop.angularShop.services.RoleService
import com.angularShop.angularShop.services.UserRoleService
import com.angularShop.angularShop.services.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/Account")
class AccountController(
        @Autowired private val userService: UserService,
        @Autowired private val roleService: RoleService,
        @Autowired private val userRoleService: UserRoleService
) {
    @PostMapping()
    fun addUser(@Validated @RequestBody user: User)
            : ResponseEntity<MutableMap<String, Any>> {
        val user = userService.registerUser(user)

        val model: MutableMap<String, Any> = HashMap()
        model["email"] = user.email
        model["name"] = user.userName!!

        return ResponseEntity.ok(model)
    }

    @PostMapping("/IsDupeField")
    fun isDupeField(
            id: Long,
            fieldName: String,
            fieldValue: String) : Boolean {
        if(fieldName == "email") {
            return userService.isDupeEmailField(id, fieldValue)
        }
        return false
    }
}