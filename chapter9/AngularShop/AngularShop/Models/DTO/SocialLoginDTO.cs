namespace AngularShop.Models.DTO
{
    public class SocialLoginDTO
    {
        /// <summary>
        /// 소셜 로그인 제공자
        /// </summary>
        public string Provider { get; set; }
        /// <summary>
        /// 소셜 로그인 계정의 고유 Id 값
        /// </summary>
        public string ProviderKey { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string PhotoUrl { get; set; }
        public int? Expires { get; set; }
    }
}
