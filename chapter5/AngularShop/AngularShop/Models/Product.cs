using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace AngularShop.Models
{
    public class Product : BaseEntity
    {
        /// <summary>
        /// 기본키(PK)이며 1부터 자동증가
        /// 
        /// 제품 번호
        /// </summary>
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        /// <summary>
        /// 반드시 값이 있어야 하며, 데이터의 최대 크기는 128
        /// varchar(128)
        /// 
        /// 제품명
        /// </summary>
        [Required]
        [StringLength(128)]
        public string Name { get; set; }

        /// <summary>
        /// 제품 상세설명
        /// </summary>
        [Required]
        public string Description { get; set; }

        /// <summary>
        /// 외래키(FK)이며 Maker 테이블의 기본키를 참조함
        /// 
        /// 제조회사 번호
        /// </summary>
        [Required]
        [ForeignKey("Maker")]
        public long MakerId { get; set; }

        /// <summary>
        /// 제품 태그
        /// </summary>
        [Required]
        [StringLength(256)]
        public string Tags { get; set; }

        /// <summary>
        /// 제품 가격
        /// </summary>
        [Required]
        public decimal Price { get; set; }

        /// <summary>
        /// 할인율
        /// </summary>
        public int? Discount { get; set; }

        /// <summary>
        /// 재고 수량
        /// </summary>
        [Required]
        public int StockCount { get; set; }

        /// <summary>
        /// 판매 중인 상품 인지 여부
        /// </summary>
        [Required]
        public bool IsVisible { get; set; }

        #region 네비게이션 속성

        /// <summary>
        /// 제조 회사
        /// </summary>
        [JsonIgnore]
        public virtual Maker Maker { get; set; }

        
        /// <summary>
        /// 상품이 포함된 분류
        /// </summary>
        [JsonIgnore]
        public virtual List<ProductCategory> ProductCategories { get; set; }

        /// <summary>
        /// 제품의 이미지 목록
        /// </summary>
        [JsonIgnore]
        public virtual List<ProductImage> ProductImages { get; set; }

        #endregion

        #region 모델에서만 존재하는 속성

        //NotMapped로 설정된 속성은 DB에 매핑되지 않고 모델 클래스에만 존재
        //생성되는 모델 구조를 단순화 시키기 위해
        [NotMapped]
        public List<Category> Categories
        {
            get
            {
                return (ProductCategories != null && ProductCategories.Count > 0)
                    ? ProductCategories
                        .OrderBy(pc => pc.SortOrder)
                        .Select(pc => pc.Category)
                        .ToList()
                    : _categories;
            }
            set
            {
                _categories = value;
            }
        }
        private List<Category> _categories;

        //생성되는 모델 구조를 단순화 시키기 위해
        [NotMapped]
        public string MakerName
        {
            get
            {
                return (Maker != null)
                    ? Maker.Name
                    : _makerName;

            }
            set
            {
                _makerName = value;
            }
        }
        private string _makerName;

        //생성되는 모델 구조를 단순화 시키기 위해
        [NotMapped]
        public List<string> PhotoUrls
        {
            get
            {
                return (ProductImages != null && ProductImages.Count > 0)
                    ? ProductImages.OrderBy(pi => pi.Id).Select(pi => pi.PhotoUrl).ToList()
                    : _photoUrls;

            }
            set
            {
                _photoUrls = value;
            }
        }
        private List<string> _photoUrls;

        #endregion
    }
}

