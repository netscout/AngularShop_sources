package com.angularShop.angularShop.repositories.identity

import com.angularShop.angularShop.models.identity.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface UserRepository: JpaRepository<User, Long> {
    fun findByEmail(email: String): User?
    fun findByUserName(userName: String): User?

    @Query(nativeQuery = true, value = "select count(id) from Users where email = :fieldValue AND id != :id")
    fun isDupeEmailField(id: Long, fieldValue: String): Int
}