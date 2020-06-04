import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductListItem } from 'src/app/models/product-list-item';
import { CommonService } from 'src/app/services/common.service';
import { ProductService } from 'src/app/services/product.service';
import { ApiResult } from 'src/app/models/api-result';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-main-page',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainPageComponent implements OnInit, OnDestroy {
  products: ProductListItem[] = []

  constructor(
    private commonService: CommonService,
    private productService: ProductService
  ) { }

  //페이지 컴포넌트가 초기화 될 때
  ngOnInit(): void {
    this.commonService.loadCss(
      "styles/main_styles.css",
      () => {
        //"styles/main_styles.css" 로드 성공 후
        this.commonService.loadCss(
          "styles/responsive.css",
          () => {
            //"styles/responsive.css" 로드 성공 후
            this.commonService.loadScript(
              "js/custom.js",
              () => {
                this.loadData();
              });
          });
      });
  }

  loadData() {
    this.productService.getData<ApiResult<Product>>(
      0,
      8,
      "id",
      "desc",
      null,
      null)
      .subscribe(result => {
        this.products = result.data.map(p => <ProductListItem>{
          id: p.id,
          name: p.name,
          imageSrc: p.photoUrls[0],
          isNew: this.isNew(p.createdDate),
          onSale: (p.discount > 0),
          price: p.price,
          discount: p.discount});
      },
      error => console.log(error));
  }

  //출시 된지 한 달 이내인지 확인
  isNew(date: any) {
    if(!date.endsWith("z")) {
      date = date + "z";
    }
    let lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() - 30);
    return Date.parse(date) > lastMonth.getTime();
  }

  //다른 페이지 컴포넌트로 이동 할 때
  ngOnDestroy() {
    //동적으로 삽입한 모든 css와 js 제거
    this.commonService.unloadCssAndScripts();
  }

}
