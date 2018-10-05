import { PaymentComponent } from './payment/payment.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './orders.component';
import { PackageComponent } from './package/package.component';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from '../auth/admin.guard';

const routes: Routes = [
  {
    path: '', component: OrdersComponent, canActivate: [AuthGuard, AdminGuard], children: [
      { path: 'empacar', component: PackageComponent },
      { path: 'pagar', component: PaymentComponent },
      { path: '', pathMatch: 'full', redirectTo: 'empacar' },
      { path: '**', redirectTo: 'empacar', }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
