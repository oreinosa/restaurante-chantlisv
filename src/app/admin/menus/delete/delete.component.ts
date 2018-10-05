import { MenusService } from "../menus.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Component } from "@angular/core";
import { NotificationsService } from "../../../notifications/notifications.service";
import { Delete } from "../../../shared/helpers/delete";
import { Menu } from "../../../shared/models/menu";

@Component({
  selector: "app-delete",
  templateUrl: "./delete.component.html",
  styleUrls: [
    "./delete.component.scss",
    "../../../shared/styles/crud-delete.scss"
  ]
})
export class DeleteComponent extends Delete<Menu> {
  constructor(
    public menusService: MenusService,
    public notifications: NotificationsService,
    public router: Router,
    public route: ActivatedRoute
  ) {
    super(menusService, notifications, router, route);
  }
}
