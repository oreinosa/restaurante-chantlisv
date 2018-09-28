import { Component } from "@angular/core";
import { User } from "../../../shared/models/user";
import { Router, ActivatedRoute } from "@angular/router";
import { UsersService } from "../users.service";
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
export class UpdateComponent extends Update<User> {
  // roles: Role[] = [{ id: 1, name: "Cliente" }, { id: 3, name: "Admin" }];
  roles = [
    "Admin",
    "Cliente"
  ];

  constructor(
    public service: UsersService,
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
