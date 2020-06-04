package com.angularShop.angularShop.services.identity

import com.angularShop.angularShop.models.identity.User
import com.angularShop.angularShop.repositories.identity.UserRepository
import com.angularShop.angularShop.repositories.identity.UserRoleRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class CustomUserDetailsService(
        @Autowired private val userRepository: UserRepository,
        @Autowired private val userRoleRepository: UserRoleRepository
) : UserDetailsService {
    override fun loadUserByUsername(email: String): UserDetails {
        //val user: User? = userRepository.findByUserName(username)
        val user: User? = userRepository.findByEmail(email)
        user?: throw UsernameNotFoundException("$email not found")

        val roleNames = userRoleRepository.findByUserId(user.id!!)?.map { userRole ->
            userRole.role!!.name
        }?: throw UsernameNotFoundException("$email has no role")

        return CustomUserDetails(
                user.id,
                user.password,
                roleNames,
                user.userName!!,
                email
        )
    }
}