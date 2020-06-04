package com.angularShop.angularShop.repositories

import com.angularShop.angularShop.models.ProductCategory
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ProductCategoryRepository: JpaRepository<ProductCategory, Long> {
    fun findByProductId(productId: Long): List<ProductCategory>
    fun findByProductIdAndCategoryId(productId: Long, categoryId: Long): ProductCategory?
}