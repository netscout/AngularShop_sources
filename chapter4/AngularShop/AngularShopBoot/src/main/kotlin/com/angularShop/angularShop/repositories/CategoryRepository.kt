package com.angularShop.angularShop.repositories

import com.angularShop.angularShop.models.Category
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CategoryRepository : JpaRepository<Category, Long> {
    //이름으로 분류를 찾기
    fun findByName(name: String): Category?
}