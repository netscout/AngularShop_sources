package com.angularShop.angularShop.controllers

import com.angularShop.angularShop.models.Product
import com.angularShop.angularShop.models.dto.ApiResult
import com.angularShop.angularShop.repositories.ProductRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/Products")
class ProductsController(
        @Autowired private val productRepository: ProductRepository
) {
    @GetMapping()
    fun getProducts(
            @RequestParam(defaultValue = "0") pageIndex: Int,
            @RequestParam(defaultValue = "10") pageSize: Int,
            @RequestParam(required = false, defaultValue = "id") sortColumn: String,
            @RequestParam(required = false, defaultValue = "desc") sortOrder: String,
            @RequestParam(required = false) filterColumn: String?,
            @RequestParam(required = false) filterQuery: String?
    ) : ResponseEntity<ApiResult<Product>> {
        //정렬 설정에 따라 정렬 객체 생성
        val sort =
                if(sortOrder.toLowerCase() == "desc")
                    Sort.by(sortColumn).descending()
                else
                    Sort.by(sortColumn).ascending()

        //페이징 정보과 정렬 값으로 페이징 객체 생성
        val pageReq: Pageable = PageRequest.of(pageIndex, pageSize, sort)

        //검색 값이 존재한다면
        val result = filterQuery?.let {
            //이름과 정렬값, 페이징 정보로 검색
            productRepository.findByNameContains(filterQuery, pageReq)
        } ?: run {
            //검색 값이 없다면,
            //전체 데이터에 대해 정렬 및 페이징 정보로 조회
            productRepository.findAll(pageReq)
        }

        return ResponseEntity.ok(
                ApiResult<Product>(
                    data = result.content,
                    pageIndex = pageIndex,
                    pageSize = pageSize,
                    totalCount = result.totalElements,
                    totalPages = result.totalPages
        ))
    }
}
