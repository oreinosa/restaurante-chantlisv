import { UsersService } from "../users.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Component } from "@angular/core";
import { NotificationsService } from "../../../notifications/notifications.service";
import { Delete } from "../../../shared/helpers/delete";
import { User } from "../../../shared/models/user";

@Component({
  selector: "app-delete",
  templateUrl: "./delete.component.html",
  styleUrls: [
    "./delete.component.scss",
    "../../../shared/styles/crud-delete.scss"
  ]
})
export class DeleteComponent extends Delete<User> {
  constructor(
    public usersService: UsersService,
    public notifications: NotificationsService,
    public router: Router,
    public route: ActivatedRoute
  ) {
    super(usersService, notifications, router, route);
  }
}
