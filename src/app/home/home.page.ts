import { Component, OnInit } from '@angular/core';
import { AchievementService, userInfo } from '../user.service';
import { AuthGuardService } from '../auth/auth-guard.service';
import { userInfoLocal } from '../userInfo.model';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Plugins, Capacitor, CameraResultType, CameraSource } from '@capacitor/core';
import { ToastController, AlertController } from '@ionic/angular';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
defineCustomElements(window);

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  userList: userInfo[];
  userInfo: userInfoLocal;
  user: string;
  photo: SafeResourceUrl;
  selectedImage: SafeResourceUrl;
  
  constructor(
    private achievementSvc: AchievementService,
    private authSvc: AuthGuardService,
    private toastController: ToastController,
    private alertController: AlertController,
    private sanitizer: DomSanitizer
  ) {}
  
  ngOnInit(){    
    var i = 0;
    this.user = this.authSvc.getUser();
    this.achievementSvc.getUserInfo().subscribe(res => {
      this.userList = res;
      while(i < res.length){
        if(res[i].userName == this.user){
          this.achievementSvc.setLocalUser(res[i]);
          this.achievementSvc.setLocalUserID(res[i].id);
          break;
        }
        i++;
      }
    });
    // this.userInfo = this.achievementSvc.getUser();
  }

  async takePicture() {
    const image = await Plugins.Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
    console.log(this.photo)
  }

  async comingSoon(){
    const toast = await this.toastController.create({
      message: 'Coming soon',
      position: 'bottom',
      duration: 500
    });
    toast.present();
  }

 async onLogout() {
    let alert = await this.alertController.create({
      header: 'Confirm purchase',
      message: 'Do you want to Logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.authSvc.logOut();
          }
        }
      ]
    });
    await alert.present();
  }


}
