import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from "../../services/common.service";
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import { AuthenticationService }
  from 'src/app/services/authentication.service';
import { CartItem } from 'src/app/models/cart-item';

@Component({
  selector: 'app-product-page',
  templateUrl: './product.component.html',
  styleUrls: [
    './product.component.css'
  ]
})
export class ProductPageComponent implements OnInit, OnDestroy {
  product: Product;
  loading = false;

  id: number;
  error: string;

  constructor(
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private authService: AuthenticationService
  ) {
  }

  //페이지 컴포넌트가 초기화 될 때
  ngOnInit(): void {
    this.commonService.loadCss(
      "styles/product.css",
      () => {
        this.commonService.loadCss(
          "styles/product_responsive.css",
          () => {
            this.loadData();
          });
      });
  }

  loadData() {
    this.loading = true;

    //URL에서 제품 번호를 가져옴
    //없다면 빈 값
    this.id = +this.activatedRoute.snapshot.paramMap.get('id');

    if(this.id) {
      this.productService.get<Product>(this.id)
        .subscribe(result => {
          this.product = result;

          this.loading = false;

          this.commonService.loadScript(
            "js/product.js",
            () => {
              //로드 완료
            });
        },
        error => this.error=error);
    }
    else {
      //제품 번호가 없으면 제품 목록 페이지로
      this.router.navigate(['/category']);
    }
  }

  //할인율이 있는 경우 할인된 가격을 소수점 둘째 자리까지
  getPrice() {
    let price = this.product.price;

    if(this.product.discount > 0) {
      price = this.product.price
        * ((100 - this.product.discount) / 100);
    }

    //소수점 둘째 자리까지 활용
    return price.toFixed(2);
  }

  //장바구니에 제품 추가
  addCart() {
    if(!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
    }

    const qty = +(
      document.getElementById("quantity_input") as HTMLInputElement
      ).value;

    //현재 장바구니 목록을 로컬스토리지에서 가져오기
    let cart: CartItem[];
    let cartData = localStorage.getItem(
      `${this.authService.currentUserValue.id}_cart`);
    if(!cartData) {
      cart = [];
    }
    else {
      cart = JSON.parse(cartData);
    }

    let cartItem = cart.find(c => c.product.id == this.id);

    //장바구니에 없는 항목이라면 추가
    if(!cartItem) {
      cartItem = <CartItem> {
        product: this.product,
        Qty: qty
      };

      cart.push(cartItem);
    }
    //장바구니에 있는 항목이라면 수량 추가
    //단, 재고량을 초과할 수 없음
    else {
      cartItem.Qty += qty;
      if(cartItem.Qty > this.product.stockCount)
      {
        cartItem.Qty = this.product.stockCount;
      }
    }

    //로컬 스토리지에 장바구니 목록 저장하고 장바구니 페이지 컴포넌트로
    localStorage.setItem(
      `${this.authService.currentUserValue.id}_cart`,
      JSON.stringify(cart));

    this.router.navigate(['/cart']);
  }

  //다른 페이지 컴포넌트로 이동 할 때
  ngOnDestroy() {
    this.commonService.unloadCssAndScripts();
  }
}
