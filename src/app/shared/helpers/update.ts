import { OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { map, filter, tap, switchMap, takeUntil } from "rxjs/operators";
import { Subject, BehaviorSubject } from "rxjs";
import { NgForm } from "@angular/forms";
import { NotificationsService } from "../../notifications/notifications.service";
import { DAO } from "./dao";
import { capitalize } from "./capitalize";

export class Update<T> implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject();
  object: T;
  id: string;

  constructor(
    public service: DAO<T>,
    public notifications: NotificationsService,
    public router: Router,
    public route: ActivatedRoute
  ) { }

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
        , tap(object => console.log(object))
      )
      .subscribe(object => (this.object = object));
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit(form: NgForm) {
    const object: T = form.value;
    this.service.update(this.id, object).then(
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
}
