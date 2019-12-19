import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface History {
  trashType: string,
  price: string,
  weight: number,
  dateTraded: string,
  seller: string,
  boughtBy: string,
  status: string,
  location: string,
  notes: string,
  phone: string,
  image: string
}

@Injectable({
  providedIn: 'root'
})

export class HistoryService {

  private historyCollection: AngularFirestoreCollection<History>;
  private history: Observable<History[]>;

  constructor(private db: AngularFirestore) {
    this.historyCollection = db.collection<History>('history');
  }

  getAllHistory(){

    this.history = this.historyCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    )
    return this.history;
  }

  addHistory(item: History){
    console.log(item);
    return this.historyCollection.add(item);
  }

  updateHistory(history: History, id:string){
    return this.historyCollection.doc(id).update(history);
  }

}
