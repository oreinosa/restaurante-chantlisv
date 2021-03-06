import { Component } from "@angular/core";
import { Workplace } from "../../../shared/models/workplace";
import { Router, ActivatedRoute } from "@angular/router";
import { WorkplacesService } from "../workplaces.service";
import { NotificationsService } from "../../../notifications/notifications.service";
import { Update } from "../../../shared/helpers/update";

@Component({
  selector: "app-update",
  templateUrl: "./update.component.html",
  styleUrls: [
    "./update.component.scss",
    "../../../shared/styles/crud-update.scss"
  ]
})
export class UpdateComponent extends Update<Workplace> {
  constructor(
    public service: WorkplacesService,
    public notifications: NotificationsService,
    public router: Router,
    public route: ActivatedRoute,
  ) {
    super(service, notifications, router, route);
  }

}
