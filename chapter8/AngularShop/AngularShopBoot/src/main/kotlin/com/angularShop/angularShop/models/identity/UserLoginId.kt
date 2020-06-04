package com.angularShop.angularShop.models.identity

import java.io.Serializable

//UserLogin 엔티티의 복합키를 정의
data class UserLoginId(
        var loginProvider: String = "",
        var providerKey: String = ""
) : Serializable