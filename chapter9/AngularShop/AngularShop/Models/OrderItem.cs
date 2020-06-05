using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AngularShop.Models
{
    public class OrderItem
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }
        [Required]
        public int Qty { get; set; }
        [Required]
        public decimal Price { get; set; }

        [ForeignKey("Product")]
        public long ProductId { get; set; }
        [ForeignKey("Order")]
        public long OrderId { get; set; }

        #region 프론트엔드에만 전달할 속성

        [NotMapped]
        public string ProductName
        {
            get
            {
                return (Product != null)
                    ? Product.Name
                    : _productName;
            }
            set
            {
                _productName = value;
            }
        }
        private string _productName;

        #endregion

        [JsonIgnore]
        public virtual Product Product { get; set; }
        [JsonIgnore]
        public virtual Order Order { get; set; }
    }
}
