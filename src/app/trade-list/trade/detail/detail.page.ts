import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Trade, PricelistService } from '../../transaction.service';
import { environment } from 'src/environments/environment';
import { LoadingController, ModalController, NavController, AlertController } from '@ionic/angular';
import { AddressService } from '../../posted/address.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { MapModal2Component } from './map-modal2/map-modal2.component';
import { PaymentPage } from './payment/payment.page';
import * as firebase from 'firebase';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  
  lat = 51.678418;
  lng = 7.809007;
  id = null;
  detail: Trade;
  showSpinner: boolean = true;
  address: string = '';
  notes: string;

  @ViewChild('map', {static: false}) mapElementRef: ElementRef;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private tradelistSvc: PricelistService,
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private addressSvc: AddressService,
    private navCtrl: NavController,
    private router: Router,
    private alertController: AlertController, 
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['listId'];
    console.log(this.id);
    if(this.id){
      this.tradelistSvc.getTrade(this.id).subscribe(res => {
        var storageRef = firebase.storage().ref();
        storageRef.child('image').child(res.image).getDownloadURL().then(function(url){
          res['imageoriginal'] = res.image;
          res.image = url;
        })
        this.detail = res;
        console.log(this.detail);
        this.showSpinner = false;
      });
    }
  }

  async loadProduct(){
    const loading = await this.loadingController.create({
      message: 'Loading Product...'
    });

    await loading.present();

  }

  async onPickLocation() {
    const modal = await this.modalCtrl.create({
      component: MapModal2Component
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
            }
          );
        }
      );
      this.presentNoteAlert();
    });
    return await modal.present();
  }

  async presentNoteAlert(){
    const alert = await this.alertController.create({
      header: 'Note for seller',
      inputs: [
        {
          name: 'Note',
          type: 'text',
          placeholder: 'Input text here',
          label: 'Note'
        }
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
            this.addressSvc.setNote(data.Note);
          }
        }
      ]
    });

    await alert.present();
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

  paymentPage(){
    // this.router.navigate(['./payment', this.detail]);
    let navigationExtras: NavigationExtras = {
      queryParams: {
          detail: JSON.stringify(this.detail),
          imageoriginal: this.detail['imageoriginal']
      }
    };
    console.log(this.detail);
    this.navCtrl.navigateForward(['./payment'], navigationExtras);
  }

}
