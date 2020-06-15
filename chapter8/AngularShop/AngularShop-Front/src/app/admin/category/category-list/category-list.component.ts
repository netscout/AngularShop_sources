import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { CategoryListItem } from 'src/app/models/category-list-item';
import { ApiResult } from "src/app/models/api-result";
import { environment } from "@envs/environment";
import { CategoryService } from 'src/app/services/category.service';

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
    private categoryService: CategoryService
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

    //서버로 get 요청을 전송
    this.categoryService.getData<ApiResult<CategoryListItem>>(
      event.pageIndex,
      event.pageSize,
      sortColumn,
      sortOrder,
      filterColumn,
      filterQuery)
      .subscribe(result => {
        //전송 받은 결과를 저장
        this.paginator.length = result.totalCount;
        this.paginator.pageIndex = result.pageIndex;
        this.paginator.pageSize = result.pageSize;
        this.categories =
          new MatTableDataSource<CategoryListItem>(result.data);
    },
    error => console.log(error));
  }

  clearFilter() {
    this.filterQuery = null;
    this.loadData();
  }
}
