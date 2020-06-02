using System;

namespace AngularShop.Models
{
    public class BaseEntity
    {
        /// <summary>
        /// DB에 추가된 날짜와 시간
        /// </summary>
        public DateTime? CreatedDate { get; set; }
        /// <summary>
        /// DB에서 수정된 날짜와 시간
        /// </summary>
        public DateTime? ModifiedDate { get; set; }
    }
}
