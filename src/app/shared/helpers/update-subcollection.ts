import { NgForm } from '@angular/forms';
import { Update } from "./update";
import { Router, ActivatedRoute } from "@angular/router";
import { DAOSubcollection } from "./dao-subcollection";
import { OnInit, OnDestroy } from "@angular/core";
import { takeUntil, tap, filter, switchMap, map } from "rxjs/operators";
import { NotificationsService } from "../../notifications/notifications.service";
import { capitalize } from './methods';

export class UpdateSubcollection<T, S> extends Update<T> implements OnInit, OnDestroy {
  refresh: boolean;

  selectedSubcollectionObjects: S[] = [];
  deletedSubcollectionObjects: S[] = [];
  selectedSubcollectionObject: S;

  constructor(
    public service: DAOSubcollection<T, S>,
    public notifications: NotificationsService,
    public router: Router,
    public route: ActivatedRoute,
  ) {
    super(service, notifications, router, route)
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(
        takeUntil(this.ngUnsubscribe),
        map(params => params.get("id")),
        tap(id => {
          this.id = id;
          if (id === null || !(id as string)) {
            this.router.navigate(["../"], { relativeTo: this.route });
          }
        }),
        filter(id => !!id),
        switchMap(
          id =>
            this.service.isObjectSelected()
              ? this.service.getSelectedObject()
              : this.service.one(id)
        ),
        takeUntil(this.ngUnsubscribe)
        , tap(object => console.log(object)),
        tap(object => (this.object = object)),
        switchMap(() => this.service.getSubcollection(this.object['id'])),
        takeUntil(this.ngUnsubscribe),
        tap((subCollection: S[]) => console.log(subCollection))
      )
      .subscribe((subCollection: S[]) => this.object[this.service.subCollectionName] = subCollection.slice());
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit(form: NgForm): Promise<void> {
    const object: T = form.value;
    return this.service
      .update(this.object['id'], object, this.selectedSubcollectionObjects, this.deletedSubcollectionObjects).then(
        () => {
          this.notifications.show(
            `${capitalize(this.service.className)} actualizado`,
            capitalize(this.service.collectionName),
            "success"
          );
          this.router.navigate(["../../"], { relativeTo: this.route });
        },
        (e) => {
          this.notifications.show(e.error, capitalize(this.service.collectionName), "danger");
          form.resetForm(object);
        }
      );
  }

  addToSubcollection() {
    this.selectedSubcollectionObjects.push(this.selectedSubcollectionObject);
    this.selectedSubcollectionObject = null;
    this.refresh = !this.refresh;
  }

  removeFromSubcollection(id: string) {
    let subcollectionName = this.service.subCollectionName;
    let objectSubcollection = this.object[subcollectionName];
    let index = objectSubcollection.findIndex(product => product.id === id);
    if (index >= 0) {
      let removedProduct = objectSubcollection[index];
      // console.log(`Removed ${removedProduct['name']}(id: ${removedProduct['id']}) (index : ${index} from object`);
      this.deletedSubcollectionObjects.push(removedProduct);
      objectSubcollection.splice(index, 1);
    }
    index = this.selectedSubcollectionObjects.findIndex(product => product['id'] === id);
    if (index >= 0) {
      let removedProduct = this.selectedSubcollectionObjects[index];
      // console.log(`Removed ${removedProduct['name']}(id: ${removedProduct['id']}) (index : ${index} from selected`);
      this.selectedSubcollectionObjects.splice(index, 1);
    }
    this.refresh = !this.refresh;
  }
}
