import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = sessionStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }
    const decodedrole = this.tokenDecoder(token)
    console.log(decodedrole);
    

    if (route.data?.['role'].indexOf(decodedrole.role) === -1) {
      this.router.navigate(['/productsList']);
      return false
    }

    sessionStorage.setItem('role', route.data?.['role']?.includes('admin'))
    return true;
  }

  private tokenDecoder(token: string) {
    try {      
      const payloadData = token.split('.')[1];
      return JSON.parse(atob(payloadData.replace(/-/g, '+').replace(/_/g, '/')));
    }
    catch (e) {
      return null;
    }
  }
  
}
