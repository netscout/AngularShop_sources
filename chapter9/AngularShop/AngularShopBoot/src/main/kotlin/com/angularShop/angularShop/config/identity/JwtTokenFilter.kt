package com.angularShop.angularShop.config.identity

import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.filter.GenericFilterBean
import java.lang.Exception
import javax.servlet.FilterChain
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse
import javax.servlet.http.HttpServletRequest

class JwtTokenFilter(
        private val jwtTokenProvider: JwtTokenProvider
) : GenericFilterBean() {
    override fun doFilter(
            request: ServletRequest?,
            response: ServletResponse?,
            chain: FilterChain?) {
        request ?: throw Exception()
        val token: String? =
                jwtTokenProvider.resolveToken(
                    request as HttpServletRequest)

        token?.let {
            if(jwtTokenProvider.validateToken(token)) {
                val auth: Authentication = 
                    jwtTokenProvider.getAuthentication(token)
                SecurityContextHolder
                    .getContext()
                        .authentication = auth
            }
        }

        chain?.doFilter(request, response)
    }
}