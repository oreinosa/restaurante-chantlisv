import { ProductsService } from "../products.service";
import { Router, ActivatedRoute } from "@angular/router";
import { NotificationsService } from "../../../notifications/notifications.service";
import { Component, ViewChild } from "@angular/core";
import { Product } from "../../../shared/models/product";
import { Create } from "../../../shared/helpers/create";
import { NgForm } from "@angular/forms";
import { UploaderComponent } from "../../../uploader/uploader.component";

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
  categories = [
    "Principal",
    "Acompañamiento",
    "Bebida"
  ];
  @ViewChild(UploaderComponent) uploader: UploaderComponent;

  constructor(
    public productsService: ProductsService,
    public router: Router,
    public route: ActivatedRoute,
    public notifications: NotificationsService,
  ) {
    super(productsService, notifications, router, route);
  }

  onSubmit(form: NgForm) {
    const controls = form.controls;
    if (controls.extra && controls.extra.value === 0) controls.extra.disable();
    if (controls.noSides && controls.noSides.value === undefined) controls.noSides.disable();
    if (controls.noTortillas && controls.noTortillas.value === undefined) controls.noTortillas.disable();

    return this.uploader
      .onSubmit(this.service.collectionRoute, this.product.name)
      .then(imageURL => form.controls.imageURL.setValue(imageURL))
      .then(() => super.onSubmit(form));

  }


}
