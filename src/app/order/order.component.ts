import { AuthService } from './../auth/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntil, tap, switchMap, map, share, take } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from './order.service';
import { Menu } from './../shared/models/menu';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DOW } from '../shared/models/daysOfTheWeek';
import { User } from '../shared/models/user';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  menus: Menu[];
  selectedMenus: Menu[];
  DOW: string[];
  dow: number;

  $user: Observable<User>;

  monday: Date;
  friday: Date;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small])
    .pipe(
      map(result => result.matches),
    // share()
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
  ) {
    this.DOW = DOW.map(dow => dow.toLowerCase()).filter(dow => !(dow == "domingo" || dow == "sábado"))
  }

  ngOnInit() {
    this.$user = this.auth.user;

    this.orderService.getWeekMenus().pipe(
      takeUntil(this.ngUnsubscribe),
      tap(data => {
        this.menus = data;
        this.monday = this.orderService.monday;
        this.friday = this.orderService.friday;
      }),
      switchMap(() => this.orderService.selectedDow),
      takeUntil(this.ngUnsubscribe))
      .subscribe(dow => {
        this.dow = dow;
        this.selectedMenus = this.menus.filter(menu => menu.date.toDate().getDay() === this.dow);
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSelectDay(dow: number) {
    this.orderService.setSelectedDow(dow);
    this.selectedMenus = this.menus.filter(menu => menu.date.toDate().getDay() === this.dow);
  }

  onOrderMenu(menu: Menu) {
    this.router.navigate(['nueva-orden', menu.id, 'paso', 1]);
  }
}
