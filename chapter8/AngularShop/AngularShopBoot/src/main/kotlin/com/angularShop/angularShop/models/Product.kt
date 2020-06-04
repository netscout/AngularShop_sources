package com.angularShop.angularShop.models

import com.fasterxml.jackson.annotation.JsonIdentityInfo
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.ObjectIdGenerators
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.math.BigDecimal
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "Products")
//중복해서 생성되는 걸 막아준다. 그런데 중복해서 나와야 하는 항목에는 사용하면 안됨.
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator::class, property = "id")
@EntityListeners(AuditingEntityListener::class)
data class Product(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        var id: Long? = null,

        var name: String,

        @Lob
        var description: String,

        var tags: String,

        var price: BigDecimal,

        var discount: Int? = null,

        var stockCount: Int,

        //Boolean 타입속성이 is로 시작하면 역직렬화 과정에서
        //is를 떼고 visible로 속성을 생성하므로 오류가 발생
        //오류가 발생하지 않도록 속성 명을 지정해 줌.
        @get:JsonProperty("isVisible")
        var isVisible: Boolean,

        //제조 회사 번호(왜래키, 읽기 전용)
        @Column(insertable = false, updatable = false)
        var makerId: Long? = null,

        //최초 생성된 시간
        @Column(name = "createdDate")
        @CreatedDate
        var createdDate: LocalDateTime? = null,

        //마지막으로 수정된 시간
        @Column(name = "modifiedDate")
        @LastModifiedDate
        var modifiedDate: LocalDateTime? = null,

        //region 네비게이션 속성

        //제조 회사
        @JsonIgnore
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "makerId")
        var maker: Maker? = null,

        //ProductCategory테이블의 product속성과 매핑
        @JsonIgnore
        @OneToMany(mappedBy ="product", fetch = FetchType.LAZY)
        var productCategories: List<ProductCategory>? = null,

        //ProductImage테이블의 product속성과 매핑
        @JsonIgnore
        @OneToMany(mappedBy="product", fetch = FetchType.LAZY)
        var productImages: MutableList<ProductImage>? = null,

        //endregion

        //region 모델에서만 존재하는 속성

        //Transient로 설정된 속성은 DB에 매핑되지 않고 모델 클래스에만 존재
        @Transient
        @JsonIgnore
        var _categories: List<Category>? = null,

        //Transient로 설정된 속성은 DB에 매핑되지 않고 모델 클래스에만 존재
        @Transient
        @JsonIgnore
        var _photoUrls: MutableList<String>? = null,

        //Transient로 설정된 속성은 DB에 매핑되지 않고 모델 클래스에만 존재
        @Transient
        @JsonIgnore
        var _makerName: String? = null,

        //상품 추가 / 수정시 카테고리 목록을 가져올 속성
        @Transient
        var categoryIds: List<Long>? = null

        //endregion
) {
        //생성되는 모델 구조를 단순화 시키기 위해
        fun getCategories() : List<Category> {
                return productCategories?.map {
                        pc -> pc.category
                } ?: run {
                        listOf<Category>()
                }
        }
        fun setCategories(value: List<Category>) {
                this._categories = value
        }

        //생성되는 모델 구조를 단순화 시키기 위해
        fun getPhotoUrls() : MutableList<String> {
                //엘비스 연산자(?:)는 _photoUrls가 null인 경우 실행을 의미
                return _photoUrls ?: run {
                        if(productImages != null) {
                                //!!가 표시 된 경우 반드시 null이 아님을 표시
                                return productImages!!.map {
                                        pi -> pi.photoUrl
                                }.toMutableList()
                        }

                        return mutableListOf<String>()
                }
        }
        fun setPhotoUrls(value: MutableList<String>) {
                _photoUrls = value
        }

        //생성되는 모델 구조를 단순화 시키기 위해
        fun getMakerName(): String {
                //!!가 표시 된 경우 반드시 null이 아님을 표시
                return maker!!.name
        }
        fun setMakerName(value: String) {
                _makerName = value
        }
}