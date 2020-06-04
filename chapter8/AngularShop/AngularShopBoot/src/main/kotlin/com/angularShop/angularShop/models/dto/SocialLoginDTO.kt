package com.angularShop.angularShop.models.dto

data class SocialLoginDTO(
        var name: String,
        var providerKey: String,
        var email: String,
        var photoUrl: String,
        var provider: String,
        var expires: Int?
)