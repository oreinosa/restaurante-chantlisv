import { Component } from "@angular/core";
import { Product } from "../../../shared/models/product";
import { Router, ActivatedRoute } from "@angular/router";
import { ProductsService } from "../products.service";
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
export class UpdateComponent extends Update<Product> {
  constructor(
    public service: ProductsService,
    public notifications: NotificationsService,
    public router: Router,
    public route: ActivatedRoute,
  ) {
    super(service, notifications, router, route);
  }

}
