import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";

import { ProductsRoutingModule } from "./products-routing.module";
import { ProductsComponent } from "./products.component";
import { CreateComponent } from "./create/create.component";
import { UpdateComponent } from "./update/update.component";
import { DeleteComponent } from "./delete/delete.component";
import { UploaderModule } from "../../uploader/uploader.module";

@NgModule({
  imports: [SharedModule, UploaderModule, ProductsRoutingModule],
  declarations: [
    ProductsComponent,
    CreateComponent,
    UpdateComponent,
    DeleteComponent
  ]
})
export class ProductsModule { }
