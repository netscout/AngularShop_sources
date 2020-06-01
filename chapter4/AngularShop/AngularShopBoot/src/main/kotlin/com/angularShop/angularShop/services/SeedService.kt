package com.angularShop.angularShop.services

import com.angularShop.angularShop.models.Maker
import com.angularShop.angularShop.models.Product
import java.math.BigDecimal

class SeedService() {
    fun genereateMakers() : List<Maker> {
        //제조 회사 데이터 정의
        var maker1 = Maker(name = "모바일 메이커1")
        var maker2 = Maker(name = "기타 메이커2")

        //제조 회사를 하나의 목록으로 정리
        var makers = listOf(maker1, maker2)
        
        return makers
    }
    fun genereateProducts(makers: List<Maker>) : List<Product> {
        // 제품 데이터 정의
        var p1 = GenerateProduct("스마트폰1", makers[1]);

        var p2 = GenerateProduct("음향기기1", makers[2]);

        var p3 = GenerateProduct("악세사리1", makers[2]);

        var p4 = GenerateProduct("노트북1", makers[1]);

        var p5 = GenerateProduct("헤드폰1", makers[2]);

        var p6 = GenerateProduct("태블릿1", makers[1]);

        var p7 = GenerateProduct("스마트폰2", makers[1]);

        var p8 = GenerateProduct("키보드1", makers[2]);

        var p9 = GenerateProduct("드론1", makers[2]);

        var p10 = GenerateProduct("헤드폰2", makers[2]);

        var p11 = GenerateProduct("게임콘솔1", makers[2]);

        var p12 = GenerateProduct("렌즈1", makers[2]);

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

        return products
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
