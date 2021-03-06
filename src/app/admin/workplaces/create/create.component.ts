import { WorkplacesService } from "../workplaces.service";
import { Router, ActivatedRoute } from "@angular/router";
import { NotificationsService } from "../../../notifications/notifications.service";
import { Component } from "@angular/core";
import { Workplace } from "../../../shared/models/workplace";
import { Create } from "../../../shared/helpers/create";
@Component({
  selector: "app-create",
  templateUrl: "./create.component.html",
  styleUrls: [
    "./create.component.scss",
    "../../../shared/styles/crud-create.scss"
  ]
})
export class CreateComponent extends Create<Workplace> {
  workplace = new Workplace();

  constructor(
    public workplacesService: WorkplacesService,
    public router: Router,
    public route: ActivatedRoute,
    public notifications: NotificationsService,
  ) {
    super(workplacesService, notifications, router, route);
  }


}
