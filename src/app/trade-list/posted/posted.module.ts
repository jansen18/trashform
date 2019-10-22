import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PostedPage } from './posted.page';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';
import { MapModalComponent } from './map-modal/map-modal.component';

const routes: Routes = [
  {
    path: '',
    component: PostedPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AgmCoreModule.forRoot({
      apiKey: `${environment.firebase.mapsAPIKey}`
    })
  ],
  declarations: [PostedPage, MapModalComponent],
  entryComponents: [MapModalComponent]
})
export class PostedPageModule {}
