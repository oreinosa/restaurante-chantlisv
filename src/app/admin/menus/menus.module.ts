import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";

import { MenusRoutingModule } from "./menus-routing.module";
import { MenusComponent } from "./menus.component";
import { CreateComponent } from "./create/create.component";
import { UpdateComponent } from "./update/update.component";
import { DeleteComponent } from "./delete/delete.component";

@NgModule({
  imports: [SharedModule, MenusRoutingModule],
  declarations: [
    MenusComponent,
    CreateComponent,
    UpdateComponent,
    DeleteComponent
  ]
})
export class MenusModule { }
