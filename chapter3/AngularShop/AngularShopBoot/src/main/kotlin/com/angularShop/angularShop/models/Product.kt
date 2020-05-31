package com.angularShop.angularShop.models

import com.fasterxml.jackson.annotation.JsonIdentityInfo
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.ObjectIdGenerators
import java.math.BigDecimal
import javax.persistence.*

@Entity
@Table(name = "Products")
//중복해서 생성되는 걸 막아준다. 그런데 중복해서 나와야 하는 항목에는 사용하면 안됨.
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator::class, property = "id")
data class Product(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        var id: Long? = null,

        var name: String,

        @Lob
        var description: String,

        var tags: String,

        var price: BigDecimal,

        var discount: Int? = null,

        var stockCount: Int,

        var isVisible: Boolean,

        //제조 회사 번호(왜래키, 읽기 전용)
        @Column(insertable = false, updatable = false)
        var makerId: Long? = null,

        //region 네비게이션 속성

        //제조 회사
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "makerId")
        var maker: Maker? = null,

        @JsonIgnore
        //ProductCategory테이블의 product속성과 매핑
        @OneToMany(mappedBy ="product", fetch = FetchType.LAZY)
        var productCategories: List<ProductCategory>? = null,

        //ProductImage테이블의 product속성과 매핑
        @OneToMany(mappedBy="product", fetch = FetchType.LAZY)
        var productImages: MutableList<ProductImage>? = null,

        //endregion

        //region 모델에서만 존재하는 속성

        //Transient로 설정된 속성은 DB에 매핑되지 않고 모델 클래스에만 존재
        @Transient
        @JsonIgnore
        var _categories: List<Category>? = null

        //endregion
) {
        fun getCategories() : List<Category> {
                return productCategories?.map {
                        pc -> pc.category
                } ?: run {
                        listOf<Category>()
                }
        }
        fun setCategories(value: List<Category>) {
                this._categories = value
        }
}