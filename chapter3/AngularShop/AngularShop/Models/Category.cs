using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
    }
}
