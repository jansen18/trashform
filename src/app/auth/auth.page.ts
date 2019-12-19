import { Component, OnInit } from '@angular/core';
import { AuthGuardService } from './auth-guard.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ModalController, LoadingController } from '@ionic/angular';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AchievementService, userInfo } from '../user.service';
import { userInfoLocal } from '../userInfo.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  user: string;
  userList: userInfo[];
  userInfo: userInfoLocal;
  isAuth: boolean = false;
  error: boolean = false;

  constructor(
    private modalCtrl: ModalController, 
    private authSvc: AuthGuardService, 
    private router: Router,
    private achievementSvc: AchievementService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
  }

  onLogin(f: NgForm) {
    var i = 0;
    this.authSvc.login(f.value.username, f.value.pwd);

    this.achievementSvc.getUserInfo().subscribe(res => {
      this.userList = res;
      while(i < res.length){
        if(res[i].userName == f.value.username && res[i].password == f.value.pwd){
          this.router.navigateByUrl('/home');
          this.isAuth = true;
          f.reset();
          break;
        }
        i++;
      }
      this.error = true;
    });
  }  
  
  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      spinner: null,
      duration: 5000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }
  
  async presentSignUpModal() {
    const modal = await this.modalCtrl.create({
      component: SignUpComponent
    });
    return await modal.present();
  }
}
