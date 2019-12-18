import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SafeResourceUrl } from '@angular/platform-browser';

export interface Trade {
  trashType: string,
  price: string,
  weight: number,
  datePosted: string,
  trader: string,
  status: string,
  description: string,
  location: string
}

@Injectable({
  providedIn: 'root'
})

export class PricelistService {

  private tradeCollection: AngularFirestoreCollection<Trade>;
  private trades: Observable<Trade[]>;

  constructor(private db: AngularFirestore) {
    this.tradeCollection = db.collection<Trade>('trade');
  }

  getAllTrade(trader: string){

    this.trades = this.tradeCollection.snapshotChanges().pipe(  
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    )
    return this.trades;
  }

  getAllTrade1(trader: string){

    this.trades = this.tradeCollection.snapshotChanges().pipe(  
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    )
    return this.trades;
  }

  getTrade(id){
    return this.tradeCollection.doc<Trade>(id).valueChanges();
  }

  updateTrade(trade: Trade, id: string){
    return this.tradeCollection.doc(id).update(trade);
  }

  addTrade(trade: Trade){
    return this.tradeCollection.add(trade);
  }

  removeTrade(id){
    return this.tradeCollection.doc(id).delete();
  }

  // getAllTradeList(){
  //   return[...this.trade];
  // }

  // getTradeList(id: string){
  //   return{...this.trade.find(p => p.id === id)};
  // }

  // addTradeList(item: tradeList){
  //   console.log(item);
  //   this.trade.push(item);
  // }

  // deleteTrade(id: string){
  //   this.trade = this.trade.filter(p => {
  //     return p.id !== id;
  //   })
  // }

}
