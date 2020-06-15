import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { User } from 'src/app/models/user';
import { AuthenticationService }
  from 'src/app/services/authentication.service';
import { CartItem } from 'src/app/models/cart-item';
import { Router } from '@angular/router';
import { BaseFormComponent } from 'src/app/base.form.component';
import { FormBuilder, Validators } from '@angular/forms';
import { Order, OrderItem } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutPageComponent
  extends BaseFormComponent
  implements OnInit, OnDestroy {
  error: string;
  loading = false;
  user: User;
  totalPrice: number;
  cart: CartItem[];

  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private orderService: OrderService
  ) {
    super();
  }

  //페이지 컴포넌트가 초기화 될 때
  ngOnInit(): void {
    this.commonService.loadCss(
      "styles/checkout.css",
      () => {
        this.commonService.loadCss(
          "styles/checkout_responsive.css",
          () => {
            this.initForm();
            this.loadData();
          });
      });
  }

  initForm() {
    this.form = this.formBuilder.group({
      name: ['',
        Validators.required
      ],
      address1: ['',
        Validators.required
      ],
      address2: ['',
        Validators.required
      ],
      phone: ['',
        Validators.required
      ]
    });
  }

  loadData() {
    //장바구니 목록 가져오기
    let cartData = localStorage.getItem(
      `${this.authService.currentUserValue.id}_cart`);

    if(!cartData) {
      this.router.navigate(['/']);
    }
    else {
      this.cart = JSON.parse(cartData);
    }

    this.user = this.authService.currentUserValue;

    this.commonService.loadScript(
      "js/checkout.js",
      () => {

      });
  }

  getPrice(cartItem: CartItem) {
    return this.commonService.getPrice(cartItem);
  }

  getTotalPrice() {
    return this.commonService.getTotalPrice(this.cart);
  }

  order() {
    if(this.form.invalid) {
      this.error = "폼이 올바르지 않습니다.";
      return;
    }

    this.loading = true;

    let order = <Order>{};
    order.userId = this.user.id;
    order.toName = this.getValue("name");
    order.address1 = this.getValue("address1");
    order.address2 = this.getValue("address2");
    order.phone = this.getValue("phone");
    order.orderItems = this.cart.map(ci => <OrderItem>{
      productId: ci.product.id,
      qty: ci.Qty
    });

    this.orderService.post<Order>(order)
      .subscribe(result => {
        //주문 성공시 장바구니 초기화
        localStorage.removeItem(
          `${this.authService.currentUserValue.id}_cart`);

        this.router.navigate(['/']);

        this.loading = false;
      },
      error => this.error = error);
  }

  //다른 페이지 컴포넌트로 이동 할 때
  ngOnDestroy() {
    this.commonService.unloadCssAndScripts();
  }
}
