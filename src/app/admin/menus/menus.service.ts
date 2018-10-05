import { capitalize } from './../../shared/helpers/methods';
import { Observable } from 'rxjs';
import { NotificationsService } from './../../notifications/notifications.service';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Menu } from '../../shared/models/menu';
import { Product } from '../../shared/models/product';
import { DAOSubcollection } from '../../shared/helpers/dao-subcollection';
import { map, tap } from 'rxjs/operators';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: "root"
})
export class MenusService extends DAOSubcollection<Menu, Product> {

  constructor(
    public af: AngularFirestore,
    public notificationsService: NotificationsService
  ) {
    super('menú', 'menús', 'menus', af, notificationsService, 'productos', 'products');
  }

  getAll(): Observable<Menu[]> {
    this.objectCollection = this.af.collection<Menu>(this.collectionRoute, ref => ref.orderBy('date', 'desc').limit(10));
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
        .show(`Menu ${id} ${flag ? "disponible" : "cerrado"}`, capitalize(this.collectionName), `${flag ? "success" : "warning"}`));
  }

  toggleNotAvailable(menuId: string, product: Product, flag: boolean): Promise<void> {
    return this.objectCollection
      .doc(menuId)
      .collection(this.subCollectionRoute)
      .doc(product.id)
      .set({ notAvailable: flag }, { merge: true })
      .then(() => this.notificationsService
        .show(`${capitalize(product.name)} ${flag ? "disponible" : "se acabó"}`, capitalize(this.collectionName), `${flag ? "success" : "warning"}`));
  }
}
