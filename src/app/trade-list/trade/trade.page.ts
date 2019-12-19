import { Component, OnInit } from '@angular/core';
import { Trade, PricelistService } from '../transaction.service';
import { ToastController, AlertController, ModalController } from '@ionic/angular';
import { HistoryService, History } from 'src/app/history-tab/history.service';
import { AuthGuardService } from 'src/app/auth/auth-guard.service';
import { AchievementService, userInfo } from 'src/app/user.service';
import { userInfoLocal } from 'src/app/userInfo.model';
import * as firebase from 'firebase';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.page.html',
  styleUrls: ['./trade.page.scss'],
})
export class TradePage implements OnInit {
  
  otherList : Trade[];
  detail: Trade;
  user: string;
  history: History;
  showSpinner: boolean = true;
  userList: userInfo[];
  userInfo: userInfo;

  constructor(
    private toastController: ToastController,
    private alertController: AlertController, 
    private tradeSvc: PricelistService,
    private historySvc: HistoryService,
    private authSvc: AuthGuardService,
    private achievementSvc: AchievementService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.tradeSvc.getAllTrade(this.authSvc.getUser()).subscribe(res => {
      res.forEach(item => {
        var storageRef = firebase.storage().ref();
        storageRef.child('image').child(item.image).getDownloadURL().then(function(url){
            item['imageoriginal'] = item.image;
            item.image = url;
        })
      })
      this.otherList = res;
      this.showSpinner = false;
    });
    this.user = this.authSvc.getUser();
    this.achievementSvc.getUserInfo().subscribe(res => {
      this.userList = res;
    });
  }

  sendUserInfo(itemID: string, i: userInfoLocal, UserID: string){
    this.achievementSvc.setLocalUser(i);
    this.achievementSvc.setLocalUserID(UserID);
    this.achievementSvc.setLocalItemID(itemID);
  }

}
