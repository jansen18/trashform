import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController, ModalController } from '@ionic/angular';
import { PricelistService, Trade } from '../pricelist.service';
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
    this.tradeSvc.getAllTrade(this.authSvc.getEmail()).subscribe(res => {
      this.loadedList = res;
      this.showSpinner = false;
    });
    this.user = this.authSvc.getEmail();
  }

  ionViewWillEnter(){
    this.tradeSvc.getAllTrade(this.authSvc.getEmail()).subscribe(res => {
      this.loadedList = res;
      this.showSpinner = false;
    });
    this.user = this.authSvc.getEmail();
  }

  async takePicture() {
    
    const image = await Plugins.Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });

    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.base64String));
    this.presentAlert();
    console.log(this.photo);
  }

  async presentTradeModal(asd: Trade, id: string) {
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
          label: asd.trashType
        },
        {
          name: 'price',
          type: 'number',
          placeholder: 'Price (Rp)',
          label: asd.price.toString()
        },
        {
          name: 'weight',
          type: 'number',
          placeholder: 'Weight (Kg)',
          label: asd.weight.toString(),
        },
        {
          name: 'description',
          type: 'text',
          placeholder: 'Product Description',
          label: 'desc',
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
            this.detail = {
              trashType: data.item, 
              price: data.price, 
              weight: data.weight, 
              datePosted: new Date().toDateString(), 
              trader: this.authSvc.getEmail(),
              status: 'available',
              description: data.description,
              location: this.address
              // image: this.photo
            };
            console.log(this.detail);
            this.tradeSvc.updateTrade(this.detail, id);
            // this.tradeSvc.addTradeList(this.postItem);
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
            this.postItem = {
              trashType: data.item, 
              price: data.price, 
              weight: data.weight, 
              datePosted: new Date().toDateString(), 
              trader: this.authSvc.getEmail(),
              status: 'available',
              description: data.description,
              location: this.address
              // image: this.photo
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

      // let options: NativeGeocoderOptions = {
      //   useLocale: true,
      //   maxResults: 5
      // };
      
      // this.nativegeocorder.reverseGeocode(this.lat, this.lng, options)
      //   .then((result: NativeGeocoderResult[]) => console.log(JSON.stringify(result[0])))
      //   .catch((error: any) => console.log(error));

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
