import { Component, OnInit } from '@angular/core';
import { MyOrder } from '../my-order';
import { OrderService } from '../../order/order.service';
import { MyOrdersService } from '../my-orders.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Order } from '../../shared/models/order';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent extends MyOrder {

  constructor(
    private orderService: OrderService,
    myOrderService: MyOrdersService,
    router: Router,
    private route: ActivatedRoute
  ) {
    super(myOrderService, router);
  }


  onSubmit() {
    this.router.navigate(['paso', 0], { relativeTo: this.route });
  }


}
