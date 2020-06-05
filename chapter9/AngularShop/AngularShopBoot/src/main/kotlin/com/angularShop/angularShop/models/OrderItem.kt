package com.angularShop.angularShop.models

import com.fasterxml.jackson.annotation.JsonIdentityInfo
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.ObjectIdGenerators
import java.math.BigDecimal
import javax.persistence.*

@Entity
@Table(name = "OrderItems")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator::class, property = "id")
data class OrderItem(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        var id: Long? = null,

        var qty: Int,

        var price: BigDecimal,

        @Column(insertable = false, updatable = false)
        var productId: Long? = null,

        @Column(insertable = false, updatable = false)
        var orderId: Long? = null,

        @JsonIgnore
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "productId")
        var product: Product? = null,

        @JsonIgnore
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "orderId")
        var order: Order? = null
) {
    fun getProductName() : String? {
        return product?.name ?: null
    }
}