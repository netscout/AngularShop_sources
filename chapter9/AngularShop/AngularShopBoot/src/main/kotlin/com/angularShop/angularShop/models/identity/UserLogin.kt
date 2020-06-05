package com.angularShop.angularShop.models.identity

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import java.time.LocalDateTime
import javax.persistence.*

@Entity
//복합키를 정의하는 클래스 설정
@IdClass(UserLoginId::class)
@Table(name = "UserLogins")
data class UserLogin(
        @Id
        var loginProvider: String,
        @Id
        var providerKey: String,

        //UserId가 외래키가 되며, Users테이블의 id와 매핑
        @OneToOne
        @JoinColumn(name="UserId", referencedColumnName = "id")
        var User: User
)