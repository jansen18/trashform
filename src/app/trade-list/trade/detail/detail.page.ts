import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Trade, PricelistService } from '../../transaction.service';
import { LoadingController, ModalController, NavController, AlertController } from '@ionic/angular';
import { AddressService } from '../../posted/address.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  
  id = null;
  detail: Trade;
  showSpinner: boolean = true;
  address: string = '';
  notes: string;


  constructor(
    private route: ActivatedRoute,
    private tradelistSvc: PricelistService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['listId'];
    console.log(this.id);
    if(this.id){
      this.tradelistSvc.getTrade(this.id).subscribe(res => {
        this.detail = res;
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

}
