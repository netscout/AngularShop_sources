//목록에 표시될 상품 데이터를 표현
export interface ProductListItem {
  //상품 번호
  id: number;
  //상품명
  name: string;
  //상품 이미지 주소
  imageSrc: string;
  //신상품인지
  isNew: boolean;
  //상품가격
  price: number;
  //할인율(0-100)
  discount: number;
}
