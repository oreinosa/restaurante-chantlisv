import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";

import { ProductsRoutingModule } from "./products-routing.module";
import { ProductsComponent } from "./products.component";
import { CreateComponent } from "./create/create.component";
import { UpdateComponent } from "./update/update.component";
import { DeleteComponent } from "./delete/delete.component";

@NgModule({
  imports: [SharedModule, ProductsRoutingModule],
  declarations: [
    ProductsComponent,
    CreateComponent,
    UpdateComponent,
    DeleteComponent
  ]
})
export class ProductsModule { }
