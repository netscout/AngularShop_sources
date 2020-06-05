package com.angularShop.angularShop.models.dto

data class OrderDTO(
        var userId: Long,
        var toName: String,
        var address1: String,
        var address2: String,
        var phone: String,
        var orderItems: List<OrderItemDTO>
)