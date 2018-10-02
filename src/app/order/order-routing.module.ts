import { OrderComponent } from './order.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewOrderComponent } from './new-order/new-order.component';
import { AuthGuard } from '../auth/auth.guard';
import { WorkplaceGuard } from '../auth/workplace.guard';

const routes: Routes = [
  { path: 'menu', component: OrderComponent },
  { path: 'nueva-orden/:id', pathMatch: 'full', redirectTo: 'menu' },
  { path: 'nueva-orden/:id/paso/:step', component: NewOrderComponent, canActivate: [AuthGuard, WorkplaceGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule {

}
