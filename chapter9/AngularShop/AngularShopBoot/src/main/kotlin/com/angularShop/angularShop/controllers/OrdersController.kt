package com.angularShop.angularShop.controllers

import com.angularShop.angularShop.models.Category
import com.angularShop.angularShop.models.Order
import com.angularShop.angularShop.models.OrderItem
import com.angularShop.angularShop.models.Product
import com.angularShop.angularShop.models.dto.ApiResult
import com.angularShop.angularShop.models.dto.OrderDTO
import com.angularShop.angularShop.models.enum.OrderStatuses
import com.angularShop.angularShop.models.identity.User
import com.angularShop.angularShop.repositories.OrderRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import java.math.BigDecimal
import java.math.RoundingMode
import javax.persistence.EntityManager
import javax.transaction.Transactional

@RestController
@RequestMapping("/api/Orders")
class OrdersController(
        @Autowired private val orderRepository: OrderRepository,
        @Autowired private var entityManager: EntityManager
) {
    @GetMapping()
    fun getOrders(
            @RequestParam(defaultValue = "0") pageIndex: Int,
            @RequestParam(defaultValue = "10") pageSize: Int,
            @RequestParam(required = false, defaultValue = "id") 
                sortColumn: String,
            @RequestParam(required = false, defaultValue = "desc") 
                sortOrder: String,
            @RequestParam(required = false) filterColumn: String?,
            @RequestParam(required = false) filterQuery: String?)
            : ResponseEntity<ApiResult<Order>> {

        val sort =
                if(sortOrder.toLowerCase() == "desc")
                    Sort.by(sortColumn).descending()
                else
                    Sort.by(sortColumn).ascending()

        var pageReq = PageRequest.of(pageIndex, pageSize, sort)

        val result = filterQuery?.let {
            orderRepository.findByToNameContains(filterQuery, pageReq)
        } ?: run {
            orderRepository.findAll(pageReq)
        }

        return ResponseEntity.ok(
                ApiResult<Order>(
                        data = result.content,
                        pageIndex = pageIndex,
                        pageSize = pageSize,
                        totalCount = result.totalElements,
                        totalPages = result.totalPages
                ))
    }

    @GetMapping("/{id}")
    fun getOrder(@PathVariable(value="id") orderId: Long) 
    : ResponseEntity<Order> {
        return orderRepository.findById(orderId).map {
            order -> ResponseEntity.ok(order)
        }.orElse(ResponseEntity.notFound().build())
    }

    @Transactional
    @PostMapping()
    fun newOrder(@RequestBody @Validated req: OrderDTO)
    : ResponseEntity<MutableMap<String, Any>> {
        val user = entityManager.find(User::class.java, req.userId) 
            ?: return ResponseEntity.badRequest().build()

        val order = Order(
                toName = req.toName,
                address1 = req.address1,
                address2 = req.address2,
                phone = req.phone,
                totalPrice = BigDecimal(0),
                user = user,
                orderStatusId = OrderStatuses.Pending.value
        )

        entityManager.persist(order)

        var totalPrice = BigDecimal(0)

        for (oi in req.orderItems) {
            val product = entityManager.find(
                Product::class.java, 
                oi.productId)

            if(product == null || oi.qty > product.stockCount) {
                return ResponseEntity.badRequest().build()
            }

            val Big100 = 100.toBigDecimal()
            //할인 가격
            val discountAmount = 
                product.price * product.discount!!.toBigDecimal() / Big100
            //할인된 가격을 구한 뒤 둘째 자리 까지 계산
            var price =  ((product.price - discountAmount) * Big100)
                    .setScale(2, RoundingMode.FLOOR) / Big100
            totalPrice += price
            //재고 감소
            product.stockCount -= oi.qty

            val orderItem = OrderItem(
                    price = price,
                    product = product,
                    order = order,
                    qty = oi.qty
            )

            entityManager.persist(orderItem)
            entityManager.merge(product)
        }

        order.totalPrice = totalPrice

        entityManager.merge(order)

        var result: MutableMap<String, Any> = HashMap()
        result["id"] = order.id!!

        return ResponseEntity.ok(result)
    }

    @Transactional
    @PutMapping("/{id}")
    fun updateOrder(
        @PathVariable(value="id") id: Long,
        @RequestBody @Validated req: Order
        ): ResponseEntity<MutableMap<String, Any>> {
        if (id != req.id) {
            return ResponseEntity.badRequest().build()
        }

        val order = entityManager.find(Order::class.java, id)
        order.toName = req.toName
        order.address1 = req.address1
        order.address2 = req.address2
        order.phone = req.phone
        order.orderStatusId = req.orderStatusId

        entityManager.merge(order)

        var result: MutableMap<String, Any> = HashMap()
        result["id"] = order.id!!

        return ResponseEntity.ok(result)
    }
}