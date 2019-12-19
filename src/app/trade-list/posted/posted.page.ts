import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController, ModalController } from '@ionic/angular';
import { PricelistService, Trade } from '../transaction.service';
import { HistoryService } from 'src/app/history-tab/history.service';
import { AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthGuardService } from 'src/app/auth/auth-guard.service';
import { MapModalComponent } from './map-modal/map-modal.component';
import { HttpClient } from '@angular/common/http';
import { AddressService } from './address.service';
import { environment } from 'src/environments/environment';
import { Plugins, Capacitor, CameraResultType, CameraSource, Camera } from '@capacitor/core';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import * as firebase from 'firebase';


defineCustomElements(window);


@Component({
  selector: 'app-posted',
  templateUrl: './posted.page.html',
  styleUrls: ['./posted.page.scss'],
})
export class PostedPage implements OnInit {
  lat = 51.678418;
  lng = 7.809007;
  loadedList : Trade[];
  detail: Trade;
  postItem: Trade;
  user: string;
  showSpinner: boolean = true;
  address: string = '';
  photo: SafeResourceUrl;
  selectedImage: string;
  subscription: Subscription;
  image: any;

  constructor(
    private toastController: ToastController,
    private alertController: AlertController, 
    private tradeSvc: PricelistService,
    private historySvc: HistoryService,
    private http: HttpClient,
    private authSvc: AuthGuardService,
    private addressSvc: AddressService,
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.tradeSvc.getAllTrade(this.authSvc.getUser()).subscribe(res => {
      this.loadedList = res;
      this.showSpinner = false;
    });
    this.user = this.authSvc.getUser();
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
      this.loadedList = res;
      this.showSpinner = false;
    });

    this.user = this.authSvc.getUser();
  }

  async takePicture() {
    const image = await Plugins.Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    console.log(image);
    this.image = image;

    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
    this.presentAlert();
    console.log(this.photo);
  }

  async presentTradeModal(trade: Trade, id: string) {
    this.subscription = this.addressSvc.getAddress().subscribe(data => {
      this.address = data;
      console.log(this.address);
    })
    const alert = await this.alertController.create({
      header: 'Update item',
      inputs: [
        {
          name: 'item',
          type: 'text',
          placeholder: 'Item',
          value: trade.trashType,
        },
        {
          name: 'price',
          type: 'number',
          placeholder: 'Price (Rp)',
          value: trade.price.toString()
        },
        {
          name: 'weight',
          type: 'number',
          placeholder: 'Weight (Kg)',
          value: trade.weight.toString(),
        },
        {
          name: 'description',
          type: 'text',
          placeholder: 'Product Description',
          value: trade.description.toString(),
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Post',
          handler: data => {
            
            var photo = this.image.dataUrl;
            console.log(data);
            var fileName = trade['imageoriginal'].toString();

            var storage = firebase.storage();
            var storageRef = storage.ref().child('image').child(fileName);
            storageRef.putString(photo, 'data_url').then(function(snapshot) {
                console.log('uploaded a data_url string');
            })
            this.postItem = {
                trashType: data.item, 
                price: data.price, 
                weight: data.weight, 
                datePosted: new Date().toDateString(), 
                trader: this.authSvc.getUser(),
                status: 'available',
                description: data.description,
                location: this.address,
                image: fileName
            };
            console.log(this.postItem);
            this.tradeSvc.updateTrade(this.postItem, id);
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlert() {
    this.subscription = this.addressSvc.getAddress().subscribe(data => {
      this.address = data;
    })
    const alert = await this.alertController.create({
      header: 'What would you want to sell?',
      inputs: [
        {
          name: 'item',
          type: 'text',
          placeholder: 'Item',
          label: 'item'
        },
        {
          name: 'price',
          type: 'number',
          placeholder: 'Price in Rupiah',
          label: 'price'
        },
        {
          name: 'weight',
          type: 'number',
          placeholder: 'Weight in Kg',
          label: 'weight',
        },
        {
          name: 'description',
          type: 'text',
          placeholder: 'Product description',
          label: 'description',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Post',
          handler: data => {
            var photo = this.image.dataUrl;

            var fileName = (this.loadedList.length + 1).toString();

            var storage = firebase.storage();
            var storageRef = storage.ref().child('image').child(fileName);
            storageRef.putString(photo, 'data_url').then(function(snapshot) {
                console.log('uploaded a data_url string');
            })
            this.postItem = {
                trashType: data.item, 
                price: data.price, 
                weight: data.weight, 
                datePosted: new Date().toDateString(), 
                trader: this.authSvc.getUser(),
                status: 'available',
                description: data.description,
                location: this.address,
                image: fileName
            };

            
            console.log(this.postItem);
            this.tradeSvc.addTrade(this.postItem);
            // this.tradeSvc.addTradeList(this.postItem);
          }
        }
      ]
    });

    await alert.present();
  }

  removeTrade(id: string){
    this.tradeSvc.removeTrade(id);
  }

  async deleted() {
    const toast = await this.toastController.create({
      message: 'Trade successful',
      duration: 2000
    });
    toast.present();
  }
  
  async onPickLocation() {
    const modal = await this.modalCtrl.create({
      component: MapModalComponent
    });
    modal.onDidDismiss().then((modalData) => {
      this.lat = modalData.data.lat;
      this.lng = modalData.data.lng;

      this.getAddress(modalData.data.lat, modalData.data.lng).subscribe(
        (address) => {
          this.addressSvc.setAddress(address);
          this.addressSvc.getAddress().subscribe(
            currAddress => {
              this.address = currAddress;
              console.log(this.address);
            }
          );
          this.takePicture();
        }
      );
    });
    return await modal.present();
  }

  async onPickLocationUpdate(trade: Trade, id: string){
    const modal = await this.modalCtrl.create({
      component: MapModalComponent
    });
    modal.onDidDismiss().then((modalData) => {
      this.lat = modalData.data.lat;
      this.lng = modalData.data.lng;

      this.getAddress(modalData.data.lat, modalData.data.lng).subscribe(
        (address) => {
          this.addressSvc.setAddress(address);
          this.addressSvc.getAddress().subscribe(
            currAddress => {
              this.address = currAddress;
              console.log(this.address);
            }
          );
          this.takePictureForUpdate(trade, id);
        }
      );
    });
    return await modal.present();    
  }

  async takePictureForUpdate(trade: Trade, id: string){
    
    const image = await Plugins.Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    console.log(image);
    this.image = image;

    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
    this.presentTradeModal(trade, id);
    console.log(this.photo);
  }

  private getAddress(lat: number, lng: number){
    console.log(this.lat + ' ' + this.lng);
    return this.http.get<any>('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=' + environment.firebase.mapsAPIKey)
      .pipe(
        map(geoData => {
          if(!geoData || !geoData.results || !geoData.results.length){
            console.log('fail');
            return null;
          }
          return geoData.results[0].formatted_address;
        })
      );
  }
}
