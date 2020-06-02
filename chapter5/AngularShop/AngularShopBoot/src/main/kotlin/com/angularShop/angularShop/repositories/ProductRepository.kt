package com.angularShop.angularShop.repositories

import com.angularShop.angularShop.models.Product
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ProductRepository : JpaRepository<Product, Long> {
    //이름으로 제품을 찾기
    fun findByName(name: String): Product?
    //정렬, 페이징, 그리고 이름으로 제품 검색
    fun findByNameContains(name: String, pageable: Pageable): Page<Product>
}