package com.angularShop.angularShop.repositories

import com.angularShop.angularShop.models.Product
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ProductRepository : JpaRepository<Product, Long> {
    //이름으로 제품을 찾기
    fun findByName(name: String): Product?
}