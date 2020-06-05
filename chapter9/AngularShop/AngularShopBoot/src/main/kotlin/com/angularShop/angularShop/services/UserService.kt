package com.angularShop.angularShop.services

import com.angularShop.angularShop.models.identity.User
import com.angularShop.angularShop.models.identity.UserLoginId
import com.angularShop.angularShop.models.identity.UserRole
import com.angularShop.angularShop.repositories.identity.UserLoginRepository
import com.angularShop.angularShop.repositories.identity.UserRepository
import com.angularShop.angularShop.repositories.identity.UserRoleRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.ResponseEntity
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service

@Service
class UserService (
        private val userRepository: UserRepository,
        private val userRoleRepository: UserRoleRepository,
        private val userLoginRepository: UserLoginRepository,
        private val roleService: RoleService,
        private val userRoleService: UserRoleService,
        private val bCryptPasswordEncoder: BCryptPasswordEncoder
) {
    fun getUsers(): List<User> =
            userRepository.findAll()

    fun addUser(user: User) : User {
        user.password = bCryptPasswordEncoder.encode(user.password)
        return userRepository.save(user)
    }

    fun getUserById(userId: Long) : ResponseEntity<User> =
            userRepository.findById(userId).map {
                User -> ResponseEntity.ok(User)
            }.orElse(ResponseEntity.notFound().build())

    fun getUserByName(userName: String) : User? =
            userRepository.findByUserName(userName)

    fun getUserByEmail(email: String) : User? =
            userRepository.findByEmail(email)

    fun getRolesByEmail(email: String) : List<String> {
        val user: User? = userRepository.findByEmail(email)
        user?: throw UsernameNotFoundException("$email not found")

        return userRoleRepository.findByUserId(user.id!!)?.map {
            userRole -> userRole.role!!.name
        } ?: throw Exception("user has no role")
    }

    fun isDupeEmailField(id: Long, fieldValue: String) : Boolean {
        val count = userRepository.isDupeEmailField(id, fieldValue)
        return count > 0
    }

    //새 사용자 등록
    fun registerUser(user: User): User {
        //사용자 이름이 설정되지 않았다면
        user.userName ?: run {
            //이메일에서 자동으로 사용자 이름 생성
            var userName = user.email.split("@")[0]
            //사용자 이름 중복시 랜덤한 숫자를 붙임
            if(getUserByName(userName) != null) {
                val randNum = (0..999999).random()
                userName = "${userName}${randNum}"
            }
            user.userName = userName
        }
        //사용자 프로필 이미지가 설정되지 않았다면
        user.photoUrl ?: run {
            //기본 사용자 프로필 사진
            user.photoUrl = "images/profiles/default_profile.png"
        }

        val user = addUser(user)
        val role = roleService.getRoleByName("USER")
        //기본으로 사용자 역할 추가
        userRoleService.addUserRole(UserRole(
                user.id!!,
                role.id!!,
                user,
                role))

        return user
    }

    fun checkSocialLogin(provider: String, providerKey: String): Boolean {
        return userLoginRepository
                .findByIdOrNull(
                        UserLoginId(
                                provider.toLowerCase(),
                                providerKey)) != null
    }
}