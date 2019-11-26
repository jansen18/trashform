import { Component, OnInit } from '@angular/core';
import { HistoryService, History } from '../history.service';
import { AuthGuardService } from 'src/app/auth/auth-guard.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-trader',
  templateUrl: './trader.page.html',
  styleUrls: ['./trader.page.scss'],
})
export class TraderPage implements OnInit {
  
  loadedHistory: History[] = [];
  user: string;
  showSpinner: boolean = true;

  constructor(private historySrvc: HistoryService, private authSvc: AuthGuardService,
    private alertController: AlertController) { }

  ngOnInit() {
    this.historySrvc.getAllHistory().subscribe(res => {
      this.loadedHistory = res;
      this.showSpinner = false;
    });
    this.user = this.authSvc.getUser();
  }

  itemSent(history: History, id:string){
    history.status = "on-process"
    this.historySrvc.updateHistory(history, id);
  }

  async viewDetail(history: History){
    const alert = await this.alertController.create({
      header: 'Order detail',
      message: 'Address <br/><br/>' + history.location + '<br/><br/>Note <br/><br/>' + history.notes + '<br/><br/>Customer phone number <br/><br/>' + history.phone,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        },
      ]
    });

    await alert.present();
  }

}
