package com.angularShop.angularShop.config.identity

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.config.annotation.SecurityConfigurerAdapter
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.web.DefaultSecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

class JwtConfig(
        @Autowired private val jwtTokenProvider: JwtTokenProvider
) : SecurityConfigurerAdapter<DefaultSecurityFilterChain, HttpSecurity>() {
    override fun configure(builder: HttpSecurity?) {
        val secureTokenFilter = SecureTokenFilter()
        val jwtTokenFilter = JwtTokenFilter(jwtTokenProvider)
        builder?.addFilterBefore(secureTokenFilter,
                UsernamePasswordAuthenticationFilter::class.java)
        builder?.addFilterBefore(jwtTokenFilter,
                UsernamePasswordAuthenticationFilter::class.java)
    }
}