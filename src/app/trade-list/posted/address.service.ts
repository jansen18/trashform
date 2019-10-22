import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  currAddress = new BehaviorSubject<string>('');
  note: string;
  constructor() { }

  getAddress() {
    return this.currAddress.asObservable();
  }

  setAddress(address: string) {
    this.currAddress.next(address);
  }

  setNote(note: string){
    this.note = note;
  }

  getNote(){
    return this.note;
  }
  
}
