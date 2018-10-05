import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'admin', loadChildren: './admin/admin.module#AdminModule' },
  { path: 'ordenes', loadChildren: './orders/orders.module#OrdersModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
