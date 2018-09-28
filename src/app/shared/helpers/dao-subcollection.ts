import { Observable, BehaviorSubject } from "rxjs";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { DAO } from "./dao";
import { NotificationsService } from "../../notifications/notifications.service";
import * as firebase from 'firebase';
import { map } from "rxjs/operators";

export abstract class DAOSubcollection<T, S> extends DAO<T>{
  object = new BehaviorSubject<T>(null);
  objectCollection: AngularFirestoreCollection<T>;

  constructor(
    public collectionRoute: string,
    public className: string,
    public collectionName: string,
    public af: AngularFirestore,
    public notificationsService: NotificationsService,
    public subCollectionName: string,
    public subCollectionRoute: string
  ) {
    super(className, collectionName, collectionRoute, af, notificationsService);
  }

  // getAll() {   
  //   return super.getAll();
  // }

  getSubcollection(id: string): Observable<S[]> {
    let subCollection: AngularFirestoreCollection<S> = this.objectCollection.doc(id).collection(this.subCollectionName);
    return subCollection
      .snapshotChanges()
      .pipe(
        map(actions => {
          // console.log(actions);
          return actions.map(a => {
            let data: S = a.payload.doc.data() as S;
            // console.log(data);
            data['id'] = a.payload.doc.id;
            return data;
          });
        })
      );
  }

  add(object: T, subCollection?: S[]): Promise<firebase.firestore.DocumentReference> {
    return super
      .add(object)
      .then(doc => {
        // console.log(doc);
        let objectSubCollection = this.objectCollection.doc(doc['id']).collection<S>(this.subCollectionName);
        let batch = this.af.firestore.batch();
        subCollection.forEach(_object => {
          const id = this.af.createId();
          let ref = objectSubCollection.doc(id).ref;
          batch.set(ref, _object);
        });
        return batch.commit().then(() => doc);
      })
  }

  update(id: string, object: T, subCollection: S[], deletedSubCollection: S[]): Promise<T> {
    return super
      .update(id, object)
      .then(doc => {
        let batch = this.af.firestore.batch();
        let objectSubCollection = this.objectCollection.doc(id).collection<S>(this.subCollectionName);
        let ref;
        subCollection.forEach(_object => {
          const id = this.af.createId();
          ref = objectSubCollection.doc(id).ref;
          batch.set(ref, _object);
        });
        deletedSubCollection.forEach(_object => {
          ref = objectSubCollection.doc(_object['id']).ref;
          batch.delete(ref);
        });
        return batch.commit().then(() => object);
      })
  }

  delete(id: string, subCollection: S[]) {
    return super.
      delete(id)
      .then(() => {
        let batch = this.af.firestore.batch();
        let objectSubCollection = this.objectCollection.doc(id).collection<S>(this.subCollectionName);
        let ref;
        subCollection.forEach(_object => {
          ref = objectSubCollection.doc(_object['id']).ref;
          batch.delete(ref);
        });
        return batch.commit().then(() => id);
      })
  }

}
