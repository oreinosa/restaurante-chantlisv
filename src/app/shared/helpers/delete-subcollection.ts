import { NotificationsService } from './../../notifications/notifications.service';
import { Delete } from "./delete";
import { DAOSubcollection } from "./dao-subcollection";
import { Router, ActivatedRoute } from "@angular/router";
import { takeUntil, tap, filter, switchMap } from "rxjs/operators";

export class DeleteSubcollection<T, S> extends Delete<T> {
  subCollection: S[];

  constructor(
    public service: DAOSubcollection<T, S>,
    public notifications: NotificationsService,
    public router: Router,
    public route: ActivatedRoute,
  ) {
    super(service, notifications, router, route)
  }

  ngOnInit() {
    this.service
      .object
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(object => !!object),
        tap(object => object ? false : this.router.navigate(['../','../'])),
        tap(object => this.id = object['id']),
        switchMap(() => this.service.getSubcollection(this.id)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(subCollection => this.subCollection = subCollection);
  }

  onSubmit() {
    return this.service
      .delete(this.id, this.subCollection)
      .then(flag => this.router.navigate(['../','../']))
  }
}
