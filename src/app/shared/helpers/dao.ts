import { Observable, BehaviorSubject } from "rxjs";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { NotificationsService } from "../../notifications/notifications.service";
import * as firebase from 'firebase';
import { map } from "rxjs/operators";
import { capitalize } from "./methods";

export abstract class DAO<T> {
  object = new BehaviorSubject<T>(null);
  objectCollection: AngularFirestoreCollection<T>;
  objectDocument: AngularFirestoreDocument<T>;
  private selectedProductSubject = new BehaviorSubject<T>(null);

  constructor(
    public className: string,
    public collectionName: string,
    public collectionRoute: string,
    public af: AngularFirestore,
    public notificationsService: NotificationsService
  ) {
    this.objectCollection = af.collection<T>(collectionRoute);
  }

  getAll(): Observable<T[]> {
    this.objectCollection = this.af.collection<T>(this.collectionRoute);
    return this.objectCollection
      // .valueChanges()
      .snapshotChanges()
      .pipe(
        map((actions: any[]) => {
          // console.log(actions); 
          return actions.map(a => {
            let data = a.payload.doc.data() as T;
            data['id'] = a.payload.doc.id;
            return data;
          })
        })
      );
  }

  one(id: string): Observable<T> {
    this.objectDocument = this.af.collection<T>(this.collectionRoute).doc(id);
    return this.objectDocument
      // .valueChanges()
      .snapshotChanges()
      .pipe(
        map(action => {
          // console.log(actions); 
          let data = action.payload.data() as T;
          data['id'] = action.payload.id;
          return data;
        })
      );
  }

  getSelectedObject(): Observable<T> {
    return this.selectedProductSubject.asObservable();
  }

  setSelectedObject(object: T): void {
    return this.selectedProductSubject.next(object);
  }

  isObjectSelected(): boolean {
    const flag = !!this.selectedProductSubject.getValue();
    // console.log(flag);
    return flag;
  }

  add(object: T, subcollection?: any[]): Promise<firebase.firestore.DocumentReference> {
    return this.objectCollection
      .add(object)
      .then(doc => {
        this.notificationsService.show(`${capitalize(this.className)} agregado`, capitalize(this.collectionName), 'success');
        return doc;
      })
  }

  update(id: string, object: T, subcollection?: any[], deleted?: any[]): Promise<T> {
    // console.log(id);
    return this.objectCollection
      .doc(id)
      .update(object)
      .then(doc => {
        this.notificationsService.show(`${capitalize(this.className)} editado`, capitalize(this.collectionName), 'info');
        return object;
      });
  }

  delete(id: string, subcollection?: any[]): Promise<string> {
    return this.objectCollection
      .doc(id)
      .delete()
      .then(() => {
        this.notificationsService.show(`${capitalize(this.className)} borrado`, capitalize(this.collectionName), 'danger');
        return id;
      });
  }
}