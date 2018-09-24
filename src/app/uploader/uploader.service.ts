import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class UploaderService {
  constructor(
    private fs: AngularFirestore
  ) {

  }

  uploadFile(route: string, id?: string, image?: any) {
    if(!id) id = this.fs.createId();
    const collectionRef = this.fs.firestore.app.storage().ref(route);
    const docRef = collectionRef.child(id + '.jpg');
    return docRef.put(image)
      .catch(e => console.log('upload failed ', e));
  }

  updateFile(route: string = '', image?: any) {
    const docRef = this.fs.firestore.app.storage().ref(route);
    // const childProductoRef = productosRef.child(imageName + '.jpg');
    return docRef.put(image)
      .catch(e => console.log('upload failed ', e));
  }

}
