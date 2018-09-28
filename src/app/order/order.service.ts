import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Menu } from '../shared/models/menu';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Product } from '../shared/models/product';
import { Order } from '../shared/models/order';
import { NotificationsService } from '../notifications/notifications.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: "root"
})
export class OrderService {
  private menusCol: AngularFirestoreCollection<Menu>;
  private menuDoc: AngularFirestoreDocument<Menu>;
  private bebidasCol: AngularFirestoreCollection<Product>;
  private ordersCol: AngularFirestoreCollection<Order>;
  // menuSubject = new BehaviorSubject<Menu>(null);

  private $selectedDow: BehaviorSubject<number>;

  private today: Date;

  private $monday: Date;
  private $friday: Date;

  constructor(
    private af: AngularFirestore,
    private notificationsService: NotificationsService,
    private router: Router
  ) {
    this.today = new Date();

    let day = this.today.getDay();
    // d.setMonth(1);
    // d.setDate(8);
    console.log('today is ', this.today);
    if (day === 0 || day === 6) {
      day = 1;
    }

    this.$monday = this.getMonday(this.today);
    this.$friday = this.getFriday(this.today);

    this.$selectedDow = new BehaviorSubject<number>(day);

    this.menusCol = this.af.collection<Menu>('menus');
  }

  get selectedDow(): Observable<number> {
    return this.$selectedDow.asObservable();
  }

  setSelectedDow(dow: number) {
    this.$selectedDow.next(dow);
  }

  get monday(): Date {
    return this.$monday;
  }
  get friday(): Date {
    return this.$friday;
  }

  submitNewOrder(order: Order) {
    this.ordersCol = this.af.collection<Order>('orders');
    return this.ordersCol
      .add(order)
      .then(doc => this.notificationsService.show("Orden exitosa!", 'Nueva orden', "success"));
  }

  getMenus(from: Date, to: Date) {
    this.menusCol = this.af.collection<Menu>('menus',
      ref =>
        ref
          .where('date', '>=', from)
          .where('date', '<=', to)
    );

    return this.menusCol
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            let data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data } as Menu;
          });
        })
      );
  }

  getWeekMenus(): Observable<Menu[]> {
    return this.getMenus(this.$monday, this.$friday);
  }

  getMenusByDay(date: Date) {
    let from = new Date(date);
    let to = new Date(date);
    from.setHours(1, 0, 0);
    to.setHours(23, 0, 0);
    return this.getMenus(from, to);
  }

  getMenu(id: string) {
    this.menuDoc = this.menusCol.doc(id);
    return this.menuDoc.valueChanges().pipe(
      map(menu => {
        menu.id = id;
        return menu;
      }));
  }

  getBebidas() {
    this.bebidasCol = this.af.collection('productos', ref => ref.where('category', '==', 'Bebida'));
    return this.bebidasCol
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data } as Product;
          });
        })
      );
  }

  private getMonday(d: Date): Date {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + 1;
    if (day == 6) diff += 7;
    d.setDate(diff);
    d.setHours(0, 0, 0);
    console.log(d);
    return new Date(d);
  }

  private getFriday(d: Date): Date {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + 5;
    if (day == 6) diff += 7;

    d.setDate(diff);
    d.setHours(23, 0, 0);
    console.log(d);
    return new Date(d);
  }

}
