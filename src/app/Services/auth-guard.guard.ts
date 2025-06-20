import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { AuthorizeService } from './authorize.service';
import { UserInteractionService } from './user-interaction.service';
import { ApiInteractionService } from './api-interaction.service';
import { Credentials } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate, CanLoad {
  userRole: string = '';

  constructor(private router: Router, private jwtToken: AuthorizeService, private notify: UserInteractionService,
    private loginHelperService: ApiInteractionService) {
    this.userRole = jwtToken.getUserRole();
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    console.info('[Guard]: Checking Responsiblites.');
    if (this.userRole !== '' && this.userRole === route.data?.['role']) {
      console.info('[Guard]: User alllowed for the Route.');
      return true;
    } else if (route.data?.['public']) {
      console.info('[Guard]: Common Route Accessed.');
      return true;
    }
    console.info('[Guard]: Ask admin to grant Responsiblity.');
    return false;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.authorizer(route);
  }

  private authorizer(route: ActivatedRouteSnapshot): boolean {
    if (!this.jwtToken.getToken() && !route.data?.['public']) {
      this.notify.jobfail('Login to Continue');
      this.router.navigate(['login']);
      return false;
    } else if (route.data?.['public']) {
      return true;
    } else if (route.data?.['role'] && !route.data['role'].includes(this.userRole)) {
      this.notify.jobError('Unauthorized User Error.');
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }


  loginHelper(params: Credentials) {
    console.info("[Guard]: Verifyng User.")
    this.loginHelperService.userController.login(params).subscribe(response => {
      if (response) {
        const authorized = response;
        this.jwtToken.setToken(authorized.token);
        this.userRole = this.jwtToken.getUserRole();
        if (this.jwtToken.getUserRole() === 'admin') {
          console.info(`[${this.userRole}]: User Verified 🔐.`);
          this.notify.jobDone("🔐 Logged in as Admin. Access granted.");
          this.router.navigate(['/admin/dashBoard']);
        } else if (this.jwtToken.getUserRole() === 'user') {
          console.info(`[${this.userRole}]: User Verified 🔐.`);
          this.notify.jobDone("✅ Welcome back! You’ve logged in successfully.");
          this.router.navigate(['user/ProductList']);
        }
      }
    }, (error) => {
      console.info(`[Gaurd]: User Failed to Verify 🔐.`);
      this.notify.jobError(error.error);
    })
  }
}
