import { Injectable } from '@angular/core';
import { CanActivate, Router, Route, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private helperService: HelperService, private router: Router) {
  }
  checkLoggedIN() {
    if (this.helperService.appToken) {
      return true;
    }
    return false;
  }
  canActivate(next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    console.log('Url:'+ url);
    if (url === '/login') {
      if(this.checkLoggedIN()) {
        this.router.navigate(['layout/users']);
        return false;
      }
       return true;
    } else if (this.checkLoggedIN()) {
      return true;
    } else {
      this.router.navigate(['/login']);
    }
    return false;		
  }
}
