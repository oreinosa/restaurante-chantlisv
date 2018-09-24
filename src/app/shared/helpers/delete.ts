import { Router, ActivatedRoute } from "@angular/router";
import { OnInit, OnDestroy } from "@angular/core";
import { map, tap, filter, takeUntil } from "rxjs/operators";
import { NotificationsService } from "../../notifications/notifications.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Subject } from "rxjs";
import { DAO } from "./dao";

export class Delete<T> implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  id: number;
  constructor(
    public service: DAO<T>,
    public notifications: NotificationsService,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        takeUntil(this.ngUnsubscribe),
        map(params => +params.get("id")),
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
    this.service.delete(this.id).subscribe(
      () => {
        this.notifications.show(
          `${this.service.className} eliminado`,
          this.service.collectionName,
          "success"
        );
      },
      (e: HttpErrorResponse) => {
        this.notifications.show(e.error, this.service.collectionName, "danger");
      },
      () => this.router.navigate(["../../"], { relativeTo: this.route })
    );
  }
}
