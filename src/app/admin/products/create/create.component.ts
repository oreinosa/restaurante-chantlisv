import { ProductsService } from "../products.service";
import { Router, ActivatedRoute } from "@angular/router";
import { NotificationsService } from "../../../notifications/notifications.service";
import { Component } from "@angular/core";
import { Product } from "../../../shared/models/product";
import { Create } from "../../../shared/helpers/create";

@Component({
  selector: "app-create",
  templateUrl: "./create.component.html",
  styleUrls: [
    "./create.component.scss",
    "../../../shared/styles/crud-create.scss"
  ]
})
export class CreateComponent extends Create<Product> {
  product = new Product();

  constructor(
    public productsService: ProductsService,
    public router: Router,
    public route: ActivatedRoute,
    public notifications: NotificationsService,
  ) {
    super(productsService, notifications, router, route);
  }


}
