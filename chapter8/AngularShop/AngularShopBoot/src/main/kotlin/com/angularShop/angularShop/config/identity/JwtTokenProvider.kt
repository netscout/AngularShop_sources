package com.angularShop.angularShop.config.identity

import com.angularShop.angularShop.services.identity.CustomUserDetailsService
import io.jsonwebtoken.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Component
import java.lang.Exception
import java.util.*
import javax.servlet.http.HttpServletRequest

@Component
class JwtTokenProvider(
        @Qualifier("customUserDetailsService")
        @Autowired private val userDetailsService: CustomUserDetailsService
) {
    private var secretKey: String = "6a5af349-5297-4481-9f18-ec7587162cf5"
    private  val validityInMilliseconds: Long = 31536000000

    fun getValiditySeconds(): Long = validityInMilliseconds / 1000

    fun createToken(email: String, roles: List<String>): String {
        val claims: Claims = Jwts.claims().setSubject(email)
        claims["roles"] = roles

        val validity = Date(Date().time + validityInMilliseconds)

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(Date())
                .setExpiration(validity)
                .signWith(SignatureAlgorithm.HS512, secretKey)
                .compact()
    }

    fun getAuthentication(token: String): Authentication {
        val userDetails: UserDetails = 
            userDetailsService.loadUserByUsername(getUserName(token))
        return UsernamePasswordAuthenticationToken(
            userDetails, 
            "", 
            userDetails.authorities)
    }

    fun getUserName(token: String): String {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .body.subject
    }

    fun resolveToken(req: HttpServletRequest): String? {
        val bearerToken: String? = req.getHeader("Authorization")
        bearerToken?: return null

        if(!bearerToken.startsWith("Bearer ")) return null

        return bearerToken.substring(7, bearerToken.length)
    }

    fun validateToken(token: String): Boolean {
        try {
            val claims:Jws<Claims> = 
                Jwts.parser()
                    .setSigningKey(secretKey)
                    .parseClaimsJws(token)
            if (claims.body.expiration.before(Date())) return false
            return true
        } catch (e: Exception) {
            throw Exception()
        }
    }
}