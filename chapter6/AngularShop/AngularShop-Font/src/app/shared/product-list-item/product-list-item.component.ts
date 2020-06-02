import { Component, OnInit, Input } from '@angular/core';
import { ProductListItem } from 'src/app/models/product-list-item';

@Component({
  selector: 'app-product-list-item',
  templateUrl: './product-list-item.component.html',
  styleUrls: ['./product-list-item.component.css']
})
export class ProductListItemComponent implements OnInit {
  //부모 컴포넌트에서 지정해준 값
  @Input() product: ProductListItem;

  constructor() { }

  ngOnInit(): void {
  }

  //할인중인 상품인가?
  get onSale() : boolean {
    return this.product.discount > 0;
  }

  //할인율이 있는 겨우 할인된 가격을 리턴
  getDiscount() {
    let discounted =
      this.product.price * ((100 - this.product.discount) / 100);

    //소수점 둘째 자리까지 활용
    return discounted.toFixed(2);
  }
}
