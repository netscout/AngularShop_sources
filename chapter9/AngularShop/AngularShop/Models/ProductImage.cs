using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AngularShop.Models
{
    public class ProductImage
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        [StringLength(256)]
        public string PhotoUrl { get; set; }

        [ForeignKey("Product")]
        public long ProductId { get; set; }

        #region 네비게이션 속성

        public virtual Product Product { get; set; }

        #endregion
    }
}
