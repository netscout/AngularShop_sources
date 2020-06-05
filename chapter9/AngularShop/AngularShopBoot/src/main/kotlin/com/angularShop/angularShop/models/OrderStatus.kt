package com.angularShop.angularShop.models

import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(name = "OrderStatuses")
data class OrderStatus(
        @Id
        var id: Int,

        var name: String
)