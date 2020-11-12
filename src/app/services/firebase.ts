import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseProvider {

  constructor(public db: AngularFirestore) {}

  //Create
//   create = data => this.db.collection('').add(data);


  //Delete
//   delete(key) {
//     return this.db.collection('').doc(key).delete();
//   }


  //Get
  getAllDepartament() {
    return this.db.collection('departament')
    .valueChanges();
  }

    getAllCity() {
    return this.db.collection('city')
    .valueChanges();
  }

  getAllStore() {
    return this.db.collection('store')
    .snapshotChanges();
  }

  getAllProducts() {
    return this.db.collection('product')
    .snapshotChanges();
  }

  getCurrentProduct(idStore) {
    return this.db.collection('product', ref => ref.where('idStore', '==', idStore))
    .snapshotChanges();
  }

  getCurrentStore(cidade) {
    return this.db.collection('store', ref => ref.where('cidade', '==', cidade))
    .snapshotChanges();
  }

  getCurrentProductKey(key) {
    return this.db.collection('product', ref => ref.where('key', '==', key))
    .snapshotChanges();
  }


  //Update
  updateEstoque(data, key) {
    return this.db.collection('product').doc(key).update(data);
  }

}
