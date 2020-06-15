import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { CategoryListItem } from 'src/app/models/category-list-item';
import { ApiResult } from "src/app/models/api-result";
import { environment } from "@envs/environment";

@Component({
  selector: 'app-admin-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class AdminCategoryListComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'name', 'totalProducts'];
  public categories: MatTableDataSource<CategoryListItem>;

  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = "name";
  public defaultSortOrder: string = "asc";

  defaultFilterColumn: string = "name";
  filterQuery: string = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadData(null);
  }

  loadData(query: string = null) {
    var pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    if(query) {
      this.filterQuery = query;
    }
    this.getData(pageEvent);
  }

  getData(event: PageEvent) {
    var sortColumn = (this.sort)
        ? this.sort.active
        : this.defaultSortColumn;
    var sortOrder = (this.sort)
        ? this.sort.direction
        : this.defaultSortOrder;

    var filterColumn = (this.filterQuery)
      ? this.defaultFilterColumn
      :null;
    var filterQuery = (this.filterQuery)
      ? this.filterQuery
      : null;

    //api 요청을 전송할 url
    var url = `${environment.baseUrl}api/Categories`;

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
    this.http.get<ApiResult<CategoryListItem>>(url, { params })
      .subscribe(result => {
        //전송 받은 결과를 저장
        this.paginator.length = result.totalCount;
        this.paginator.pageIndex = result.pageIndex;
        this.paginator.pageSize = result.pageSize;
        this.categories = new MatTableDataSource<CategoryListItem>(result.data);
    },
    error => console.log(error));
  }

  clearFilter() {
    this.filterQuery = null;
    this.loadData();
  }
}
