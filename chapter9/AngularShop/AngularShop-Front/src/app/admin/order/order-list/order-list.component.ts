import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent }
  from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { Order, OrderItem } from "src/app/models/order";
import { ApiResult } from "src/app/models/api-result";
import { OrderService } from 'src/app/services/order.service';
import orderStatusTypes from 'src/app/models/order-status';

@Component({
  selector: 'app-admin-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class AdminOrderListComponent implements OnInit {
  public displayedColumns: string[] =
    ['id', 'userName', 'toName', 'totalPrice',
      'orders', 'orderStatus', 'createdDate'];
  public orders: MatTableDataSource<Order>;

  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = "id";
  public defaultSortOrder: string = "desc";

  defaultFilterColumn: string = "userName";
  filterQuery: string = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private orderService: OrderService
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

    this.orderService.getData<ApiResult<Order>>(
      event.pageIndex,
      event.pageSize,
      sortColumn,
      sortOrder,
      filterColumn,
      filterQuery)
      .subscribe(result => {
        this.paginator.length = result.totalCount;
        this.paginator.pageIndex = result.pageIndex;
        this.paginator.pageSize = result.pageSize;
        this.orders = new MatTableDataSource<Order>(result.data);
      },
      error => console.log(error));
  }

  clearFilter() {
    this.filterQuery = null;
    this.loadData();
  }

  //총 주문 개수
  getOrderCount(order: Order) {
    let totalCount =
      order.orderItems
        .map(oi => oi.qty)
        .reduce((prev, curr) => prev + curr);

    return totalCount;
  }

  //주문 상태 가져오기
  getOrderStatus(orderStatus: number) {
    return orderStatusTypes[orderStatus];
  }
}
