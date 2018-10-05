import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { User } from '../shared/models/user';
import { Order } from './../shared/models/order';
import * as firebaseApp from 'firebase/app';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {

  private ordersCol: AngularFirestoreCollection<Order>;
  private orderDoc: AngularFirestoreDocument<Order>;

  private usersCol: AngularFirestoreCollection<User>;
  private userDoc: AngularFirestoreDocument<User>;

  filteredOrders = new BehaviorSubject<Order[]>([]);

  private $payingUser = new Subject<User>();

  private $mode = new BehaviorSubject<string>('empacar');

  constructor(
    private fs: AngularFirestore,
    private functions: AngularFireFunctions,
    private notifications: NotificationsService,
  ) {
    // let date = new Date();
    // let firstDayOfYear = new Date();
    this.ordersCol = this.fs.collection<Order>('orders');
    this.usersCol = this.fs.collection<User>('users', ref => ref.orderBy('name', 'asc'));
  }

  onSelectMode(mode: string): void {
    this.$mode.next(mode);
  }

  get mode(): Observable<string> {
    return this.$mode.asObservable();
  }

  filterOrders(orders: Order[]) {
    this.filteredOrders.next(orders);
  }

  get payingUser(): Observable<User> {
    return this.$payingUser.asObservable();
  }

  setPayingUser(user: User) {
    this.$payingUser.next(user);
  }

  getUsers() {
    return this.usersCol
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data } as User;
          });
        })
      );
  }

  getOrders(from?: Date, to?: Date) {
    if (from && to) {
      this.ordersCol = this.fs.collection<Order>('orders', ref =>
        ref
          // .orderBy('date.by', 'desc')
          .where('date.for', ">=", from)
          .where('date.for', "<=", to)
      );
    } else {
      this.ordersCol = this.fs.collection<Order>('orders', ref =>
        ref
        // .orderBy('date.for', 'desc')
        // .orderBy('products.principal', 'desc')
      );
    }
    return this.ordersCol
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            let data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data } as Order;
          })
        }),
        map(orders => orders.sort((a, b) => this.compare(a.date.by, b.date.by, false)))
      );
  }

  getOrdersByUser(id: string) {
    this.ordersCol = this.fs.collection<Order>('orders', ref => ref.where('user.id', '==', id).where('paid.flag', '==', false));

    return this.ordersCol
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            let data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data } as Order;
          })
        })
      );
  }


  getOrdersByWorkplace(workplace: string) {
    this.ordersCol = this.fs.collection<Order>('orders', ref => ref.where('user.workplace', '==', workplace).where('paid.flag', '==', false));

    return this.ordersCol
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            let data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data } as Order;
          })
        }));
  }

  private compare(a, b, isAsc) {
    if (a == b) {
      return 0;
    }
    return (a < b ? -1 : 1) * (isAsc ? 1 : - 1);
  }


  updateOrderstatus(order: Order, newStatus: string) {
    console.log(order, ' set to ', newStatus);
    order.status = newStatus;
    return this.ordersCol.doc<Order>(order.id)
      .update(order)
      .then(() => this.notifications.show(`Orden actualizada a ${newStatus}`, 'Órdenes', 'info'));
  }

  cancelOrder(order: Order, cancelStatus: string) {
    if (order.paid.flag) {
      order.paid = firebaseApp.firestore.FieldValue.delete() as any;
    }
    order.cancelled = firebaseApp.firestore.Timestamp.fromDate(new Date());
    if (cancelStatus !== "Cancelado (reembolso)") {
      this.functions.httpsCallable('cancelOrder')({
        userId: order.user.id,
        price: order.price,
        action: cancelStatus
      })
        .subscribe(a => console.log(a), e => console.log('error ', e));
    }
    return this.updateOrderstatus(order, cancelStatus);
  }

  updateBalance(id: string, debit: number, credit: number) {
    return this.usersCol
      .doc(id)
      .update({
        debit: debit,
        credit: credit
      });
  }

  payOrders(orders: Order[]) {
    let batch = this.fs.firestore.batch();
    let ref;
    for (let order of orders) {
      ref = this.ordersCol.doc(order.id).ref;
      batch.update(ref, {
        paid: {
          flag: true,
          by: firebaseApp.firestore.Timestamp.fromDate(new Date())
        }
      });
    }
    return batch.commit();
  }

  payOrder(id: string) {
    return this.ordersCol
      .doc<Order>(id)
      .update({
        paid: {
          flag: true,
          by: firebaseApp.firestore.Timestamp.fromDate(new Date())
        }
      });
  }

}
