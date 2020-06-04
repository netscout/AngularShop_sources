using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AngularShop.Models
{
    public class Maker
    {
        /// <summary>
        /// 기본키(PK)이며 1부터 자동증가
        /// 
        /// 제조 회사 번호
        /// </summary>
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        /// <summary>
        /// 제조 회사명
        /// </summary>
        [Required]
        [StringLength(128)]
        public string Name { get; set; }
    }
}