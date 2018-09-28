import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Order } from '../../shared/models/order';
import { BehaviorSubject, Subject } from 'rxjs';
import { User } from '../../shared/models/user';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { MyOrdersService } from '../my-orders.service';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from '../../notifications/notifications.service';
import { takeUntil, tap, switchMap, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.scss', '../../admin/admin-table.css']
})
export class ListOrderComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  dataSource = new MatTableDataSource<Order>();
  displayedColumns = ["products", "date", "price", "status", "paid", "actions"]
  loaded = false;

  user: User;
  limitSubject: BehaviorSubject<number>;
  limits: number[] = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  showList: boolean = true;

  constructor(
    private myOrdersService: MyOrdersService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notifications: NotificationsService
  ) {
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.limits = [5, 10, 30];
    this.limitSubject = new BehaviorSubject<number>(10)

    this.auth
      .user.pipe(
        takeUntil(this.ngUnsubscribe),
        filter(user => !!user),
        tap(user => {
          // console.log(user);
          this.user = user;
        }),
        switchMap(() => this.limitSubject),
        takeUntil(this.ngUnsubscribe),
        tap(limit => {
          console.log('limit to ', limit);
          this.loaded = false;
        }),
        switchMap(limit => this.myOrdersService.getMyOrders(limit, this.user)),
        takeUntil(this.ngUnsubscribe),
        map(orders => orders
          .sort((a, b) => this.compare(a.date.by.toDate(), b.date.by.toDate(), false))
          .sort((a, b) => this.compare(a.date.for.toDate(), b.date.for.toDate(), false))
        ),
        tap(orders => {
          console.log(orders);
          if (this.dataSource.data.length) { this.notifications.show("Lista de órdenes actualizada!", "Mis órdenes", "info") }
          this.dataSource.data = orders;
          this.myOrdersService.onAction(null);
        })
      )
      .subscribe(() => this.loaded = true);
  }

  private compare(a, b, isAsc) {
    if (a == b) {
      return 0;
    }
    return (a < b ? -1 : 1) * (isAsc ? 1 : - 1);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSelectLimit(limit: number) {
    this.limitSubject.next(limit);
  }

  onAction(name: string, object: Order) {
    this.myOrdersService.onAction(object);
    console.log('action ', name);
    this.router.navigate([name, object.id], { relativeTo: this.route });
  }

}
