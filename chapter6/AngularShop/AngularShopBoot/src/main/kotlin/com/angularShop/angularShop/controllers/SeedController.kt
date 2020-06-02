package com.angularShop.angularShop.controllers

import com.angularShop.angularShop.models.*
import com.angularShop.angularShop.repositories.CategoryRepository
import com.angularShop.angularShop.repositories.MakerRepository
import com.angularShop.angularShop.repositories.ProductRepository
import com.angularShop.angularShop.services.SeedService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.math.BigDecimal
import javax.persistence.EntityManager
import javax.transaction.Transactional

@RestController
@RequestMapping("/api/Seed")
class SeedController(
        @Autowired private var makerRepository: MakerRepository,
        @Autowired private var productRepository: ProductRepository,
        @Autowired private var categoryRepository: CategoryRepository,
        @Autowired private var entityManager: EntityManager
) {
    @Transactional
    @GetMapping("/GenerateProducts")
    fun generateProducts() : ResponseEntity<MutableMap<String, Any>> {
        //제조 회사 데이터 정의
        var maker1 = Maker(name = "모바일 메이커1")
        var maker2 = Maker(name = "기타 메이커2")

        //제품 분류 정의
        var root_electric = Category(
                name = "전자제품",
                parent = null
        )
        var middle_mobile = Category(
                name = "모바일",
                parent = root_electric
        )
        var middle_etc = Category(
                name = "기타",
                parent = root_electric
        )
        var middle_onsale = Category(
                name = "세일",
                parent = root_electric
        )
        var leaf_smartphone = Category(
                name = "스마트폰",
                parent = middle_mobile
        )
        var leaf_tablet = Category(
                name = "태블릿",
                parent = middle_mobile
        )
        var leaf_notebook = Category(
                name = "노트북",
                parent = root_electric
        )

        // 제품 데이터 정의
        var p1 = GenerateProduct("스마트폰1", maker1);
        var pi1 = ProductImage (
                product = p1,
                photoUrl = "images/products/product_1.jpg"
        )
        var pc1 = ProductCategory(
                category = leaf_smartphone,
                product = p1,
                sortOrder = 1
        )

        var p2 = GenerateProduct("음향기기1", maker2);
        var pi2 = ProductImage(
                product = p2,
                photoUrl = "images/products/product_2.jpg"
        )
        var pc2 = ProductCategory(
                category = middle_etc,
                product = p2,
                sortOrder = 1
        )

        var p3 = GenerateProduct("악세사리1", maker2);
        var pi3 = ProductImage(
                product = p3,
                photoUrl = "images/products/product_3.jpg"
        )
        var pc3 = ProductCategory(
                category = middle_etc,
                product = p3,
                sortOrder = 1
        )

        var p4 = GenerateProduct("노트북1", maker1);
        var pi4 = ProductImage(
                product = p4,
                photoUrl = "images/products/product_4.jpg"
        )
        var pc4 = ProductCategory(
                category = leaf_notebook,
                product = p4,
                sortOrder = 1
        )

        var p5 = GenerateProduct("헤드폰1", maker2);
        var pi5 = ProductImage(
                product = p5,
                photoUrl = "images/products/product_5.jpg"
        )
        var pc5 = ProductCategory(
                category = middle_etc,
                product = p5,
                sortOrder = 1
        )

        var p6 = GenerateProduct("태블릿1", maker1);
        var pi6 = ProductImage(
                product = p6,
                photoUrl = "images/products/product_6.jpg"
        )
        var pc6 = ProductCategory(
                category = leaf_tablet,
                product = p6,
                sortOrder = 1
        )

        var p7 = GenerateProduct("스마트폰2", maker1);
        var pi7 = ProductImage(
                product = p7,
                photoUrl = "images/products/product_7.jpg"
        )
        var pc7 = ProductCategory(
                category = leaf_smartphone,
                product = p7,
                sortOrder = 1
        )

        var p8 = GenerateProduct("키보드1", maker2);
        var pi8 = ProductImage(
                product = p8,
                photoUrl = "images/products/product_8.jpg"
        )
        var pc8 = ProductCategory(
                category = middle_etc,
                product = p8,
                sortOrder = 1
        )

        var p9 = GenerateProduct("드론1", maker2);
        var pi9 = ProductImage(
                product = p9,
                photoUrl = "images/products/product_9.jpg"
        )
        var pc9 = ProductCategory(
                category = middle_etc,
                product = p9,
                sortOrder = 1
        )

        var p10 = GenerateProduct("헤드폰2", maker2);
        var pi10 = ProductImage(
                product = p10,
                photoUrl = "images/products/product_10.jpg"
        )
        var pc10 = ProductCategory(
                category = middle_etc,
                product = p10,
                sortOrder = 1
        )

        var p11 = GenerateProduct("게임콘솔1", maker2);
        var pi11 = ProductImage(
                product = p11,
                photoUrl = "images/products/product_11.jpg"
        )
        var pc11 = ProductCategory(
                category = middle_etc,
                product = p11,
                sortOrder = 1
        )

        var p12 = GenerateProduct("렌즈1", maker2);
        var pi12 = ProductImage(
                product = p12,
                photoUrl = "images/products/product_12.jpg"
        )
        var pc12 = ProductCategory(
                category = middle_etc,
                product = p12,
                sortOrder = 1
        )

        //제조 회사를 하나의 목록으로 정리
        var makers = listOf(maker1,maker2)

        for(m in makers) {
            //이름이 일치하는 제조회사가 존재하지 않는다면
            if(makerRepository.findByName(m.name) == null) {
                //제조 회사 추가
                entityManager.persist(m)
            }
        }

        //제품 분류를 하나의 목록으로 정리
        var categories = listOf(
                root_electric,
                middle_mobile,
                middle_etc,
                middle_onsale,
                leaf_notebook,
                leaf_smartphone,
                leaf_tablet
        )

        for(c in categories) {
            //이름이 일치하는 분류가 존재하지 않는다면
            if(categoryRepository.findByName(c.name) == null) {
                //분류 추가
                entityManager.persist(c)
            }
        }

        //12개의 제품을 하나의 목록으로 정리
        var products = listOf(
                p1,
                p2,
                p3,
                p4,
                p5,
                p6,
                p7,
                p8,
                p9,
                p10,
                p11,
                p12
        )

        var addedProductCount = 0

        for (p in products)
        {
            //이름이 일치하는 제품이 존재하지 않는다면
            if(productRepository.findByName(p.name) == null) {
                //제품 추가
                entityManager.persist(p)
                addedProductCount++
            }
        }

        if(addedProductCount == 12)
        {
            //제품이 속한 분류를 하나의 목록으로 정리
            var productCategories = listOf(
                    pc1,
                    pc2,
                    pc3,
                    pc4,
                    pc5,
                    pc6,
                    pc7,
                    pc8,
                    pc9,
                    pc10,
                    pc11,
                    pc12
            )

            for (pc in productCategories) {
                //제품이 속한 분류 추가
                entityManager.persist(pc)
            }

            //제품 이미지가 속한 분류를 하나의 목록으로 정리
            var productImages = listOf(
                    pi1,
                    pi2,
                    pi3,
                    pi4,
                    pi5,
                    pi6,
                    pi7,
                    pi8,
                    pi9,
                    pi10,
                    pi11,
                    pi12
            )

            for (pi in productImages) {
                //제품 이미지 추가
                entityManager.persist(pi)
            }
        }

        var model: MutableMap<String, Any> = HashMap()
        model["appliedCount"] = addedProductCount

        return ResponseEntity.ok(model)
    }

    private fun GenerateProduct(name: String, maker: Maker): Product {
        return Product(
                name = name,
                description = "...",
                maker = maker,
                isVisible = true,
                price = BigDecimal(0),
                discount = 0,
                stockCount = 0,
                tags = ""
        )
    }
}