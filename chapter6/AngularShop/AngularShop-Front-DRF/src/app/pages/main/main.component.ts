import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductListItem } from 'src/app/models/product-list-item';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainPageComponent implements OnInit, OnDestroy {
  products: ProductListItem[] = [
    {
      id: 1,
      name: "스마트폰1",
      imageSrc: "images/products/product_1.jpg",
      isNew: true,
      price: 600,
      discount: 0
    },
    {
      id: 2,
      name: "스마트폰2",
      imageSrc: "images/products/product_2.jpg",
      isNew: false,
      price: 800,
      discount: 40
    },
    {
      id: 3,
      name: "스마트폰3",
      imageSrc: "images/products/product_3.jpg",
      isNew: false,
      price: 600,
      discount: 0
    },
    {
      id: 4,
      name: "스마트폰4",
      imageSrc: "images/products/product_4.jpg",
      isNew: false,
      price: 600,
      discount: 0
    },
    {
      id: 5,
      name: "스마트폰5",
      imageSrc: "images/products/product_5.jpg",
      isNew: false,
      price: 600,
      discount: 0
    },
    {
      id: 6,
      name: "스마트폰6",
      imageSrc: "images/products/product_6.jpg",
      isNew: false,
      price: 600,
      discount: 0
    },
    {
      id: 7,
      name: "스마트폰7",
      imageSrc: "images/products/product_7.jpg",
      isNew: false,
      price: 600,
      discount: 0
    },
    {
      id: 8,
      name: "스마트폰8",
      imageSrc: "images/products/product_8.jpg",
      isNew: false,
      price: 600,
      discount: 0
    }
  ]

  constructor(
    private commonService: CommonService
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
                //모두 로딩 완료
              });
          });
      });
  }

  //다른 페이지 컴포넌트로 이동 할 때
  ngOnDestroy() {
    //동적으로 삽입한 모든 css와 js 제거
    this.commonService.unloadCssAndScripts();
  }

}
