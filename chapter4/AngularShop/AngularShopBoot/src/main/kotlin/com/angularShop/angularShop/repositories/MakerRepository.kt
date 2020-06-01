package com.angularShop.angularShop.repositories

import com.angularShop.angularShop.models.Maker
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MakerRepository : JpaRepository<Maker, Long> {
    //이름으로 제조 회사를 찾기
    fun findByName(name: String): Maker?
}