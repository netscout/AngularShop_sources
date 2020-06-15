import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BaseService } from "./base.service";
import { Observable } from "rxjs";

import { environment } from "@envs/environment";

@Injectable({
  providedIn: 'root'
})
export class OrderService
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
    var url = `${this.baseUrl}api/Orders`;

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

  get<Order>(id): Observable<Order> {
    var url = `${this.baseUrl}api/Orders/${id}`;
    return this.http.get<Order>(url);
  }

  put<Order>(item): Observable<Order> {
    var url = `${this.baseUrl}api/Orders/${item.id}`;
    return this.http.put<Order>(url, item)
  }

  post<Order>(item): Observable<Order> {
    var url = `${this.baseUrl}api/Orders`;
    return this.http.post<Order>(url, item);
  }

  isDupeField(
    orderId,
    fieldName,
    fieldValue
  ): Observable<boolean> {
    var params = new HttpParams()
      .set("orderId", orderId)
      .set("fieldName", fieldName)
      .set("fieldValue", fieldValue);

    var url = `${this.baseUrl}api/Orders/IsDupeField`;
    return this.http.post<boolean>(url, null, { params });
  }
}
