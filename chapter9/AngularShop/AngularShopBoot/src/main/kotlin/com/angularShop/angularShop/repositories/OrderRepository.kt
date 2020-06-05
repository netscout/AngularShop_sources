package com.angularShop.angularShop.repositories

import com.angularShop.angularShop.models.Order
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface OrderRepository: JpaRepository<Order, Long> {
    fun findByToName(toName: String): Order?
    fun findByToNameContains(toName: String, pageable: Pageable): Page<Order>
}