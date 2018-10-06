import { UsersService } from "../users.service";
import { Router, ActivatedRoute } from "@angular/router";
import { NotificationsService } from "../../../notifications/notifications.service";
import { Component } from "@angular/core";
import { User } from "../../../shared/models/user";
import { Create } from "../../../shared/helpers/create";
import { Role } from "../../../shared/models/role";
import { Observable } from "rxjs";

@Component({
  selector: "app-create",
  templateUrl: "./create.component.html",
  styleUrls: [
    "./create.component.scss",
    "../../../shared/styles/crud-create.scss"
  ]
})
export class CreateComponent extends Create<User> {
  user = new User();
  password: string = '';
  // roles: Role[] = [{ id: 1, name: "Cliente" }, { id: 3, name: "Admin" }];
  roles = [
    "Admin",
    "Cliente"
  ];

  constructor(
    public usersService: UsersService,
    public router: Router,
    public route: ActivatedRoute,
    public notifications: NotificationsService,
  ) {
    super(usersService, notifications, router, route);
  }


}
