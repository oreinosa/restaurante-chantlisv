import { MyOrdersService } from './../my-orders.service';
import { Component } from '@angular/core';
import { MyOrder } from '../my-order';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feedback-order',
  templateUrl: './feedback-order.component.html',
  styleUrls: ['./feedback-order.component.css']
})
export class FeedbackOrderComponent extends MyOrder {
  onSubmit(): void {
    throw new Error("Method not implemented.");
  }

  constructor(
    myOrdersService: MyOrdersService,
    router: Router
  ) { super(myOrdersService, router); }


}
