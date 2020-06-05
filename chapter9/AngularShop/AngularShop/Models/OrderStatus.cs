using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AngularShop.Models
{
    public class OrderStatus
    {
        [Key]
        public OrderStatusId Id { get; set; }
        [StringLength(256)]
        public string Name { get; set; }
    }

    public enum OrderStatusId
    {
        /// <summary>
        /// "확인 대기중"
        /// </summary>
        Pending,
        /// <summary>
        /// "결재 확인됨"
        /// </summary>
        Payment_Accepted,
        /// <summary>
        /// 상품 발송 대기중
        /// </summary>
        Processing_In_Progress,
        /// <summary>
        /// 배송중
        /// </summary>
        On_Shipping,
        /// <summary>
        /// 배송완료
        /// </summary>
        Delivered,
        /// <summary>
        /// 배송 확인됨
        /// </summary>
        DeliveryConfirmed,
        /// <summary>
        /// 취소됨
        /// </summary>
        Canceled
    }
}
