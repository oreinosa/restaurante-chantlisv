import { takeUntil, tap, filter, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { OnInit, OnDestroy } from '@angular/core';
import { Order } from './../shared/models/order';
import { MyOrdersService } from './my-orders.service';
import { Router } from '@angular/router/src/router';

export abstract class MyOrder implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject();
  order: Order;

  constructor(
    public myOrdersService: MyOrdersService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.myOrdersService.action.pipe(
      takeUntil(this.ngUnsubscribe),
      tap(order => !!order ? false : this.onBack()),
      filter(order => !!order),
    )
      .subscribe(order => this.order = order);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  abstract onSubmit(...args): void;

  onCancel(): void {
    this.myOrdersService.onAction(null);
    this.onBack();
  }

  onBack(): void {
    this.router.navigate(['mis-ordenes']);
  }
}
