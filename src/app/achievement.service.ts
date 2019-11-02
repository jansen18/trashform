import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { userInfoLocal } from './userInfo.model';

export interface userInfo {
  userName: string,
  point: number,
  totalSold: number,
  totalBought: number,
  quizCleared: number,
  password: string,
  phone: string
}

@Injectable({
  providedIn: 'root'
})
export class AchievementService {

  private userCol: AngularFirestoreCollection<userInfo>;
  private user: Observable<userInfo[]>;
  userInfo: userInfoLocal;
  id: string;
  itemID: string;
  constructor(private db: AngularFirestore) { 
    this.userCol = this.db.collection<userInfo>('userInfo');
  }
  
  // getTrade(id){
  //   return this.tradeCollection.doc<Trade>(id).valueChanges();
  // }
  addUser(user: userInfo){
    return this.userCol.add(user);
  }

  setLocalUser(item: userInfoLocal){
    this.userInfo = new userInfoLocal(item.userName, item.point, item.totalSold, item.totalBought, item.quizCleared, item.password, item.phone);
    console.log(this.userInfo);
  }

  setLocalUserID(id: string){
    this.id = id;
  }

  setLocalItemID(id:string){
    this.itemID = id;
  }

  getLocalUser(){
    return this.userInfo;
  }

  getLocalUserID(){
    return this.id;
  }

  getLocalItemID(){
    return this.itemID;
  }

  getUser(id){
    console.log(this.userCol.doc<userInfo>(id).valueChanges());
    return this.userCol.doc<userInfo>(id).valueChanges();
  }
  
  updateUserPoint(user: userInfo, id: string){
    return this.userCol.doc(id).update(user);
  }

  getUserInfo(userName: string){
    this.userCol = this.db.collection<userInfo>('userInfo');

    this.user = this.userCol.snapshotChanges().pipe(  
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
          
        });
      })
    )
    return this.user;
  }
}
