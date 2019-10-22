import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TradeListPage } from './trade-list.page';
import { TradeListRoutingModule } from './trade-list.routing.module';

const routes: Routes = [
  {
    path: '',
    component: TradeListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TradeListRoutingModule
  ],
  declarations: [TradeListPage]
})
export class TradeListPageModule {}
