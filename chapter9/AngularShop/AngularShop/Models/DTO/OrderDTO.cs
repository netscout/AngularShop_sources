using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AngularShop.Models.DTO
{
    public class OrderDTO
    {
        [Required]
        public long UserId { get; set; }
        [Required]
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
        public List<OrderItemDTO> OrderItems { get; set; }
    }

    public class OrderItemDTO
    {
        [Required]
        public long ProductId { get; set; }
        [Required]
        public int Qty { get; set; }
    }
}
