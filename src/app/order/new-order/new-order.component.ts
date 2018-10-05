import * as firebaseApp from 'firebase/app';
import { Product } from './../../shared/models/product';
import { NewOrder } from './../../shared/models/new-order';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../order.service';
import { Subject } from 'rxjs';
import { Menu } from '../../shared/models/menu';
import { Order } from '../../shared/models/order';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../shared/models/user';
import { NotificationsService } from '../../notifications/notifications.service';
import { take, tap, takeUntil, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  newOrder: NewOrder;
  step: number = 1;
  menu: Menu;
  user: User;

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.newOrder = new NewOrder({ principal: null, acompanamientos: [], bebida: null });

    this.authService
      .user
      .subscribe(user => this.user = user);

    this.route
      .paramMap
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(params => this.step = +params.get("step")),
        switchMap(params => this.orderService.getMenu(params.get('id'))),
        tap(menu => !!menu ? false : this.router.navigate(['menu']))
      )
      .subscribe(menu => {
        this.menu = menu;
        switch (this.step) {
          case 2:
          case 3:
          case 4:
            if (!this.newOrder.products.principal) {
              this.router.navigate(['nueva-orden', this.menu.id, 'paso', 1]);
            }
            break;
        }
      });

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSelect(principal: Product, acompanamientos: Product[]) {
    this.newOrder.products.principal = principal;
    this.newOrder.products.acompanamientos = acompanamientos;
    this.router.navigate(['../', 2], { relativeTo: this.route });
  }

  onSelectBebida(bebida: Product) {
    this.newOrder.products.bebida = bebida;
    this.router.navigate(['../', 3], { relativeTo: this.route });
  }

  onConfirm(tortillas: number, price: number) {
    let orderedBy = firebaseApp.firestore.Timestamp.fromDate(new Date());
    // orderedBy.setUTCHours(12, 0, 0);
    let products = this.newOrder.products;
    let order: Order = {
      products: {
        principal: products.principal.name
      },
      tortillas: tortillas,
      price: price,
      date: {
        for: this.menu.date,
        by: orderedBy
      },
      status: "Nueva orden",
      user: {
        id: this.user.id,
        name: this.user.name,
        workplace: this.user.workplace,
      },
      paid: {
        flag: false
      }
    };
    if (products.acompanamientos) {
      let acompanamientos: string[] = products.acompanamientos.map(product => product.name);
      order.products.acompanamientos = acompanamientos;
    }
    let bebida = products.bebida;
    if (bebida) {
      order.products.bebida = bebida.name;
    }

    if (products.principal.noSides) {
      delete order.products.acompanamientos;
    }

    if (products.principal.noTortillas) {
      delete order.tortillas;
    }

    // if (this.user.credit) {
    //   if (this.user.credit >= price) {
    //     order.paid = {
    //       flag: true,
    //       by: orderedBy
    //     }
    //   }
    // }

    this.orderService
      .submitNewOrder(order)
      .then(() => this.router.navigate(['menu']));
  }

}
