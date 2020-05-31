package com.angularShop.angularShop.models

import javax.persistence.*

@Entity
@Table(name = "ProductImages")
data class ProductImage(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        var id: Long? = null,

        var photoUrl: String,

        //현재 테이블의 productId 필드가 외래키로 설정됨
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name="productId")
        var product: Product
)