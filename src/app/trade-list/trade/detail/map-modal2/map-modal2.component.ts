import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Plugins, Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-map-modal2',
  templateUrl: './map-modal2.component.html',
  styleUrls: ['./map-modal2.component.scss'],
})
export class MapModal2Component implements OnInit {

  lat = 35.6595202;
  lng = 139.6989984;
  @ViewChild('map', { static: false }) mapElementRef: ElementRef;

  constructor(
    private modalCtrl: ModalController, 
    private renderer: Renderer2,
    private alertCtrl: AlertController,
  ) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.getGoogleMaps().then((googleMaps) => {
      const mapElement = this.mapElementRef.nativeElement;
      const map = new googleMaps.Map(mapElement, {
        center: { lat: this.lat, lng: this.lng },
        zoom: 16,
      });
      googleMaps.event.addListenerOnce(map, 'idle', () => {
        this.renderer.addClass(mapElement, 'visible');
      });

    this.getLocations().then(Loc => {
      if(!Loc){
        const marker = new googleMaps.Marker({ position: { lat: this.lat, lng: this.lng }, map });
      }
      else{
        const marker = new googleMaps.Marker({ position: { lat: Loc.latitude, lng: Loc.longitude }, map });
        map.panTo(new googleMaps.LatLng(Loc.latitude, Loc.longitude));
      }
    })
      map.addListener('click', event => {
        const selectedCoords = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        };
        this.modalCtrl.dismiss(selectedCoords);
      });
    }).catch(err => {
      console.log(err);
    });
  }

  onChooseLocation(event: any) {
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
    console.log(this.lat);
    console.log(this.lng);
  }

  private getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=' + environment.firebase.mapsAPIKey;
      console.log(script.src);
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google maps SDK is not available');
        }
      };
    });
  }



  onCancel() {
    this.modalCtrl.dismiss();
  }

  async presentAlert(){
    const alert = await this.alertCtrl.create({
      header: 'Alert',
      subHeader: 'Failed',
      message: 'Could not get user location',
      buttons: ['OK']
    });

    await alert.present();

  }

  async getLocations(){
    if(!Capacitor.isPluginAvailable('Geolocation')){
      this.presentAlert();
      return null;
    }
    const coordinate = await Plugins.Geolocation.getCurrentPosition();
    return coordinate.coords;
  }


}
