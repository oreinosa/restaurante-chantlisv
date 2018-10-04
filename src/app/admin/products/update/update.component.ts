import { Component, ViewChild } from "@angular/core";
import { Product } from "../../../shared/models/product";
import { Router, ActivatedRoute } from "@angular/router";
import { ProductsService } from "../products.service";
import { NotificationsService } from "../../../notifications/notifications.service";
import { Update } from "../../../shared/helpers/update";
import { UploaderComponent } from "../../../uploader/uploader.component";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-update",
  templateUrl: "./update.component.html",
  styleUrls: [
    "./update.component.scss",
    "../../../shared/styles/crud-update.scss"
  ]
})
export class UpdateComponent extends Update<Product> {
  categories = [
    "Principal",
    "Acompañamiento",
    "Bebida"
  ];
  @ViewChild(UploaderComponent) uploader: UploaderComponent;

  constructor(
    public service: ProductsService,
    public notifications: NotificationsService,
    public router: Router,
    public route: ActivatedRoute,
  ) {
    super(service, notifications, router, route);
  }

  onSubmit(form: NgForm) {
    const controls = form.controls;
    if (controls.extra && controls.extra.value === 0) controls.extra.disable();
    if (controls.noSides && controls.noSides.value === undefined) controls.noSides.disable();
    if (controls.noTortillas && controls.noTortillas.value === undefined) controls.noTortillas.disable();

    if (this.uploader.image) {
      return this.uploader
        .onSubmit(this.service.collectionRoute, this.object.name)
        .then(imageURL => form.controls.imageURL.setValue(imageURL))
        .then(() => super.onSubmit(form));
    }
    console.log('image not edited')
    return super.onSubmit(form);
  }

}
