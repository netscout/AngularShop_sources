package com.angularShop.angularShop.controllers

import com.angularShop.angularShop.models.Category
import com.angularShop.angularShop.models.Product
import com.angularShop.angularShop.models.dto.ApiResult
import com.angularShop.angularShop.repositories.CategoryRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.persistence.EntityManager
import javax.transaction.Transactional

@RestController
@RequestMapping("api/Categories")
class CategoriesController(
        @Autowired private val categoryRepository: CategoryRepository,
        @Autowired private var entityManager: EntityManager
) {
    @GetMapping()
    fun getCategories(
            @RequestParam(defaultValue = "0") pageIndex: Int,
            @RequestParam(defaultValue = "10") pageSize: Int,
            @RequestParam(required = false, defaultValue = "id") sortColumn: String,
            @RequestParam(required = false, defaultValue = "desc") sortOrder: String,
            @RequestParam(required = false) filterColumn: String?,
            @RequestParam(required = false) filterQuery: String?)
            : ResponseEntity<ApiResult<Category>> {
        //정렬 설정에 따라 정렬 객체 생성
        val sort =
                if(sortOrder.toLowerCase() == "desc")
                    Sort.by(sortColumn).descending()
                else
                    Sort.by(sortColumn).ascending()

        //페이징 정보과 정렬 값으로 페이징 객체 생성
        var pageReq = PageRequest.of(pageIndex, pageSize, sort)

        //검색 값이 존재한다면
        val result = filterQuery?.let {
            //이름과 정렬값, 페이징 정보로 검색
            categoryRepository.findByNameContains(filterQuery, pageReq)
        } ?: run {
            //검색 값이 없다면,
            //전체 데이터에 대해 정렬 및 페이징 정보로 조회
            categoryRepository.findAll(pageReq)
        }

        return ResponseEntity.ok(
                ApiResult<Category>(
                        data = result.content,
                        pageIndex = pageIndex,
                        pageSize = pageSize,
                        totalCount = result.totalElements,
                        totalPages = result.totalPages
                ))
    }

    @GetMapping("/{id}")
    fun getCategory(@PathVariable(value="id") categoryId: Long)
            : ResponseEntity<Category> {
        return categoryRepository.findById(categoryId)
        .map { //id로 분류를 찾으면
            category -> ResponseEntity.ok(category)
        } //id로 분류를 찾지 못하면
        .orElse(ResponseEntity.notFound().build())
    }

    @GetMapping("/EntireCategoryTree")
    fun getEntireCategoryTree(): ResponseEntity<List<Category>> {
        //부모가 없는 루트 노드만 검색
        val rootCategories = categoryRepository.findByParentId(null)

        return ResponseEntity.ok(rootCategories)
    }

    @PostMapping()
    fun newCategory(@RequestBody @Validated req: Category)
            : ResponseEntity<MutableMap<String, Any>> {
        if (req.parentId != null) {
            //parentId값에 따라 부모 노드를 검색
            var parent = categoryRepository.findByIdOrNull(req.parentId) ?: run {
                return ResponseEntity.badRequest().build()
            }
            //검색된 따라 부모 노드를 설정
            req.parent = parent
        }

        val category = categoryRepository.save(req)

        var result: MutableMap<String, Any> = HashMap()
        result["id"] = category.id!!

        return ResponseEntity.ok(result)
    }

    @Transactional
    @PutMapping("/{id}")
    fun updateCategory(@PathVariable(value="id") id: Long,
                       @RequestBody @Validated req: Category)
            : ResponseEntity<MutableMap<String, Any>> {
        if (id != req.id) {
            return ResponseEntity.badRequest().build()
        }

        if (req.parentId != null) {
            //parentId값에 따라 부모 노드를 검색
            var parent = categoryRepository.findByIdOrNull(req.parentId) ?: run {
                return ResponseEntity.badRequest().build()
            }
            //검색된 따라 부모 노드를 설정
            req.parent = parent
        }

        entityManager.merge(req)

        var result: MutableMap<String, Any> = HashMap()
        result["id"] = req.id!!

        return ResponseEntity.ok(result)
    }

    @PostMapping("/IsDupeField")
    fun isDupeField(categoryId: Long, fieldName: String, fieldValue: String) : Boolean {
        if(fieldName == "name") {
            return categoryRepository.isDupeNameField(categoryId, fieldValue) > 0
        }

        return false
    }
}