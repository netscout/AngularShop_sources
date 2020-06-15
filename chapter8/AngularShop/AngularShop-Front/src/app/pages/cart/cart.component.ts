import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartPageComponent implements OnInit, OnDestroy {

  constructor(
    private commonService: CommonService
  ) { }

  //페이지 컴포넌트가 초기화 될 때
  ngOnInit(): void {
    this.commonService.loadCss(
      "styles/cart.css",
      () => {
        this.commonService.loadCss(
          "styles/cart_responsive.css",
          () => {
            this.commonService.loadScript(
              "js/cart.js",
              () => {

              });
          });
      });
  }

  //다른 페이지 컴포넌트로 이동 할 때
  ngOnDestroy() {
    this.commonService.unloadCssAndScripts();
  }

}
