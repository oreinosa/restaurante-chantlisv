import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { OrdersService } from './orders.service';
import { PackageComponent } from './package/package.component';
import { PaymentComponent } from './payment/payment.component';
import { MatTableModule, MatSortModule, MatPaginatorModule } from '@angular/material';
import { FiltersComponent } from './package/filters/filters.component';
import { OrdersModeComponent } from './orders-mode/orders-mode.component';
import { WorkplacesService } from 'src/app/admin/workplaces/workplaces.service';
import { OrdersOverviewComponent } from './package/orders-overview/orders-overview.component';
import { ConfirmStatusChangeComponent } from './package/confirm-status-change/confirm-status-change.component';
import { SalesComponent } from './sales/sales.component';

@NgModule({
  imports: [
    SharedModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    OrdersRoutingModule
  ],
  declarations: [
    OrdersComponent,
    PackageComponent,
    PaymentComponent,
    FiltersComponent,
    OrdersModeComponent,
    OrdersOverviewComponent,
    ConfirmStatusChangeComponent,
    SalesComponent
  ],
  providers: [OrdersService, WorkplacesService],
  entryComponents: [
    ConfirmStatusChangeComponent
  ],
})
export class OrdersModule { }
