import { Component, OnInit } from '@angular/core';
import { Trade, PricelistService } from 'src/app/trade-list/transaction.service';
import { NavParams, ToastController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { userInfo, AchievementService } from 'src/app/user.service';
import { HistoryService, History } from 'src/app/history-tab/history.service';
import { AuthGuardService } from 'src/app/auth/auth-guard.service';
import { userInfoLocal } from 'src/app/userInfo.model';
import { Subscription } from 'rxjs';
import { AddressService } from 'src/app/trade-list/posted/address.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  detail: Trade;
  otherList : Trade[];
  totalPrice: number;
  error: boolean = false;
  userInfo: userInfo;
  history: History;
  address: string;
  subscription: Subscription;
  notes: string;
  imageoriginal: string;

  constructor(
    private route: ActivatedRoute,
    private toastController: ToastController,
    private authSvc: AuthGuardService,
    private alertController: AlertController,
    private tradeSvc: PricelistService,
    private historySvc: HistoryService,
    private achievementSvc: AchievementService,
    private router: Router,
    private addressSvc: AddressService,) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.detail = JSON.parse(params["detail"]);
      this.imageoriginal = params['imageoriginal'];
      this.totalPrice = parseInt(this.detail.price) + 10000;
    });
  }

  Pay(){
    this.presentTradeModal(this.achievementSvc.getLocalItemID(), this.achievementSvc.getLocalUser(), this.achievementSvc.getLocalUserID());
  }
  
  async presentTradeModal(id: string, user: userInfoLocal, userID: string) {
    // console.log(id);
    // console.log(user);
    // console.log(userID);
    // console.log(this.achievementSvc.getUser(userID));
    this.subscription = this.addressSvc.getAddress().subscribe(data => {
      this.address = data;
    })
    const alert = await this.alertController.create({
      subHeader: 'Are you sure you want to buy ' + this.detail.weight + " kg of " + this.detail.trashType + "(s) from " + this.detail.trader,
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.history = {
              trashType: this.detail.trashType,
              price: this.detail.price.toString(),
              weight: this.detail.weight,
              dateTraded: new Date().toDateString(),
              seller: this.detail.trader,
              boughtBy: this.authSvc.getUser(),
              status: 'ordered',
              location: this.address,
              notes: this.addressSvc.getNote(),
              phone: '+62 ' + user.phone,
              image: this.imageoriginal
            }
            this.userInfo = {
              point: user.point,
              quizCleared: user.quizCleared,
              totalBought: user.totalBought,
              totalSold: user.totalSold,
              userName: user.userName,
              password: user.password,
              phone: user.phone
            }
            console.log(this.history);
            this.historySvc.addHistory(this.history);
            
            this.tradeSvc.getAllTrade1(this.authSvc.getUser()).subscribe(res => {
              this.otherList = res;
            });

            this.userInfo.point = this.userInfo.point + (parseInt(this.detail.price) / 100);
            this.userInfo.point.toFixed(0);
            this.achievementSvc.updateUserPoint(this.userInfo, userID);

            // this.tradeSvc.removeTrade(id);

            this.alertController.dismiss();
            this.deleted();
          }
        }
      ]
    });

    await alert.present();
  }

  async deleted() {
    const alert = await this.alertController.create({
      subHeader: 'Transaction successful',
      buttons: [
        {
          text: 'ok',
          handler: () =>{
            this.router.navigate(['/home', this.detail]);
          }
        }
      ]
    });

    await alert.present();
    
  }

}
