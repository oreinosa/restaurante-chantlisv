import { Router, ActivatedRoute } from "@angular/router";
import { NotificationsService } from "../../notifications/notifications.service";
import { NgForm } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { DAO } from "./dao";
import { capitalize } from "./capitalize";

export class Create<T> {
  constructor(
    public service: DAO<T>,
    public notifications: NotificationsService,
    public router: Router,
    public route: ActivatedRoute
  ) { }

  onSubmit(form: NgForm) {
    const product: T = form.value;
    this.service.add(product).then(
      (newObject) => {
        console.log(newObject);
        this.notifications.show(
          `${capitalize(this.service.className)} agregado (ID: ${newObject.id})`,
          capitalize(this.service.collectionName),
          "success"
        );
        this.router.navigate(["../"], { relativeTo: this.route });
      },
      e => {
        console.log(e.error);
        this.notifications.show(e.error, capitalize(this.service.collectionName), "danger");
        form.resetForm();
      }
    );
  }
}
