import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BaseService } from "./base.service";
import { Observable } from "rxjs";

import { environment } from "@envs/environment";
import { Maker } from '../models/maker';

@Injectable({
  providedIn: 'root'
})
export class ProductService
  extends BaseService {
  constructor(
    http: HttpClient
  ) {
    super(http, environment.baseUrl);
  }

  getData<ApiResult>(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string
  ): Observable<ApiResult> {
    var url = `${this.baseUrl}api/Products`;

    var params = new HttpParams()
      .set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString())
      .set("sortColumn", sortColumn)
      .set("sortOrder", sortOrder);

    if(filterQuery) {
      params = params
        .set("filterColumn", filterColumn)
        .set("filterQuery", filterQuery);
    }

    return this.http.get<ApiResult>(url, { params });
  }

  get<Product>(id): Observable<Product> {
    var url = `${this.baseUrl}api/Products/${id}`;
    return this.http.get<Product>(url);
  }

  put<Product>(item): Observable<Product> {
    var url = `${this.baseUrl}api/Products/Update`;
    return this.http.post<Product>(url, item)
  }

  post<Product>(item): Observable<Product> {
    var url = `${this.baseUrl}api/Products/New`;
    return this.http.post<Product>(url, item);
  }

  getEntireCategoryTree<Category>(): Observable<Category[]> {
    var url = `${this.baseUrl}api/Categories/EntireCategoryTree`;

    return this.http.get<Category[]>(url);
  }

  isDupeField(
    productId,
    fieldName,
    fieldValue
  ): Observable<boolean> {
    var params = new HttpParams()
      .set("productId", productId)
      .set("fieldName", fieldName)
      .set("fieldValue", fieldValue);

    var url = `${this.baseUrl}api/Products/IsDupeField`;
    return this.http.post<boolean>(url, null, { params });
  }

  getMakers() : Observable<Maker[]> {
    var url = `${this.baseUrl}api/Products/GetMakers`;

    return this.http.get<Maker[]>(url);
  }
}
