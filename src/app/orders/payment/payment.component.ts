import { Observable, Subject, of } from 'rxjs';
import { OrdersService } from './../orders.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Component, OnInit, AfterViewInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { takeUntil, tap, map, filter, switchMap, take, startWith } from 'rxjs/operators';
import { WorkplacesService } from 'src/app/admin/workplaces/workplaces.service';
import { User } from './../../shared/models/user';
import { Order } from './../../shared/models/order';
import { FormControl } from '@angular/forms';
import { Workplace } from '../../shared/models/workplace';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, AfterViewInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @Input() dataSource = new MatTableDataSource<Order>([]);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  selection = new SelectionModel<Order>(true, []);
  refresh: boolean;
  public displayedColumns = ['select', 'price', "date", 'actions'];

  payingUser: User;
  paying: boolean;

  totalDue: number = 0; // total due (sum of selected missing payments)
  payment: number = 0; // amount paid by the user
  usedCredit: number = 0; // credit used to pay
  change: number = 0; // remaining of totalDue - payment - usedCredit

  addChangeCtrl: FormControl = new FormControl(false); // add change flag 

  workplaces: Workplace[]; // all workplaces from app
  selectedWorkplaceCtrl: FormControl = new FormControl('TELUS'); // selected workplace 

  selectedUserCtrl = new FormControl(); // selected paying user
  usersByWorkplace: User[] = []; // list of users from the selected workplace 
  allUsers: User[] = []; // all users from the app
  filteredUsers: Observable<User[]>; // users shown in the autocomplete component

  allFromWorkplace: boolean = false;

  constructor(
    private ordersService: OrdersService,
    private workplacesService: WorkplacesService
  ) { }

  ngOnInit() {

    this.workplacesService.getAll().pipe(
      take(1))
      .subscribe(workplaces => this.workplaces = workplaces);

    this.filteredUsers = this.ordersService.getUsers().pipe(
      takeUntil(this.ngUnsubscribe),
      tap(users => {
        // console.log(users);
        this.allUsers = users;
        this.filterByWorkplace(this.selectedWorkplaceCtrl.value);
        if (this.payingUser) {
          const updatedUser = users.find(user => user.id === this.payingUser.id);
          const oldCredit = this.payingUser.credit;
          const oldDebit = this.payingUser.debit;
          const newCredit = updatedUser.credit;
          const newDebit = updatedUser.debit;

          if (newCredit !== oldCredit || newDebit !== oldDebit) {
            console.log('updating ', this.payingUser.name, ' balance ');
            this.selectPayingUser(updatedUser);
          }
        };
      }),
      switchMap(() => this.selectedUserCtrl.valueChanges),
      map((user: any) => (typeof user === 'object' && user) ? user.name : user),
      map((user: string) => user ? this.filterUsers(user) : this.usersByWorkplace.slice()),
      // tap(users => console.log(users))
    );

    this.ordersService
      .payingUser.pipe(
        takeUntil(this.ngUnsubscribe),
        tap(user => {
          console.log('paying user ', user);
          this.payingUser = user;
          if (this.dataSource.data.length) this.dataSource.data = [];
          this.addChangeCtrl.setValue(false);
          this.totalDue = 0;
          this.payment = 0;
          this.change = 0;
          this.selection.clear();
        }),
        filter(() => (!!this.payingUser || (!this.payingUser && this.allFromWorkplace))),
        switchMap(user => user ? this.ordersService.getOrdersByUser(user.id) : this.ordersService.getOrdersByWorkplace(this.selectedWorkplaceCtrl.value)),
        tap(orders => console.log(orders)),
        map(orders => orders.filter(order => {
          if (order.paid.flag) { return false; }
          switch (order.status) {
            case 'Cancelado':
            case 'Cancelado (reembolso)':
            case 'Cancelado (credito)':
              return false;
          }
          return true;
        })),
        // map(orders => orders.filter(order => !order.paid.flag)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(orders => this.dataSource.data = orders);
    // .subscribe(orders => this.dataSource.data = (this.payingUser || (!this.payingUser && this.allFromWorkplace)) ? orders : []);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  displayFn(user?: User): string | undefined {
    return user ? user.name : undefined;
  }

  selectPayingUser(user: User) {
    // console.log('Paying user ', user);
    this.ordersService.setPayingUser(user);
  }

  filterByWorkplace(workplace: string) {
    // console.log('filter users by workplace ', workplace);
    this.usersByWorkplace = this.allUsers.filter(user => user.workplace === workplace);
    // console.log(this.usersByWorkplace);
    // this.selectedUserCtrl.setValue(this.selectedUserCtrl.value);
  }

  private filterUsers(name: string): User[] {
    // console.log('filtering from ', this.usersByWorkplace);
    return this.usersByWorkplace.filter(user =>
      user.name.toLowerCase().includes(name.toLowerCase()));
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  onPay() {
    this.paying = true;
    let selectedOrders: Order[] = this.selection.selected;
    let currentCredit = this.payingUser.credit;
    let newCredit = currentCredit;
    if (currentCredit < this.totalDue) {
      if (this.addChangeCtrl.value) {
        newCredit = this.change;
      } else {
        newCredit = 0;
      }
    } else {
      newCredit -= this.totalDue;
    }

    // let newCredit = this.payingUser.credit;
    // if (newCredit < this.totalDue && !this.addChange) {
    //   console.log('Remaining credit ', this.change);
    //   newCredit = this.change;
    // } else if (newCredit <= 0 && this.addChange) {
    //   newCredit += this.change;
    // }
    let currentDebit: number = this.payingUser.debit;
    let newDebit = currentDebit - this.totalDue;
    console.log(newDebit);
    console.log(newCredit);
    return this.ordersService
      .payOrders(selectedOrders)
      .then(() => this.ordersService.updateBalance(this.payingUser.id, newDebit, newCredit))
      .then(() => {
        this.paying = false;
        this.addChangeCtrl.setValue(false);
        this.totalDue = 0;
        this.payment = 0;
        this.change = 0;
        this.selection.clear();
      });
  }

  calculateTotalDue() {
    let orders = this.selection.selected.slice();
    let total = 0;
    for (let order of orders) {
      total += order.price;
    }
    this.totalDue = total;
    if (this.totalDue <= this.payingUser.credit) { this.payment = 0; }
  }

  calculateChange() {
    const sum = (this.payment + this.payingUser.credit) - this.totalDue;
    const sumString = sum.toFixed(2);
    const sumFloat = parseFloat(sumString);
    if (sumFloat <= 0) this.change = 0
    else this.change = sumFloat;
  }

  selectAllFromWorkplace(flag: boolean) {
    this.allFromWorkplace = !flag;
    if (this.allFromWorkplace) {
      if (this.selectedUserCtrl.value) this.selectedUserCtrl.setValue('');
      if (this.selectedUserCtrl.enabled) this.selectedUserCtrl.disable();
      this.displayedColumns = ['user', 'price', "date", 'actions'];
    } else {
      if (this.selectedUserCtrl.disabled) this.selectedUserCtrl.enable();
      this.displayedColumns = ['select', 'price', "date", 'actions'];
    }
    this.selectPayingUser(null);
  }

}
