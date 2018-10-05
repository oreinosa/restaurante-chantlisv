import { AuthService } from './../../auth/auth.service';
import { NewOrder } from './../../shared/models/new-order';
import { OrderService } from './../../order/order.service';
import { Menu } from './../../shared/models/menu';
import { Observable } from 'rxjs';
import { Order } from 'src/app/shared/models/order';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MyOrdersService } from './../my-orders.service';
import { MyOrder } from '../my-order';
import { tap, map, filter, switchMap, takeUntil } from 'rxjs/operators';
import { Product } from '../../shared/models/product';

import * as firebaseApp from 'firebase/app';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css']
})
export class EditOrderComponent extends MyOrder {
  $menus: Observable<Menu[]>;
  step: number = 0;
  selectedMenu: Menu;
  editingOrder: NewOrder;

  user: User;

  constructor(
    private orderService: OrderService,
    public myOrdersService: MyOrdersService,
    public router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {
    super(myOrdersService, router);
  }

  ngOnInit() {
    this.auth.user.pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe(user => this.user = user);

    this.route.paramMap.pipe(
      takeUntil(this.ngUnsubscribe),
      map(paramMap => +paramMap.get('step')),
      tap(step => console.log('Step ', step)))
      .subscribe(step => this.step = step);

    this.$menus = this.myOrdersService.action.pipe(
      takeUntil(this.ngUnsubscribe),
      // tap(action => console.log(action)),
      tap(order => !!order ? false : this.onBack()),
      filter(order => !!order),
      tap(order => this.order = order),
      map(order => order.date.for.toDate()),
      switchMap(day => this.orderService.getMenusByDay(day)),
    );

    this.editingOrder = new NewOrder({ principal: null, acompanamientos: [], bebida: null });
  }

  onOrderMenu(menu: Menu) {
    this.selectedMenu = menu;
    this.router.navigate(['../', 1], { relativeTo: this.route });
  }

  onSelect(principal: Product, acompanamientos: Product[]) {
    this.editingOrder.products.principal = principal;
    this.editingOrder.products.acompanamientos = acompanamientos;
    this.router.navigate(['../', 2], { relativeTo: this.route });
  }

  onSelectBebida(bebida: Product) {
    this.editingOrder.products.bebida = bebida;
    this.router.navigate(['../', 3], { relativeTo: this.route });
  }

  onSubmit(tortillas: number, price: number) {
    let products = this.editingOrder.products;
    let orderedBy = firebaseApp.firestore.Timestamp.fromDate(new Date());
    // orderedBy.setUTCHours(12, 0, 0);

    let editedOrder: Order = {
      products: {
        principal: products.principal.name,
      },
      price: price,
      updated: orderedBy
    };

    if (products.principal.noSides) {
      delete editedOrder.products.acompanamientos;
    } else {
      if (products.acompanamientos) {
        let acompanamientos: string[] = products.acompanamientos.map(product => product.name);
        editedOrder.products.acompanamientos = acompanamientos;
      }
    }

    if (products.principal.noTortillas === true) {
      delete editedOrder.tortillas;
    } else {
      editedOrder.tortillas = tortillas;
    }

    if (products.bebida) {
      editedOrder.products.bebida = products.bebida.name;
    }


    let updatedUser: User;
    let previousPrice = this.order.price;
    if (previousPrice !== price) {
      updatedUser = {
        id: this.user.id,
        credit: this.user.credit,
        debit: this.user.debit
      };
      let difference = (previousPrice - price);
      difference = parseFloat(difference.toFixed(2));

      if (difference > 0 || (difference < 0 && this.user.credit >= Math.abs(difference))) {
        console.log(difference);
        if (this.order.paid.flag) updatedUser.credit += difference;
        else updatedUser.debit -= difference;
      } else {
        updatedUser.debit -= difference;
      }
    }

    this.myOrdersService.editOrder(this.order.id, editedOrder, updatedUser)
      .then(() => this.onCancel());

  }

}