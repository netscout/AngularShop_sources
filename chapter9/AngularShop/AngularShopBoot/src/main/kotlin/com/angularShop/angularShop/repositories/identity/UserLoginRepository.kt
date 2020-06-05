package com.angularShop.angularShop.repositories.identity

import com.angularShop.angularShop.models.identity.UserLogin
import com.angularShop.angularShop.models.identity.UserLoginId
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserLoginRepository: JpaRepository<UserLogin, UserLoginId> {
}