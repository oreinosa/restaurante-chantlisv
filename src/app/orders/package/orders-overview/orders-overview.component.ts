import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { OrdersService } from './../../orders.service';
import { Order } from './../../../shared/models/order';
import { Component, OnInit, Input } from '@angular/core';

interface Count {
  label?: string;
  amount?: number;
}

@Component({
  selector: 'app-orders-overview',
  templateUrl: './orders-overview.component.html',
  styleUrls: ['./orders-overview.component.css']
})
export class OrdersOverviewComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  orders: Order[];
  principales: Count[] = [];
  acompanamientos: Count[] = [];
  bebidas: Count[] = [];
  statuses: Count[] = [];
  tortillas: number = 0;

  $loading: boolean = true;
  constructor(
    private ordersService: OrdersService
  ) { }

  ngOnInit() {
    this.ordersService
      .filteredOrders
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(orders => {
          this.$loading = true;
          this.initOverview();
          this.orders = orders;
          // console.log(orders);
          this.generateOverview();
        }),
    )
      .subscribe(orders => this.$loading = false);
  }

  initOverview(): void {
    this.tortillas = 0;
    this.principales = [];
    this.acompanamientos = [];
    this.bebidas = [];
    this.statuses = [
      { label: 'Nueva orden', amount: 0 },
      { label: 'Empacado', amount: 0 },
      { label: 'Entregado', amount: 0 },
      { label: 'Cancelado', amount: 0 },
      { label: 'Cancelado (credito)', amount: 0 },
      { label: 'Cancelado (reembolso)', amount: 0 },
    ];
  }

  generateOverview(): void {
    if (this.orders) {
      if (this.orders.length) {

        let products, bebida: string, principal: string, acompanamientos: string[], status: string;
        let bebidaIndex: number, principalIndex: number, acompanamientosIndex: number, statusIndex: number;

        for (let order of this.orders) {
          status = order.status;

          statusIndex = this.statuses.findIndex((count: Count) => count.label === status);
          if (statusIndex < 0) {
            this.statuses.push({
              label: status,
              amount: 1
            });
          } else {
            ++this.statuses[statusIndex].amount;
          }


          // TORTILLAS SUM  
          this.tortillas += order.tortillas ? order.tortillas : 0;

          // PRINCIPALES, BEBIDA, AND ACOMPANAMIENTOS LABELS
          products = order.products;
          principal = products.principal as string;

          principalIndex = this.principales.findIndex((Count: Count) => Count.label === principal);
          if (principalIndex < 0) {
            this.principales.push({
              label: principal,
              amount: 1
            });
          } else {
            this.principales[principalIndex].amount = ++this.principales[principalIndex].amount;
          }

          bebida = products.bebida as string;
          bebidaIndex = this.bebidas.findIndex((Count: Count) => Count.label === bebida);
          if (bebidaIndex < 0) {
            this.bebidas.push({
              label: bebida,
              amount: 1
            });
          } else {
            this.bebidas[bebidaIndex].amount = ++this.bebidas[bebidaIndex].amount;
          }


          acompanamientos = products.acompanamientos as string[];
          if (acompanamientos) {
            for (let ac of acompanamientos) {
              acompanamientosIndex = this.acompanamientos.findIndex((Count: Count) => Count.label === ac);
              if (acompanamientosIndex < 0) {
                this.acompanamientos.push({
                  label: ac,
                  amount: 1
                });
              } else {
                this.acompanamientos[acompanamientosIndex].amount = ++this.acompanamientos[acompanamientosIndex].amount;
              }
            }
          }
        }
      }
    }
  }



}