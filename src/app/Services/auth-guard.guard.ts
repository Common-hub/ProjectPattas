import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { AuthorizeService } from './authorize.service';
import { SearchService } from './search.service';
import { ApiInteractionService } from './api-interaction.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate, CanLoad {
  userRole: string = '';

  constructor(private router: Router, private jwtToken: AuthorizeService, private notify: SearchService, private loginHelperService: ApiInteractionService) {
    this.userRole = jwtToken.getrole();
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    if (this.userRole !== '' && this.userRole === route.data?.['role']) {
      return true;
    } else if (route.data?.['public']) { return true };
    return false;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.authorizer(route);
  }

  private authorizer(route: ActivatedRouteSnapshot): boolean {
    if (!this.jwtToken.getToken()) {
      this.notify.jobfail('Login to Continue');
      this.router.navigate(['login']);
      return false;
    } else if (route.data?.['public']) {
      console.log(route.data['public'], route.data?.['public']);

      return true;
    } else if (route.data?.['role'] && !route.data['role'].includes(this.userRole)) {
      this.notify.jobError('Unauthorized User Error.');
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }


  loginHelper(params: { userName: string, securityCode: string }) {
    this.loginHelperService.loguser(params).subscribe(response => {
      if (response) {
        const authorized = JSON.parse(response);
        this.jwtToken.setToken(authorized.token);
        if (this.jwtToken.getrole() === 'admin') {
          this.notify.jobDone("🔐 Logged in as Admin. Access granted.");
          this.router.navigate(['admin/DashBoard']);
        } else if (this.jwtToken.getrole() === 'user') {
          this.notify.jobDone("✅ Welcome back! You’ve logged in successfully.");
          this.router.navigate(['user/ProductList']);
        }
      }
    }, (error) => {
      this.notify.jobError(error.error);
    })
  }
}
