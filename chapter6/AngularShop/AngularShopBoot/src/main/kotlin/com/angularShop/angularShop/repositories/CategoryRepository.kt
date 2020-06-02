package com.angularShop.angularShop.repositories

import com.angularShop.angularShop.models.Category
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface CategoryRepository : JpaRepository<Category, Long> {
    //이름으로 분류를 찾기
    fun findByName(name: String): Category?
    //부모id로 분류 검색
    fun findByParentId(parentId: Long?): List<Category>
    //정렬, 페이징, 그리고 이름으로 분류 검색
    fun findByNameContains(name: String, pageable: Pageable): Page<Category>
    //중복되는 분류 명 검사
    @Query(nativeQuery = true, value = "select count(id) from Categories where name = :fieldValue AND id != :id")
    fun isDupeNameField(id: Long, fieldValue: String): Int
}