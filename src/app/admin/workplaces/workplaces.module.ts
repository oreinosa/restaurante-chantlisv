import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";

import { WorkplacesRoutingModule } from "./workplaces-routing.module";
import { WorkplacesComponent } from "./workplaces.component";
import { CreateComponent } from "./create/create.component";
import { UpdateComponent } from "./update/update.component";
import { DeleteComponent } from "./delete/delete.component";

@NgModule({
  imports: [SharedModule, WorkplacesRoutingModule],
  declarations: [
    WorkplacesComponent,
    CreateComponent,
    UpdateComponent,
    DeleteComponent
  ]
})
export class WorkplacesModule { }
