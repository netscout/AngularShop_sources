package com.angularShop.angularShop.controllers

import com.angularShop.angularShop.config.identity.JwtTokenProvider
import com.angularShop.angularShop.models.dto.SocialLoginDTO
import com.angularShop.angularShop.models.identity.User
import com.angularShop.angularShop.models.identity.UserLogin
import com.angularShop.angularShop.models.identity.UserLoginId
import com.angularShop.angularShop.repositories.identity.UserLoginRepository
import com.angularShop.angularShop.services.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import java.text.SimpleDateFormat
import java.util.*
import javax.naming.AuthenticationException
import javax.servlet.http.Cookie
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import kotlin.collections.HashMap

@RestController
@RequestMapping("/api/Token")
class TokenController(
        @Autowired private val userService: UserService,
        @Autowired private val authenticationManager: AuthenticationManager,
        @Autowired private val jwtTokenProvider: JwtTokenProvider,
        @Autowired private val userLoginRepository: UserLoginRepository
) {
    @GetMapping("/{id}")
    fun getUserById(@PathVariable(value="id") userId: Long)
            : ResponseEntity<User> =
            userService.getUserById(userId)

    @PostMapping()
    fun login(
            response: HttpServletResponse,
            @RequestBody @Validated req: User
    ): MutableMap<String, Any> {
        try {
            val email = req.email
            val password = req.password
            val authenticator =
                    UsernamePasswordAuthenticationToken(
                        email, 
                        password)
            authenticationManager.authenticate(authenticator)
            val user = userService.getUserByEmail(email)!!

            return return generateToken(
                    response,
                    user.id!!,
                    user.userName!!,
                    user.email,
                    null,
                    user.photoUrl
            )
        }
        catch (e: AuthenticationException) {
            throw BadCredentialsException(
                "invalid userName / password")
        }
    }

    @PostMapping("/CheckSocialLogin")
    fun checkSocialLogin(@RequestBody @Validated req: SocialLoginDTO)
            : MutableMap<String, Any> {
        val model: MutableMap<String, Any> = HashMap()
        model["exist"] = userService.checkSocialLogin(
                req.provider,
                req.providerKey)
        return model
    }

    @PostMapping("/SocialLogin")
    fun socialLogin(
            response: HttpServletResponse,
            @RequestBody @Validated req: SocialLoginDTO)
            : MutableMap<String, Any> {
        try {
            var user: User
            val userLoginPK = UserLoginId(req.provider, req.providerKey)
            val notExist =
                    userLoginRepository.findByIdOrNull(userLoginPK) == null

            if(notExist) {
                //새로 회원 가입 진행
                user = userService.registerUser(User(
                        email = req.email,
                        password = "",
                        userName = req.name,
                        photoUrl = req.photoUrl,
                        UserLogin = null))

                val userLogin = UserLogin(
                        req.provider.toLowerCase(),
                        req.providerKey,
                        user)
                userLoginRepository.save(userLogin)
            }
            else {
                user = userService.getUserByName(req.name)!!
            }

            return generateToken(
                    response,
                    user.id!!,
                    user.userName!!,
                    user.email,
                    req.expires,
                    user.photoUrl
            )
        }
        catch (e: Exception) {
            throw BadCredentialsException("invalid userName / password")
        }
    }

    @DeleteMapping()
    fun logout(
            request:HttpServletRequest,
            response: HttpServletResponse
    ) : MutableMap<String, Any> {
        val cookies = request.cookies
        cookies?.let{
            val tokenCookie = cookies.find { 
                c -> c.name == "kotlin_backend" }
            tokenCookie?.let {
                //토큰에 해당하는 쿠키를 찾았다면, 쿠키를 삭제 처리
                tokenCookie.maxAge = 0
                response.addCookie(tokenCookie)

            } ?: run {
                //토큰에 대항하는 쿠키가 없다면,
                throw BadCredentialsException(
                    "invalid login credential")
            }
        } ?: run {
            //쿠기가 하나도 없다면, 그냥 진행
            throw BadCredentialsException(
                "invalid login credential")
        }

        val model: MutableMap<String, Any> = HashMap()
        model["Result"] = true
        return model
    }

    private fun generateToken(
            response: HttpServletResponse,
            id: Long,
            userName: String,
            email: String,
            expires: Int?,
            photoUrl: String?
    ): MutableMap<String, Any> {
        val roles = userService.getRolesByEmail(email)
        val token = jwtTokenProvider.createToken(email, roles)

        val cookie = Cookie("kotlin_backend", token)
        cookie.maxAge = jwtTokenProvider.getValiditySeconds().toInt()
        cookie.isHttpOnly = true
        response.addCookie(cookie)

        val sdf = SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
        sdf.timeZone = TimeZone.getTimeZone("UTC")

        val expires = expires?.let {_expires ->
            Date().time + (_expires * 1000)
        } ?: run {
            Date().time + 
                (jwtTokenProvider.getValiditySeconds() * 1000)
        }

        val model: MutableMap<String, Any> = HashMap()
        model["name"] = userName
        model["email"] = email
        model["id"] = id
        model["expires"] = "${sdf.format(expires)}z"
        model["roles"] = roles
        model["provider"] = "kotlin_backend"
        model["photoUrl"] = photoUrl!!

        return model
    }
}