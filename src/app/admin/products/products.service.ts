import { Injectable } from '@angular/core';
import { DAO } from '../../shared/helpers/dao';
import { Product } from '../../shared/models/product';
import { AngularFirestore } from '@angular/fire/firestore';
import { NotificationsService } from '../../notifications/notifications.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService extends DAO<Product> {

  constructor(
    public af: AngularFirestore,
    public notifications: NotificationsService
  ) {
    super("producto", "productos", "products", af, notifications);
   }
}
