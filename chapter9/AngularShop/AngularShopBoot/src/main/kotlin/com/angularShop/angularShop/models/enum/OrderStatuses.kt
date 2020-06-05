package com.angularShop.angularShop.models.enum

enum class OrderStatuses(val value:Int) {
    // "확인 대기중"
    Pending(0),
    // "결재 확인됨"
    PaymentAccepted(1),
    // 상품 발송 대기중
    ProcessingInProgress(2),
    // 배송중
    OnShipping(3),
    // 배송완료
    Delivered(4),
    // 배송 확인됨
    DeliveryConfirmed(5),
    // 취소됨
    Canceled(6)
}