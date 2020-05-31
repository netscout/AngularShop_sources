import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from "../../services/common.service";

@Component({
  selector: 'app-product-page',
  templateUrl: './product.component.html',
  styleUrls: [
    './product.component.css'
  ]
})
export class ProductPageComponent implements OnInit, OnDestroy {

  constructor(
    private commonService: CommonService
  ) {
  }

  //페이지 컴포넌트가 초기화 될 때
  ngOnInit(): void {
    this.commonService.loadCss(
      "assets/styles/product.css",
      () => {
        this.commonService.loadCss(
          "assets/styles/product_responsive.css",
          () => {
            this.commonService.loadScript(
              "assets/js/product.js",
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
