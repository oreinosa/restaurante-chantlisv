import { ConfirmStatusChangeComponent } from './confirm-status-change/confirm-status-change.component';
import { OnDestroy } from '@angular/core';
import { OrdersService } from './../orders.service';
import { Order } from './../../shared/models/order';
import { Subject } from 'rxjs';
import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { tap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.scss', '../../admin/admin-table.css']
})
export class PackageComponent implements OnInit, AfterViewInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  orders: Order[];
  @Input() dataSource = new MatTableDataSource<Order>([]);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  range: string;

  public displayedColumns = ['user', 'principal', 'acompanamientos', 'bebida', "date", 'actions'];

  constructor(
    private ordersService: OrdersService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.ordersService
      .filteredOrders
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(orders => console.log(orders)),
        tap(orders => this.orders = orders)
      )
      .subscribe(orders => this.sortData());
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSelectRange(range: string) {
    this.range = range;
    if (range === "Para ahora") {
      this.displayedColumns = ['user', 'principal', 'acompanamientos', 'bebida', 'actions'];
    } else {
      this.displayedColumns = ['user', 'principal', 'acompanamientos', 'bebida', 'date', 'actions'];
    }
  }

  sortData() {
    // console.log('sort data');
    const data = this.orders.slice();
    if (!this.sort.active || this.sort.direction == '') {
      this.dataSource.data = data;
      return;
    }
    // console.log(this.sort.active);
    this.dataSource.data = data.sort((a, b) => {
      let isAsc = this.sort.direction == 'asc';
      switch (this.sort.active) {
        case 'user': return this.compare(a.user.name, b.user.name, isAsc);
        case 'principal': case 'bebida': return this.compare(a.products[this.sort.active], b.products[this.sort.active], isAsc);
        case 'date': return this.compare(a.date.for, b.date.for, isAsc);
        default: return 0;
      }
    });
  }

  compare(a, b, isAsc) {
    // console.log(a, 'vs', b)
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  onUpdateStatus(order: Order, newStatus: string) {
    const dialogRef = this.dialog.open(ConfirmStatusChangeComponent, {
      width: '350px',
      data: {
        newStatus: newStatus,
        order: order
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        switch (newStatus) {
          case "Cancelado":
          case "Cancelado (reembolso)":
          case "Cancelado (credito)":
            this.ordersService.cancelOrder(order, newStatus);
            break;
          default:
            this.ordersService.updateOrderstatus(order, newStatus);
        }
      }
    });

  }

}
