import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Order } from '../shared/models/order';
import { map, tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../shared/models/user';
import * as firebaseApp from 'firebase/app';
import { AngularFireFunctions } from '@angular/fire/functions';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable({
  providedIn: 'root'
})
export class MyOrdersService {
  myOrdersCollection: AngularFirestoreCollection<Order>;
  // editingStep = new BehaviorSubject<number>(0);

  private $action = new BehaviorSubject<Order>(null);

  constructor(
    private af: AngularFirestore,
    private functions: AngularFireFunctions,
    private notifications: NotificationsService
  ) {
  }

  getMyOrders(limit: number = 10, user: User): Observable<Order[]> {
    this.myOrdersCollection = this.af.collection<Order>('orders', ref => ref.where('user.id', '==', user.id).orderBy('date.for', 'desc').limit(limit));

    return this.myOrdersCollection
      .snapshotChanges().pipe(
        map(actions => {
          // console.log(actions);
          return actions.map(a => {
            let data = a.payload.doc.data() as Order;
            data['id'] = a.payload.doc.id;
            return data;
          })
        }),
    );
  }

  get action(): Observable<Order> {
    return this.$action.asObservable();
  }

  onAction(object: Order): void {
    this.$action.next(object);
  }

  editOrder(orderId: string, editedOrder: Order, user?: User) {
    return this.myOrdersCollection
      .doc(orderId)
      .update(editedOrder)
      .then(() => {
        if (user) {
          this.af
            .collection<User>('usuarios')
            .doc(user.id)
            .update(user)
            .then(() => this.notifications.show(`Balance actualizado :  Pendiente : $${user.debit} - Crédito $${user.credit}`, 'Mis órdenes', 'success'))
        }
      })
      .then(() => this.notifications.show('Orden editada', 'Mis órdenes', 'success'));
  }

  cancelOrder(order: Order, cancelStatus: string) {
    if (order.paid.flag) {
      order.paid = firebaseApp.firestore.FieldValue.delete() as any;
    }
    order.cancelled = firebaseApp.firestore.Timestamp.fromDate(new Date());
    order.status = cancelStatus;
    this.functions.httpsCallable('cancelOrder')({
      userId: order.user.id,
      price: order.price,
      action: cancelStatus
    })
      .subscribe(a => console.log(a), e => console.log('error ', e));

    return this.myOrdersCollection
      .doc(order.id)
      .update(order)
      .then(() => this.notifications.show('Orden cancelada', 'Mis órdenes', 'info'));
  }
}
