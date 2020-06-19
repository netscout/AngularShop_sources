import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { CartItem } from 'src/app/models/cart-item';
import { AuthenticationService }
  from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartPageComponent implements OnInit, OnDestroy {
  cart: CartItem[];

  constructor(
    private commonService: CommonService,
    private authService:AuthenticationService,
    private router: Router
  ) { }
  //페이지 컴포넌트가 초기화 될 때
  ngOnInit(): void {
    this.commonService.loadCss(
      "styles/cart.css",
      () => {
        this.commonService.loadCss(
          "styles/cart_responsive.css",
          () => {
            this.loadData();
          });
      });
  }

  loadData() {
    //로컬 스토리지에서 장바구니 항목 가져오기
    let cartData = localStorage.getItem(
      `${this.authService.currentUserValue.id}_cart`);

    //장바구니가 비어있다면 메인 페이지 컴포넌트로
    if(!cartData) {
      this.router.navigate(['/']);
    }
    else {
      this.cart = JSON.parse(cartData);
    }

    this.commonService.loadScript(
      "js/cart.js",
      () => {
      });
  }

  //장바구니 항목의 수량 변경시
  qtyChanged($event: any, cartItem: CartItem) {
    cartItem.Qty = +$event.target.value;
  }

  //장바구니 항목의 가격
  getPrice(cartItem: CartItem) {
    return this.commonService.getPrice(cartItem);
  }

  //장바구니 합계 가격
  getTotalPrice() {
    return this.commonService.getTotalPrice(this.cart);
  }

  //장바구니 비우기
  clearCart() {
    this.cart.length = 0;
    localStorage.removeItem(
      `${this.authService.currentUserValue.id}_cart`);
  }

  //주문 처리 컴포넌트로 이동
  checkout() {
    localStorage.setItem(
      `${this.authService.currentUserValue.id}_cart`,
      JSON.stringify(this.cart));
      this.router.navigate(['/checkout']);
  }

  //다른 페이지 컴포넌트로 이동 할 때
  ngOnDestroy() {
    this.commonService.unloadCssAndScripts();
  }
}
