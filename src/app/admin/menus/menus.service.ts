import { Observable } from 'rxjs';
import { NotificationsService } from './../../notifications/notifications.service';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Menu } from '../../shared/models/menu';
import { Product } from '../../shared/models/product';
import { DAOSubcollection } from '../../shared/helpers/dao-subcollection';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase/app';

@Injectable()
export class MenusService extends DAOSubcollection<Menu, Product> {

  constructor(
    public af: AngularFirestore,
    public notificationsService: NotificationsService
  ) {
    super('Menu', 'Menús', 'menus', af, notificationsService, 'productos');
  }

  getAll(): Observable<Menu[]> {
    this.objectCollection = this.af.collection<Menu>('menus', ref => ref.orderBy('date', 'desc').limit(10));
    return this.objectCollection
      .snapshotChanges()
      .pipe(
        map(actions => {
          // console.log(actions);
          return actions.map(a => {
            let data = a.payload.doc.data() as Menu;
            data['id'] = a.payload.doc.id;
            return data;
          })
        }));
  }

  add(menu: Menu, products: Product[]) {
    let correctedDate = new Date(menu.date);
    correctedDate.setHours(6, 0, 0);
    let correctedTimestamp = firebase.firestore.Timestamp.fromDate(correctedDate);
    menu.date = correctedTimestamp;
    // console.log(menu.date.toDate());
    return super.add(menu, products);
  }

  update(id: string, menu: Menu, products: Product[], deletedProducts: Product[]) {
    let correctedDate = new Date(menu.date);
    correctedDate.setHours(6, 0, 0);
    let correctedTimestamp = firebase.firestore.Timestamp.fromDate(correctedDate);
    menu.date = correctedTimestamp;

    return super.update(id, menu, products, deletedProducts);
  }

  delete(id: string, subCollection: Product[]) {
    return super.delete(id, subCollection);
  }

  toggleMenuAvailability(id: string, flag: boolean): Promise<void> {
    return this.objectCollection.doc(id)
      .set({ available: flag }, { merge: true })
      .then(() => this.notificationsService
        .show(`Menu ${id} ${flag ? "disponible" : "cerrado"}`, 'Menús', `${flag ? "success" : "warning"}`));
  }

  toggleNotAvailable(menuId: string, productId: string, flag: boolean): Promise<void> {
    return this.objectCollection
      .doc(menuId)
      .collection('productos')
      .doc(productId)
      .set({ notAvailable: flag }, { merge: true })
      .then(() => this.notificationsService
        .show(`Producto ${productId} de menu ${menuId} ${flag ? "disponible" : "se acabó"}`, 'Menús', `${flag ? "success" : "warning"}`));
  }
}
