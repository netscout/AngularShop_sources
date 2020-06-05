using AngularShop.Models.Identity;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AngularShop.Models
{
    public class Order : BaseEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        [StringLength(128)]
        public string ToName { get; set; }

        [Required]
        [StringLength(512)]
        public string Address1 { get; set; }

        [Required]
        [StringLength(512)]
        public string Address2 { get; set; }

        [Required]
        [StringLength(20)]
        public string Phone { get; set; }

        [Required]
        public decimal TotalPrice { get; set; }

        [ForeignKey("OrderStatus")]
        public OrderStatusId OrderStatusId { get; set; }

        #region 프론트엔드에만 전달할 속성

        [NotMapped]
        public string UserName
        {
            get
            {
                return (User != null)
                    ? User.UserName
                    : _userName;
            }
            set
            {
                _userName = value;
            }
        }
        private string _userName;

        #endregion

        [ForeignKey("User")]
        public long UserId { get; set; }

        public virtual OrderStatus OrderStatus { get; set; }

        [JsonIgnore]
        public virtual User User { get; set; }

        public virtual List<OrderItem> OrderItems { get; set; }
    }
}
