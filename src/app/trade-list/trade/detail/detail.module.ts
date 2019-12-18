import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetailPage } from './detail.page';
import { MapModal2Component } from './map-modal2/map-modal2.component';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';
import { PaymentPage } from './payment/payment.page';

const routes: Routes = [
  {
    path: '',
    component: DetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AgmCoreModule.forRoot({
      apiKey: environment.firebase.mapsAPIKey
    })
  ],
  declarations: [DetailPage, MapModal2Component],
  entryComponents: [MapModal2Component]
})
export class DetailPageModule {}
