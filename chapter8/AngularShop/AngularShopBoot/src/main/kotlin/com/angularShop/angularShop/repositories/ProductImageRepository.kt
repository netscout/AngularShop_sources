package com.angularShop.angularShop.repositories

import com.angularShop.angularShop.models.ProductImage
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ProductImageRepository: JpaRepository<ProductImage, Long> {
    fun findByProductId(productId: Long): List<ProductImage>
    fun findByPhotoUrl(photoUrl: String): ProductImage?
}