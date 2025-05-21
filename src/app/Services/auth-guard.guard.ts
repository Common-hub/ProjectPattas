import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {

  constructor (private router: Router){}

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(localStorage.getItem('isLoggedin')){
      if(route.data?.['role'].indexOf(localStorage.getItem('uRole')) === -1){
        this.router.navigate(['/productsList']);
        return false
      }
      return true;
    }
    else{
      this.router.navigate(['/login']);
      return false;
    }
  }
  
}
