import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductListItem } from 'src/app/models/product-list-item';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesPageComponent implements OnInit, OnDestroy {
  products: ProductListItem[] = [
    {
      id: 1,
      name: "스마트폰1",
      imageSrc: "assets/images/product_1.jpg",
      isNew: true,
      price: 600,
      discount: 0
    },
    {
      id: 2,
      name: "스마트폰2",
      imageSrc: "assets/images/product_2.jpg",
      isNew: false,
      price: 800,
      discount: 40
    },
    {
      id: 3,
      name: "스마트폰3",
      imageSrc: "assets/images/product_3.jpg",
      isNew: false,
      price: 600,
      discount: 0
    },
    {
      id: 4,
      name: "스마트폰4",
      imageSrc: "assets/images/product_4.jpg",
      isNew: false,
      price: 600,
      discount: 0
    },
    {
      id: 5,
      name: "스마트폰5",
      imageSrc: "assets/images/product_5.jpg",
      isNew: false,
      price: 600,
      discount: 0
    },
    {
      id: 6,
      name: "스마트폰6",
      imageSrc: "assets/images/product_6.jpg",
      isNew: false,
      price: 600,
      discount: 0
    },
    {
      id: 7,
      name: "스마트폰7",
      imageSrc: "assets/images/product_7.jpg",
      isNew: false,
      price: 600,
      discount: 0
    },
    {
      id: 8,
      name: "스마트폰8",
      imageSrc: "assets/images/product_8.jpg",
      isNew: false,
      price: 600,
      discount: 0
    },
    {
      id: 9,
      name: "스마트폰9",
      imageSrc: "assets/images/product_9.jpg",
      isNew: false,
      price: 600,
      discount: 0
    },
    {
      id: 10,
      name: "스마트폰10",
      imageSrc: "assets/images/product_10.jpg",
      isNew: false,
      price: 600,
      discount: 0
    },
    {
      id: 11,
      name: "스마트폰11",
      imageSrc: "assets/images/product_11.jpg",
      isNew: false,
      price: 600,
      discount: 0
    },
    {
      id: 12,
      name: "스마트폰12",
      imageSrc: "assets/images/product_12.jpg",
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
      "assets/styles/categories.css",
      () => {
        //"assets/css/categories.css" 로드 성공 후
        this.commonService.loadCss(
          "assets/styles/categories_responsive.css",
          () => {
            //"assets/css/categories_responsive.css" 로드 성공 후
            this.commonService.loadScript(
              "assets/js/categories.js",
              () => {
                //모두 로딩 완료
              });
          }
        )
      }
    )
  }

  //다른 페이지 컴포넌트로 이동 할 때
  ngOnDestroy() {
    //동적으로 삽입한 모든 css와 js 제거
    this.commonService.unloadCssAndScripts();
  }
}
