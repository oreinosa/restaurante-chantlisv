import { Router, ActivatedRoute } from "@angular/router";
import { OnInit, OnDestroy } from "@angular/core";
import { map, tap, filter, takeUntil } from "rxjs/operators";
import { NotificationsService } from "../../notifications/notifications.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Subject } from "rxjs";
import { DAO } from "./dao";
import { capitalize } from "./capitalize";

export class Delete<T> implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
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
        tap(
          id =>
            !!id
              ? false
              : this.router.navigate(["../"], { relativeTo: this.route })
        ),
        filter(id => !!id)
      )
      .subscribe(id => (this.id = id));
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit() {
    this.service.delete(this.id).then(
      () => {
        this.notifications.show(
          `${capitalize(this.service.className)} eliminado`,
          capitalize(this.service.collectionName),
          "success"
        );
        this.router.navigate(["../../"], { relativeTo: this.route });
      },
      (e: HttpErrorResponse) => {
        this.notifications.show(e.error, capitalize(this.service.collectionName), "danger");
      }
    );
  }
}
