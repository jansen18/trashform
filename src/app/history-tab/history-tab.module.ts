import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HistoryTabPage } from './history-tab.page';
import { HistoryTabRoutingModule } from './history-routing.module';

const routes: Routes = [
  {
    path: '',
    component: HistoryTabPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    HistoryTabRoutingModule
  ],
  declarations: [HistoryTabPage]
})
export class HistoryTabPageModule {}
