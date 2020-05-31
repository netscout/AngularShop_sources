package com.angularShop.angularShop.controllers

import com.angularShop.angularShop.models.Product
import com.angularShop.angularShop.repositories.ProductRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/Products")
class ProductsController(
        @Autowired private val productRepository: ProductRepository
) {
    @GetMapping()
    fun getProducts() : ResponseEntity<List<Product>> {
        return ResponseEntity.ok(productRepository.findAll())
    }
}