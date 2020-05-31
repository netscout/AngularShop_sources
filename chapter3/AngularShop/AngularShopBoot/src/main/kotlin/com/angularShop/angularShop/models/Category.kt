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

        @JsonIgnore
        @OneToMany(mappedBy = "parent", cascade = [CascadeType.REMOVE], orphanRemoval = true)
        var children: List<Category>? = null,

        @JsonIgnore
        @OneToMany(mappedBy ="category", fetch = FetchType.LAZY)
        var productCategories: List<ProductCategory>? = null

        //endregion
)