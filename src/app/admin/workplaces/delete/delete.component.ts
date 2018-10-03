import { WorkplacesService } from "../workplaces.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Component } from "@angular/core";
import { NotificationsService } from "../../../notifications/notifications.service";
import { Delete } from "../../../shared/helpers/delete";
import { Workplace } from "../../../shared/models/workplace";

@Component({
  selector: "app-delete",
  templateUrl: "./delete.component.html",
  styleUrls: [
    "./delete.component.scss",
    "../../../shared/styles/crud-delete.scss"
  ]
})
export class DeleteComponent extends Delete<Workplace> {
  constructor(
    public workplacesService: WorkplacesService,
    public notifications: NotificationsService,
    public router: Router,
    public route: ActivatedRoute
  ) {
    super(workplacesService, notifications, router, route);
  }
}
