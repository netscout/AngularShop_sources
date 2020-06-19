import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ProductListItem } from 'src/app/models/product-list-item';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResult } from 'src/app/models/api-result';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesPageComponent implements OnInit, OnDestroy {
  defaultPageIndex: number = 0;
  defaultPageSize: number = 12;
  public defaultSortColumn: string = "id";
  public defaultSortOrder: string = "desc";

  categoryQuery: string = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  products: ProductListItem[] = []
  categoryId: number;

  constructor(
    private commonService: CommonService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    //url의 파라미터가 바뀌면 무조건 리로드 하도록
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  //페이지 컴포넌트가 초기화 될 때
  ngOnInit(): void {
    this.commonService.loadCss(
      "styles/categories.css",
      () => {
        //"css/categories.css" 로드 성공 후
        this.commonService.loadCss(
          "styles/categories_responsive.css",
          () => {
            //"css/categories_responsive.css" 로드 성공 후
            this.commonService.loadScript(
              "js/categories.js",
              () => {
                this.loadData();
              });
          }
        )
      }
    )
  }

  loadData() {
    //URL을 통해 넘어온 제품 분류 번호를 가져오기
    //없다면 빈 값 -> 전체 검색
    this.categoryId = +this.activatedRoute.snapshot.paramMap.get('id');
    if(!this.categoryId)
    {
      this.categoryId = 0;
    }

    var pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;

    this.getData(pageEvent);
  }

  getData(event: PageEvent) {
    var sortColumn = this.defaultSortColumn;
    var sortOrder = this.defaultSortOrder;

    this.productService.getDataByCategory<ApiResult<Product>>(
      event.pageIndex,
      event.pageSize,
      sortColumn,
      sortOrder,
      this.categoryId)
      .subscribe(result => {
        this.paginator.length = result.totalCount;
        this.paginator.pageIndex = event.pageIndex;
        this.paginator.pageSize = event.pageSize;
        this.products =
          this.commonService.keysToCamel(result.data)
            .map(p => <ProductListItem>{
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
    if(!date.toLowerCase().endsWith("z")) {
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
