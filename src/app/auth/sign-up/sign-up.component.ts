import { Component, OnInit } from '@angular/core';
import { AuthGuardService } from '../auth-guard.service';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { AchievementService, userInfo } from 'src/app/achievement.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {

  user: userInfo;

  constructor(
    private modalCtrl: ModalController, 
    private authSvc: AuthGuardService, 
    private userSvc: AchievementService
  ) { }

  ngOnInit() { }

  onSignUp(f: NgForm) {
    this.user = {
      userName: f.value.username,
      point: 0,
      quizCleared: 0,
      totalBought: 0,
      totalSold: 0,
      password: f.value.pwd,
      phone: f.value.phone.toString()
    }
    this.userSvc.addUser(this.user);
    this.modalCtrl.dismiss();
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

}
