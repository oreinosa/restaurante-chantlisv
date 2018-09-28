import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";

import { UsersRoutingModule } from "./users-routing.module";
import { UsersComponent } from "./users.component";
import { CreateComponent } from "./create/create.component";
import { UpdateComponent } from "./update/update.component";
import { DeleteComponent } from "./delete/delete.component";

@NgModule({
  imports: [SharedModule, UsersRoutingModule],
  declarations: [
    UsersComponent,
    CreateComponent,
    UpdateComponent,
    DeleteComponent
  ]
})
export class UsersModule {}
