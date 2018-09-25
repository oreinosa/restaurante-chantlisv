import { OrderModule } from './../order/order.module';
import { NgModule } from '@angular/core';

import { MyOrdersRoutingModule } from './my-orders-routing.module';
import { MyOrdersComponent } from './my-orders.component';

import { MyOrdersService } from './my-orders.service';
import { SharedModule } from '../shared/shared.module';
import { EditOrderComponent } from './edit-order/edit-order.component';
import { CancelOrderComponent } from './cancel-order/cancel-order.component';
import { FeedbackOrderComponent } from './feedback-order/feedback-order.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { ListOrderComponent } from './list-order/list-order.component';

@NgModule({
  imports: [
    SharedModule,
    OrderModule,
    MyOrdersRoutingModule
  ],
  declarations: [
    MyOrdersComponent,
    EditOrderComponent,
    CancelOrderComponent,
    FeedbackOrderComponent,
    OrderDetailsComponent,
    ListOrderComponent
  ],
})
export class MyOrdersModule { }
