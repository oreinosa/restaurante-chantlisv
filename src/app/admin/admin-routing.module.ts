import { AdminComponent } from "./admin.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminGuard } from "../auth/admin.guard";

const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      { path: "usuarios", loadChildren: "./users/users.module#UsersModule" },
      { path: "lugares-de-trabajo", loadChildren: "./workplaces/workplaces.module#WorkplacesModule" },
      { path: "productos", loadChildren: "./products/products.module#ProductsModule" },
      { path: "", pathMatch: "full", redirectTo: "usuarios" }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
