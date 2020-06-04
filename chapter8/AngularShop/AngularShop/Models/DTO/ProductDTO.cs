using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace AngularShop.Models.DTO
{
    /// <summary>
    /// 제품 추가 / 수정시 Multipart/formdata로 전송되는 데이터
    /// </summary>
    public class ProductDTO
    {
        /// <summary>
        /// 제품 번호
        /// </summary>
        public string Id { get; set; }
        /// <summary>
        /// 제품 이미지 데이터
        /// </summary>
        public List<IFormFile> Photos { get; set; }
        /// <summary>
        /// Json으로 직렬화된 제품 데이터
        /// </summary>
        public string Product { get; set; }
    }
}
