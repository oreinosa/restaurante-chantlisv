import { NgForm } from '@angular/forms';
import { NotificationsService } from './../../notifications/notifications.service';
import { Create } from "./create";
import { Router, ActivatedRoute } from "@angular/router";
import { DAOSubcollection } from "./dao-subcollection";
import { capitalize } from './methods';

export abstract class CreateSubcollection<T, S> extends Create<T>{
  selectedSubcollectionObjects: S[] = [];
  selectedSubcollectionObject: S;
  refresh: boolean;

  constructor(
    public service: DAOSubcollection<T, S>,
    public notifications: NotificationsService,
    public router: Router,
    public route: ActivatedRoute,
  ) {
    super(service, notifications, router, route);
  }

  onSubmit(form: NgForm) {
    const product: T = form.value;
    console.log(this.selectedSubcollectionObjects);
    return this.service
      .add(product, this.selectedSubcollectionObjects).then(
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

  addToSubcollection() {
    this.selectedSubcollectionObjects.push(this.selectedSubcollectionObject);
    this.selectedSubcollectionObject = null;
    this.refresh = !this.refresh;
  }

  removeFromSubcollection(id: string) {
    let index = this.selectedSubcollectionObjects.findIndex(product => product['id'] === id);
    this.selectedSubcollectionObjects.splice(index, 1);
    this.refresh = !this.refresh;
  }
}
