package com.angularShop.angularShop.models

import com.fasterxml.jackson.annotation.JsonIgnore
import javax.persistence.*

@Entity
@Table(name = "Categories")
data class Category(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        var id: Long? = null,

        var name: String,

        @Column(insertable = false, updatable = false)
        var parentId: Long? = null,

        //region 네비게이션 속성

        @JsonIgnore
        @ManyToOne
        @JoinColumn(name="parentId")
        var parent: Category? = null,

        @OneToMany(mappedBy = "parent", cascade = [CascadeType.REMOVE], orphanRemoval = true)
        var children: List<Category>? = null,

        @JsonIgnore
        @OneToMany(mappedBy ="category", fetch = FetchType.LAZY)
        var productCategories: List<ProductCategory>? = null,

        //endregion

        //region 모델에서만 존재하는 속성

        //Transient로 설정된 속성은 DB에 매핑되지 않고 모델 클래스에만 존재
        @Transient
        @JsonIgnore
        var _totalProducts: Int? = null

        //endregion
) {
        fun getTotalProducts() : Int {
                return productCategories?.count() ?: 0
        }
        fun setTotalProducts(value: Int) {
                this._totalProducts = value
        }
}