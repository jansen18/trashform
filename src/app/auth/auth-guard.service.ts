import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { userInfo, AchievementService } from '../user.service';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { } 

  login(name: string, password: string) {
    this.isAuthenticated = true;
    this.userName = name;
  }

  getUser(){
    return this.userName;
  }

  logOut() {
    this.isAuthenticated = false;
    this.router.navigateByUrl('/auth');
  }

}
