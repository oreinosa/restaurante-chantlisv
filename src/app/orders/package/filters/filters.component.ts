import { OnDestroy } from '@angular/core';
import { Order } from './../../../shared/models/order';
import { MatTableDataSource } from '@angular/material';
import { startWith, map, takeUntil, take, switchMap, tap } from 'rxjs/operators';
import { WorkplacesService } from './../../../admin/workplaces/workplaces.service';
import { FormControl } from '@angular/forms';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OrdersService } from '../../orders.service';
import { MONTHS } from '../../../shared/models/months';
import { DateRange } from './../../../shared/models/date-range';
import { Workplace } from './../../../shared/models/workplace';
import { User } from './../../../shared/models/user';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  today = new Date();
  months = MONTHS;

  workplaces: Workplace[];

  allUsers: User[];
  users: User[];

  filteredUsers: Observable<User[]>;

  rangeFrom = new Date();
  rangeTo = new Date();

  monthFilter: BehaviorSubject<number>;

  selectedUserCtrl: FormControl = new FormControl('');
  selectedWorkplace: string = 'TELUS';
  selectedMonth: number;
  selectedYear: number;
  includeCancelados: boolean;

  allOrders: Order[];
  filteredOrders: Order[];

  selectedRange = 'today';

  mode: string;

  payingUser: User;

  @Output('selectedRange') selectRangeEmitter = new EventEmitter<string>();


  constructor(
    private ordersService: OrdersService,
    private workplacesService: WorkplacesService,
  ) { }

  ngOnInit() {
    // this.today.setMonth(6);
    // this.today.setDate(9);

    let currentYear = this.today.getFullYear();
    let currentMonth = this.today.getMonth();
    this.selectedMonth = currentMonth;
    this.selectedYear = currentYear;

    this.ordersService.payingUser.pipe(
      takeUntil(this.ngUnsubscribe),
    )
      .subscribe(user => this.payingUser = user);

    this.ordersService
      .mode.pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(mode => this.mode = mode);

    this.ordersService
      .getUsers()
      .pipe(
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe(users => this.allUsers = users);

    this.workplacesService
      .getAll()
      .pipe(
        take(1),
        // tap(workplaces => this.selectedWorkplace = "TELUS")
      )
      .subscribe(workplaces => this.workplaces = workplaces);

    this.filteredUsers = this.selectedUserCtrl
      .valueChanges
      .pipe(
        startWith(''),
        map((user: any) => (typeof user === 'object' && user) ? user.name : user),
        map(user => user ? this.filterUsers(user) : this.users.slice())
      );

    this.monthFilter = new BehaviorSubject(currentMonth);

    this.monthFilter
      .pipe(
        takeUntil(this.ngUnsubscribe),
        map(month => {
          let dateRange: DateRange = {
            from: this.getFirstDayMonth(month),
            to: this.getLastDayMonth(month)
          };
          return dateRange;
        }),
        switchMap(({ from, to }) => this.ordersService.getOrders(from, to)),
        takeUntil(this.ngUnsubscribe),
        // tap(orders => console.log('Orders : ', orders))
      )
      .subscribe(orders => {
        this.allOrders = orders;
        this.applyFilters();
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  selectMonth() {
    let month = this.selectedMonth;
    this.monthFilter.next(month);
  }

  applyFilters() {
    this.filterByWorkplace();
    this.filterByUser();
    if (this.selectedMonth === this.today.getMonth()) {
      if (this.selectedRange)
        this.filterByDateRange();
    } else {
      let selectedRangeString = `Para el mes de ${this.months[this.selectedMonth]}`;
      this.selectRangeEmitter.emit(selectedRangeString);
    }
    this.filterByCancelado();
    this.ordersService.filterOrders(this.filteredOrders);
  }

  filterByWorkplace() {
    let workplace = this.selectedWorkplace;
    // console.log(`Filter by workplace : ${workplace}`);
    let orders = this.allOrders.slice();
    this.filteredOrders = orders.filter(order => order.user.workplace === workplace);
    let users = this.allUsers.slice();
    this.users = users.filter(user => user.workplace === workplace);
    this.selectedUserCtrl.setValue(this.selectedUserCtrl.value);
  }

  filterByUser() {
    let user = this.selectedUserCtrl.value;
    let id = user.id;
    if (id) {
      // console.log(`Filter by user : `, name);
      this.filteredOrders = this.filteredOrders.filter(order => order.user.id === id);
    }
  }

  displayUserFn(user?: User): string | undefined {
    return user ? user.name : undefined;
  }

  filterByDateRange() {
    let dateRange = this.selectedRange;

    let rangeString: string;
    // console.log(`Filter by dateRange : `, dateRange);

    switch (dateRange) {
      case "today":
        let from = new Date(this.today);
        from.setHours(0, 0, 0);
        this.rangeFrom = from;

        let to = new Date(this.today);
        to.setHours(22, 0, 0);
        this.rangeTo = to;

        rangeString = `Para ahora`;
        break;
      case "week":
        this.rangeFrom = this.getMonday();
        this.rangeTo = this.getFriday();
        rangeString = `Para la semana (${this.rangeFrom.toLocaleDateString()} al ${this.rangeTo.toLocaleDateString()})`;
        break;
      case "month":
        this.rangeFrom = this.getFirstDayMonth();
        this.rangeTo = this.getLastDayMonth();
        rangeString = `Para el mes`;
        break;
      case "specific":
        rangeString = `Desde ${this.rangeFrom.toLocaleDateString()} al ${this.rangeTo.toLocaleDateString()}`;
        break;
    }
    // console.log(from, to);
    this.filteredOrders = this.filteredOrders.filter(order => order.date.for.toDate() >= this.rangeFrom && order.date.for.toDate() <= this.rangeTo);
    this.selectRangeEmitter.emit(rangeString);
  }

  filterByCancelado() {
    if (!this.includeCancelados) {
      this.filteredOrders = this.filteredOrders.filter(order => {
        switch (order.status) {
          case 'Cancelado':
          case 'Cancelado (credito)':
          case 'Cancelado (reembolso)':
            return false;
        }
        return true;
      });
    }
  }

  private filterUsers(name: string): User[] {
    return this.users.filter(user =>
      user.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }


  private getMonday(): Date {
    let d = new Date(this.today);
    var day = d.getDay(),
      diff = d.getDate() - day + 1;
    if (day == 6) {
      diff += 7;
    }
    d.setDate(diff);
    d.setHours(1, 0, 0);
    console.log('Monday is ', d);
    return d;
  }

  private getFriday(): Date {
    let d = new Date(this.today);
    var day = d.getDay(),
      diff = d.getDate() - day + 5;
    if (day == 6) diff += 7;
    d.setDate(diff);
    d.setHours(23, 0, 0);
    console.log('Friday is ', d);
    return d;
  }

  getFirstDayMonth(month?: number): Date {
    let d = new Date(this.today);
    // month ? d.setMonth(month) : false;
    // d.setDate(1);
    let _month = month ? month : d.getMonth();
    let year = this.selectedYear;
    d.setFullYear(year, _month, 1);
    d.setHours(1, 0, 0);
    // console.log('First day of ', _month, ' is ', d);
    return d;
  }


  getLastDayMonth(month?: number): Date {
    let d = new Date(this.today);
    let _month = month ? month : d.getMonth();
    let year = this.selectedYear;
    d.setFullYear(year, _month + 1, 0);
    d.setHours(23, 0, 0);
    // console.log('Last day of ', _month, ' is ', d);
    return d;
  }


}
