import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanLoad, Router, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthGuardService } from './auth-guard.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(private authService: AuthGuardService, private router: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): boolean | Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.isAuthenticated){
      this.router.navigateByUrl('/auth');
    }
    return this.authService.isAuthenticated;
  }

}
