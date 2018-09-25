import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { OrderRoutingModule } from './order-routing.module';
import { DayMenuComponent } from './day-menu/day-menu.component';
import { Step1Component } from './new-order/step-1/step-1.component';
import { Step2Component } from './new-order/step-2/step-2.component';
import { Step3Component } from './new-order/step-3/step-3.component';
import { Step4Component } from './new-order/step-4/step-4.component';
import { NewOrderComponent } from './new-order/new-order.component';
import { OrderComponent } from './order.component';
@NgModule({
  imports: [
    SharedModule,
    OrderRoutingModule
  ],
  declarations: [
    DayMenuComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
    NewOrderComponent,
    OrderComponent
  ],
  exports: [
    DayMenuComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
  ],
})
export class OrderModule { }
