import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { environment } from "@envs/environment";
import { Product } from 'src/app/models/product';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ApiResult } from 'src/app/models/api-result';

@Component({
  selector: 'app-admin-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class AdminProductListComponent implements OnInit {
  //표시할 컬럼 목록
  public displayedColumns: string[] = [
    'id', 'name', 'makerName', 'tags', 'price', 'discount',
    'stockCount', 'isVisible', 'createdDate', 'modifiedDate',
    'categories', 'photoUrls'
  ];

  public products: MatTableDataSource<Product>;

  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  //html에서 양방향 바인딩을 하기 위해 public으로 선언
  public defaultSortColumn: string = "id";
  public defaultSortOrder:string = "desc";

  //검색어를 통해 필터링할 컬럼
  defaultFilterColumn: string = "name";
  //검색어를 저장해둘 속성
  filterQuery:string = null;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(query: string = null) {
    //페이징 관련 이벤트 세팅
    var pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;

    //검색어가 있다면 검색어 세팅
    if(query) {
      this.filterQuery = query;
    }
    this.getData(pageEvent);
  }

  getData(event: PageEvent) {
    //현재 정렬로 설정됨 컬럼 세팅(화살표가 붙은 컬럼)
    //정렬로 설정된 컬럼이 없다면 id로 설정
    var sortColumn = (this.sort)
        ? this.sort.active
        : this.defaultSortColumn;
    //현재 정렬 순서(화살표의 방향)
    var sortOrder = (this.sort)
        ? this.sort.direction
        : this.defaultSortOrder;

    //현재 설정된 검색 컬럼 및 검색어 설정
    var filterColumn = (this.filterQuery)
      ? this.defaultFilterColumn
      :null;
    var filterQuery = (this.filterQuery)
      ? this.filterQuery
      : null;

    //api 요청을 전송할 url
    var url = `${environment.baseUrl}api/Products`;

    //요청 파라미터 설정
    var params = new HttpParams()
      .set("pageIndex", event.pageIndex.toString())
      .set("pageSize", event.pageSize.toString())
      .set("sortColumn", sortColumn)
      .set("sortOrder", sortOrder);

    if(filterQuery) {
      params = params
        .set("filterColumn", filterColumn)
        .set("filterQuery", filterQuery);
    }

    //서버로 get 요청을 전송
    this.http.get<ApiResult<Product>>(url, { params })
      .subscribe(result => {
        //전송 받은 결과를 저장
        this.paginator.length = result.totalCount;
        this.paginator.pageIndex = result.pageIndex;
        this.paginator.pageSize = result.pageSize;
        this.products = new MatTableDataSource<Product>(result.data);
    },
    error => console.log(error));
  }

  getCategoryNames(product: Product) {
    if(product.categories && product.categories.length > 0) {
      //제품 분류를 ,로 구분하여 하나로 합치기
      let categoryNames = product.categories.map(c => c.name).join(",");

      return categoryNames;
    }

    return "없음";
  }

  getTitlePhotoUrl(product: Product) {
    //첫 번째 제품 이미지를 대표 이미지로 표시
    if(product.photoUrls && product.photoUrls.length > 0) {
      return product.photoUrls[0];
    }

    //이미지가 없다면 기본 이미지 표시
    return "images/products/default_product_image.png";
  }

  clearFilter() {
    this.filterQuery = null;
    this.loadData();
  }
}
