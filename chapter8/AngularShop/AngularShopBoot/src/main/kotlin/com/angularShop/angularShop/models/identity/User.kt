package com.angularShop.angularShop.models.identity

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "Users")
data class User(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        var id: Long? = null,
        var email: String,
        var password: String,

        var userName: String? = null,
        var photoUrl: String? = null,

        @JsonIgnore
        @OneToOne(mappedBy = "User")
        var UserLogin: UserLogin? = null
)