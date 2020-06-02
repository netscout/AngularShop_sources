using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace AngularShop.Models
{
    public class Category
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        [StringLength(128)]
        public string Name { get; set; }

        [ForeignKey("Category")]
        public long? ParentId { get; set; }

        #region 네비게이션 속성

        [JsonIgnore]
        public virtual List<ProductCategory> ProductCategories { get; set; }

        public virtual List<Category> Children { get; set; }

        [JsonIgnore]
        public virtual Category Parent { get; set; }

        #endregion

        #region 모델에서만 존재하는 속성

        /// <summary>
        /// 분류에 포함된 제품 개수
        /// NotMapped로 설정된 속성은 DB에 매핑되지 않고 모델 클래스에만 존재
        /// </summary>
        [NotMapped]
        public int TotalProducts
        {
            get
            {
                return (ProductCategories != null)
                    ? ProductCategories.Count
                    : _totalProducts;
            }
            set
            {
                _totalProducts = value;
            }
        }
        private int _totalProducts = 0;

        #endregion
    }
}
