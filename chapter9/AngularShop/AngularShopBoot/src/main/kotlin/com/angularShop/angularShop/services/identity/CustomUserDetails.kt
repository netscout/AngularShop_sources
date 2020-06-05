package com.angularShop.angularShop.services.identity

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

class CustomUserDetails(
        var userId: Long?,
        var pwd: String,
        var roles: List<String>,
        var userName: String,
        var email: String
) : UserDetails {
    override fun getAuthorities(): MutableCollection<out GrantedAuthority> {
        return roles.map {
            role -> SimpleGrantedAuthority("ROLE_${role}")
        }.toMutableList()
    }

    fun getId(): Long? = userId

    override fun getPassword(): String = pwd

    override fun getUsername(): String = userName

    override fun isAccountNonExpired(): Boolean = true
    override fun isAccountNonLocked(): Boolean = true
    override fun isCredentialsNonExpired(): Boolean = true
    override fun isEnabled(): Boolean = true
}