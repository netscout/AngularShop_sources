package com.angularShop.angularShop.models

import com.angularShop.angularShop.models.identity.User
import com.fasterxml.jackson.annotation.JsonIdentityInfo
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.ObjectIdGenerators
import org.springframework.data.annotation.CreatedBy
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedBy
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.math.BigDecimal
import java.time.LocalDateTime
import javax.persistence.*

@Entity
//CreatedBy, LastModifiedBy에 사용자 id가 매핑되도록 하기 위한 설정
@EntityListeners(AuditingEntityListener::class)
@Table(name = "Orders")
//중복해서 생성되는 걸 막아준다. 그런데 중복해서 나와야 하는 항목에는 사용하면 안됨.
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator::class, property = "id")
data class Order(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        var id: Long? = null,

        var toName: String,

        var address1: String,

        var address2: String,

        @Column(length = 20)
        var phone: String,

        var totalPrice: BigDecimal,

        var orderStatusId: Int,

        @Column(insertable = false, updatable = false)
        var userId: Long? = null,

        @JsonIgnore
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "userId")
        var user: User? = null,

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "orderStatusId", insertable = false, updatable = false)
        var orderStatus: OrderStatus? = null,

        //OrderItem 테이블의 order속성과 매핑
        @OneToMany(mappedBy ="order", fetch = FetchType.LAZY)
        var orderItems: List<OrderItem>? = null,

        @Column(name = "createdDate")
        @CreatedDate
        var CreatedDate: LocalDateTime? = null,

        @Column(name = "modifiedDate")
        @LastModifiedDate
        var ModifiedDate: LocalDateTime? = null
) {
    fun getUserName() : String {
        return user!!.userName!!
    }
}