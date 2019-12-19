import { Component, OnInit } from '@angular/core';
import { HistoryService, History } from '../history.service';
import { AuthGuardService } from 'src/app/auth/auth-guard.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-traded-with',
  templateUrl: './traded-with.page.html',
  styleUrls: ['./traded-with.page.scss'],
})
export class TradedWithPage implements OnInit {

  loadedHistory: History[];
  user: string;
  showSpinner: boolean = true;

  constructor(private historySrvc: HistoryService, private authSvc: AuthGuardService) { }

  ngOnInit() {
    this.historySrvc.getAllHistory().subscribe(res => {
      res.forEach(item => {
          var storageRef = firebase.storage().ref();
          storageRef.child('image').child(item.image).getDownloadURL().then(function(url){
              item['imageoriginal'] = item.image;
              item.image = url;
          })
      })
      this.loadedHistory = res;
      this.showSpinner = false;
    });
    this.user = this.authSvc.getUser();
  }

  itemReceived(history: History, id:string){
    history.status = "completed"
    this.historySrvc.updateHistory(history, id);
  }
}
