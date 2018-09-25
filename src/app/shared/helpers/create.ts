import { Router, ActivatedRoute } from "@angular/router";
import { NotificationsService } from "../../notifications/notifications.service";
import { NgForm } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { DAO } from "./dao";

export class Create<T> {
  constructor(
    public service: DAO<T>,
    public notifications: NotificationsService,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  onSubmit(form: NgForm) {
    const product: T = form.value;
    // this.service.create(product).subscribe(
    //   (newObject: T) => {
    //     console.log(newObject);
    //     this.notifications.show(
    //       `${this.service.className} agregado (ID: ${newObject['id']})`,
    //       this.service.collectionName,
    //       "success"
    //     );
    //     this.router.navigate(["../"], { relativeTo: this.route });
    //   },
    //   (e: HttpErrorResponse) => {
    //     console.log(e.error);
    //     this.notifications.show(e.error, this.service.collectionName, "danger");
    //     form.resetForm();
    //   }
    // );
  }
}
