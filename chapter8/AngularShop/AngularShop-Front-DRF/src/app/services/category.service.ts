import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BaseService } from "./base.service";
import { Observable } from "rxjs";

import { environment } from "@envs/environment";
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService
  extends BaseService {
  constructor(
    http: HttpClient,
    commonService: CommonService
  ) {
    super(http, environment.baseUrl, commonService);
  }

  getData<ApiResult>(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string
  ): Observable<ApiResult> {
    var url = `${this.baseUrl}api/Categories`;

    //DRF의 페이징은 1부터 시작
    if(environment.DRF) {
      pageIndex += 1
    }

    var params = this.commonService.getQueryParams(
      pageIndex.toString(),
      pageSize.toString(),
      sortColumn,
      sortOrder,
      filterColumn,
      filterQuery
    )

    return this.http.get<ApiResult>(url, { params });
  }

  get<Category>(id): Observable<Category> {
    var url = `${this.baseUrl}api/Categories/${id}`;
    return this.http.get<Category>(url);
  }

  put<Category>(item): Observable<Category> {
    var url = `${this.baseUrl}api/Categories/${item.id}`;

    if(environment.DRF) {
      //데이터 객체의 속성을 Camel -> Snake로 변환
      item = this.commonService.keysToSnake(item);
      //put, post의 경우 /로 끝나도록 설정
      url += "/";
    }

    return this.http.put<Category>(url, item)
  }

  post<Category>(item): Observable<Category> {
    var url = `${this.baseUrl}api/Categories`;

    if(environment.DRF) {
      //데이터 객체의 속성을 Camel -> Snake로 변환
      item = this.commonService.keysToSnake(item);
      //put, post의 경우 /로 끝나도록 설정
      url += "/";
    }

    return this.http.post<Category>(url, item);
  }

  getEntireCategoryTree<Category>(): Observable<Category[]> {
    var url = `${this.baseUrl}api/Categories/EntireCategoryTree`;

    return this.http.get<Category[]>(url);
  }

  isDupeField(
    categoryId,
    fieldName,
    fieldValue
  ): Observable<boolean> {
    var params = new HttpParams()
      .set("categoryId", categoryId)
      .set("fieldName", fieldName)
      .set("fieldValue", fieldValue);

    var url = `${this.baseUrl}api/Categories/IsDupeField`;

    if(environment.DRF) {
      //put, post의 경우 /로 끝나도록 설정
      url += "/";
    }

    return this.http.post<boolean>(url, null, { params });
  }
}
