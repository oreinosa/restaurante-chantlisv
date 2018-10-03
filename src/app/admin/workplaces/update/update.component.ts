import { Component } from "@angular/core";
import { Workplace } from "../../../shared/models/workplace";
import { Router, ActivatedRoute } from "@angular/router";
import { WorkplacesService } from "../workplaces.service";
import { NotificationsService } from "../../../notifications/notifications.service";
import { Update } from "../../../shared/helpers/update";
import { Role } from "../../../shared/models/role";
import { Observable } from "rxjs";

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

  compareRoleFn(a: Role, b: Role) {
    // console.log(a, b);
    if (a && b) {
      return a.id == b.id;
    }
    return false;
  }
}
