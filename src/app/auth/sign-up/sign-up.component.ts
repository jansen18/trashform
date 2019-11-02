import { Component, OnInit } from '@angular/core';
import { AuthGuardService } from '../auth-guard.service';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { AchievementService, userInfo } from 'src/app/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {

  user: userInfo;
  error: string = '';
  userList: userInfo[];
  username: string;

  constructor(
    private modalCtrl: ModalController, 
    private authSvc: AuthGuardService, 
    private userSvc: AchievementService,
    private achievementSvc: AchievementService
  ) { }

  ngOnInit() {
  }

  onSignUp(f: NgForm) {
    var i = 0;
    this.username = f.value.username;
    this.achievementSvc.getUserInfo().subscribe(res => {
      this.userList = res;
      while(i < res.length){
        console.log(res[i].userName);
        console.log(this.username);
        if(res[i].userName == this.username){
          this.error = "Username has been picked";
          break;
        }
        else if(f.value.pwd != f.value.confirmPwd){
          this.error = "Password doesn't match";
          break;
        }
        else{
          this.user = {
            userName: f.value.username,
            point: 0,
            quizCleared: 0,
            totalBought: 0,
            totalSold: 0,
            password: f.value.pwd,
            phone: f.value.phone.toString()
          }
          // this.userSvc.addUser(this.user);
          this.modalCtrl.dismiss();
        }
        i++;
      }
    });
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

}
