package com.angularShop.angularShop.models

import com.fasterxml.jackson.annotation.JsonIdentityInfo
import com.fasterxml.jackson.annotation.ObjectIdGenerators
import javax.persistence.*

@Entity
@Table(name = "ProductCategories")
//중복해서 생성되는 걸 막아준다. 그런데 중복해서 나와야 하는 항목에는 사용하면 안됨.
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator::class, property = "id")
data class ProductCategory(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        var id: Long? = null,

        var sortOrder: Int,

        //현재 테이블의 productId 속성을 외래키로 사용
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name="productId")
        var product: Product,

        //현재 테이블의 categoryId 속성을 외래키로 사용
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name="categoryId")
        var category: Category
)