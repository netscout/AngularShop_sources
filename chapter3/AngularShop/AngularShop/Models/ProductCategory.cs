using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AngularShop.Models
{
    public class ProductCategory
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [ForeignKey("Product")]
        public long ProductId { get; set; }
        [ForeignKey("Category")]
        public long CategoryId { get; set; }

        /// <summary>
        /// 상품이 여러 카테고리에 속할 경우, 속한 카테고리의 우선순위
        /// </summary>
        [Required]
        public int SortOrder { get; set; }

        #region 네비게이션 속성

        public virtual Product Product { get; set; }

        public virtual Category Category { get; set; }

        #endregion
    }
}
