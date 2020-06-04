package com.angularShop.angularShop.models.identity

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import java.time.LocalDateTime
import javax.persistence.*

@Entity
//복합키를 정의하는 클래스 설정
@IdClass(UserRoleId::class)
@Table(name = "UserRoles")
data class UserRole(
        @Id
        var userId: Long,
        @Id
        var roleId: Long,

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "userId", updatable = false, insertable = false)
        var user: User? = null,

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "roleId", updatable = false, insertable = false)
        var role: Role? = null
)