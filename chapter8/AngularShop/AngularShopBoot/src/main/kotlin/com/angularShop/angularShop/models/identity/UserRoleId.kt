package com.angularShop.angularShop.models.identity

import java.io.Serializable

//UserRole 엔티티의 복합키를 정의
data class UserRoleId(
        var userId: Long = 0,
        var roleId: Long = 0
) : Serializable