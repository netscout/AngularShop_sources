package com.angularShop.angularShop.controllers

import com.angularShop.angularShop.models.Maker
import com.angularShop.angularShop.models.Product
import com.angularShop.angularShop.models.ProductCategory
import com.angularShop.angularShop.models.ProductImage
import com.angularShop.angularShop.models.dto.ApiResult
import com.angularShop.angularShop.repositories.*
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.io.IOException
import javax.persistence.EntityManager
import javax.transaction.Transactional

@RestController
@RequestMapping("/api/Products")
class ProductsController(
        @Autowired private val productRepository: ProductRepository,
        @Autowired private val makerRepository: MakerRepository,
        @Autowired private val productImageRepository: ProductImageRepository,
        @Autowired private val productCategoryRepository: ProductCategoryRepository,
        @Autowired private val categoryRepository: CategoryRepository,
        @Autowired private var entityManager: EntityManager
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
        val pageReq = getPageRequest(
                pageIndex,
                pageSize,
                sortColumn,
                sortOrder)

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

    @GetMapping("/ByCategory")
    fun getProducts(
            @RequestParam(defaultValue = "0") pageIndex: Int,
            @RequestParam(defaultValue = "10") pageSize: Int,
            @RequestParam(required = false, defaultValue = "id") sortColumn: String,
            @RequestParam(required = false, defaultValue = "desc") sortOrder: String,
            @RequestParam(defaultValue = "0") categoryId: Long)
            : ResponseEntity<ApiResult<Product>> {
        val pageReq = getPageRequest(
                pageIndex,
                pageSize,
                sortColumn,
                sortOrder)

        val result = if (categoryId.compareTo(0) == 0)
            productRepository.findAll(pageReq)
        else
            productRepository.findByCategoryId(categoryId, pageReq)

        return ResponseEntity.ok(
                ApiResult<Product>(
                        data = result.content,
                        pageIndex = pageIndex,
                        pageSize = pageSize,
                        totalCount = result.totalElements,
                        totalPages = result.totalPages
        ))
    }

    private fun getPageRequest(
            pageIndex: Int,
            pageSize: Int,
            sortColumn: String,
            sortOrder: String
    ) : PageRequest {
        //정렬 설정에 따라 정렬 객체 생성
        val sort =
                if(sortOrder.toLowerCase() == "desc")
                    Sort.by(sortColumn).descending()
                else
                    Sort.by(sortColumn).ascending()

        //페이징 정보과 정렬 값으로 페이징 객체 생성
        return PageRequest.of(pageIndex, pageSize, sort)
    }

    @GetMapping("/{id}")
    fun getProduct(@PathVariable(value="id") productId: Long) : ResponseEntity<Product> {
        return productRepository.findById(productId).map {
            product -> ResponseEntity.ok(product)
        }.orElse(ResponseEntity.notFound().build())
    }

    @GetMapping("/GetMakers")
    fun getProduct() : ResponseEntity<List<Maker>> {
        return ResponseEntity.ok(makerRepository.findAll())
    }

    @PostMapping("/IsDupeField")
    fun isDupeField(productId: Long, fieldName: String, fieldValue: String) : Boolean {
        if(fieldName == "name") {
            return productRepository.isDupeNameField(productId, fieldValue) > 0
        }

        return false
    }

    @Transactional
    @PostMapping("/New")
    fun upload(@RequestPart photos:List<MultipartFile>,
               @RequestParam product: String): ResponseEntity<MutableMap<String, Any>> {
        //json으로 받은 제품 정보 역직렬화                   
        val mapper = ObjectMapper()
        mapper.registerModule(JavaTimeModule())
        val product: Product = mapper.readValue(product, Product::class.java)

        //제조 회사 정보 설정
        val maker = makerRepository.findByIdOrNull(product.makerId) ?: return ResponseEntity.badRequest().build()
        product.maker = maker

        //제품 정보 저장
        entityManager.persist(product)

        //업로드된 이미지를 저장하고 저장된 경로 목록 가져오기
        var uploadedPhotosUrls = getProductImages(product.id!!, photos)

        //제품 이미지 새로 추가
        for (p in uploadedPhotosUrls) {
            val pi = ProductImage(
                    photoUrl = p,
                    product = product
            )
            productImageRepository.save(pi)
        }

        var sortOrder = 1
        //제품 분류를 추가
        for (cid in product.categoryIds!!) {
            val category = categoryRepository.findById(cid).orElse(null)

            category?.let {
                val pc = ProductCategory(
                        category = category,
                        product = product,
                        sortOrder = sortOrder++
                )
                productCategoryRepository.save(pc)
            } ?: run {
                return ResponseEntity.badRequest().build()
            }
        }

        var result: MutableMap<String, Any> = HashMap()
        result["id"] = product.id!!

        return ResponseEntity.ok(result)
    }

    @Transactional
    @PostMapping("/Update")
    fun upload(@RequestPart photos:List<MultipartFile>,
               @RequestParam id: String,
               @RequestParam product: String): ResponseEntity<MutableMap<String, Any>> {
        val id = id.toLongOrNull()?.let {
            id -> id
        } ?: run {
            return ResponseEntity.badRequest().build()
        }

        val target = productRepository.findByIdOrNull(id)
                ?: return ResponseEntity.badRequest().build()

        //json으로 받은 제품 정보 역직렬화
        val mapper = ObjectMapper()
        mapper.registerModule(JavaTimeModule())
        val product: Product = mapper.readValue(product, Product::class.java)

        //업로드된 이미지를 지정 경로로 옮기고 경로 목록 가져오기
        var uploadedPhotosUrls = getProductImages(id, photos)
        //기존 이미지 경로 목록에 업로드된 이미지 경로 목록 추가
        var photoUrls = product.getPhotoUrls()
        photoUrls.addAll(uploadedPhotosUrls)
        product.setPhotoUrls(photoUrls)

        //DB에서 현재 제품의 이미지 목록 가져오기
        val originalPis = productImageRepository.findByProductId(id)

        //기존에는 있었지만 없어진 이미지 삭제
        val toDeletePis = originalPis.filter {
            pi -> !product.getPhotoUrls().contains(pi.photoUrl)
        }
        productImageRepository.deleteAll(toDeletePis)

        //기존에 없던 항목은 새로 추가
        for (p in product.getPhotoUrls()) {
            productImageRepository.findByPhotoUrl(p) ?: run {
                val pi = ProductImage(
                        photoUrl = p,
                        product = target
                )
                productImageRepository.save(pi)
            }
        }

        //DB에서 현재 제품의 분류 목록 가져오기
        val originalPcs = productCategoryRepository.findByProductId(id)

        //기존에는 있었지만 없어진 이미지 삭제
        val toDeletePcs = originalPcs.filter {
            pc -> !product.categoryIds!!.contains(pc.category.id)
        }
        productCategoryRepository.deleteAll(toDeletePcs)

        //새로 추가된 카테고리를 추가
        for (cid in product.categoryIds!!) {
            productCategoryRepository.findByProductIdAndCategoryId(id, cid) 
            ?: run {
                val category = categoryRepository.findById(cid).orElse(null)

                category?.let {
                    val sortOrder = 
                        (productCategoryRepository
                            .findByProductId(id).count() + 1)
                        .toInt()
                    val pc = ProductCategory(
                            category = category,
                            product = target,
                            sortOrder = sortOrder
                    )
                    productCategoryRepository.save(pc)
                } ?: run {
                    return ResponseEntity.badRequest().build()
                }
            }
        }

        //제품 정보 업데이트
        target.name = product.name
        if(target.maker?.id != product.makerId) {
            val maker = makerRepository.findByIdOrNull(product.makerId) 
                ?: return ResponseEntity.badRequest().build()
            target.maker = maker
        }
        target.description = product.description
        target.tags = product.tags
        target.price = product.price
        target.discount = product.discount
        target.stockCount = product.stockCount
        target.isVisible = product.isVisible

        //수정된 제품 정보 저장
        entityManager.merge(target)

        var result: MutableMap<String, Any> = HashMap()
        result["id"] = target.id!!

        return ResponseEntity.ok(result)
    }

    private fun getProductImages(id: Long, photos: List<MultipartFile>): MutableList<String> {
        var photoUrls = mutableListOf<String>()

        if(photos != null && photos.count() > 0) {
            for (p in photos) {
                //업로드된 파일 경로에서 지정된 파일 경로 생성
                val originalFileName = p.originalFilename
                val targetFileName = "${id}_product_${originalFileName}"
                val targetPath = "C:\\Sources\\AngularShop\\images\\products\\${targetFileName}"
                var targetFile = File(targetPath)

                try {
                    //새 경로로 파일 전송
                    p.transferTo(targetFile)

                    photoUrls.add("images/products/${targetFileName}")
                } catch (e: IOException) {
                    throw e
                }
            }
        }

        return photoUrls
    }
}
