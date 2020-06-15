import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from "@angular/forms";
import { BaseFormComponent } from "../../../base.form.component";

import { Order } from "src/app/models/order";
import { OrderService } from "src/app/services/order.service";
import orderStatusTypes from 'src/app/models/order-status';

@Component({
  selector: 'app-admin-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.css']
})
export class AdminOrderEditComponent
  extends BaseFormComponent
  implements OnInit {
    error: string;

    title: string;

    //편집할 order 객체
    order: Order;
    orderStatuses = orderStatusTypes;

    id: number;

    loading = false;

    constructor(
      private formBuilder: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private orderService: OrderService
    ) {
      super();
    }

    ngOnInit() {
      this.form = this.formBuilder.group({
        userName: ['',
        ],
        toName: ['',
          Validators.required
        ],
        address1: ['',
          Validators.required
        ],
        address2: ['',
          Validators.required
        ],
        phone: ['',
          Validators.required
        ],
        orderStatusId: ['',
          Validators.required,
        ]
      });

      //읽기 전용 처리
      this.form.get('userName').disable({onlySelf: true});

      this.loadData();
    }

    loadData() {
      this.loading = true;

      this.loadOrder();
    }

    loadOrder() {
      this.id = +this.activatedRoute.snapshot.paramMap.get('id');

      if(this.id) {
        this.orderService.get<Order>(this.id)
          .subscribe(result => {
            this.order = result;
            this.title = `주문 번호 - ${this.order.id}`;

            this.form.patchValue(this.order);

            this.loading = false;
          },
          error => this.error=error);
      }
      else {
        this.router.navigate(['/admin-orders']);
      }
    }

    onSubmit() {
      this.loading = true;

      let order = this.order;
      order.toName = this.getValue("toName");
      order.address1 = this.getValue("address1");
      order.address2 = this.getValue("address2");
      order.phone = this.getValue("phone");
      order.orderStatusId = +this.getValue("orderStatusId");

      this.orderService.put<Order>(order)
        .subscribe(result => {
          console.log(`Order ${order.id} has been updated.`);

          this.router.navigate(['/admin-orders']);
        },
        error => console.error(error));

      this.loading = false;
    }
}
