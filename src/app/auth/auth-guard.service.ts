import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { userInfo, AchievementService } from '../user.service';

interface AuthResponseData {
  kind: string,
  idToken: string,
  email: string,
  refreshToken: string,
  localId: string,
  expiresIn: string,
  registered?: boolean
}
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  isAuthenticated = false;
  userName: string;

  constructor() { } 

  login(name: string, password: string) {
    this.isAuthenticated = true;
    this.userName = name;
  }

  getUser(){
    return this.userName;
  }

}
