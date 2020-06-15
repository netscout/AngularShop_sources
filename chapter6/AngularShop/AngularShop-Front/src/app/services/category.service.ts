import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BaseService } from "./base.service";
import { Observable } from "rxjs";

import { environment } from "@envs/environment";

@Injectable({
  providedIn: 'root'
})
export class CategoryService
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
    var url = `${this.baseUrl}api/Categories`;

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

  get<Category>(id): Observable<Category> {
    var url = `${this.baseUrl}api/Categories/${id}`;
    return this.http.get<Category>(url);
  }

  put<Category>(item): Observable<Category> {
    var url = `${this.baseUrl}api/Categories/${item.id}`;
    return this.http.put<Category>(url, item)
  }

  post<Category>(item): Observable<Category> {
    var url = `${this.baseUrl}api/Categories`;
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
    return this.http.post<boolean>(url, null, { params });
  }
}
