import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { ProductController } from 'src/app/controller/productController.service';
import { UserControllerService } from '../../controller/user-controller.service';
import { Credentials } from '../../shared/models';
import { UserInteractionService } from '../service/user-interaction.service';
import { AuthorizeService } from './authorize.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate, CanLoad {
  userRole: string = '';

  constructor(private router: Router, private jwtToken: AuthorizeService, private notify: UserInteractionService,
    private loginHelperService: UserControllerService, private products: ProductController) {
    this.userRole = jwtToken.userAuthority;
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    console.info('[Guard]: Checking Responsiblites.');
    this.userRole = this.jwtToken.userAuthority;
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
    this.userRole = this.jwtToken.userAuthority;
    if (!this.jwtToken.isUserLoggedIn && !route.data?.['public']) {
      this.notify.sppWarning('Login to Continue');
      this.router.navigate(['login']);
      return false;
    } else if (route.data?.['public']) {
      return true;
    } else if (route.data?.['role'] && !route.data['role'].includes(this.userRole)) {
      this.jwtToken.clear();
      this.notify.sppError('Unauthorized User Error.');
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }


  loginHelper(params: Credentials) {
    console.info("[Guard]: Verifyng User.");
    this.loginHelperService.userController.login(params).subscribe(response => {
      if (response) {
        const authorized = response;
        this.jwtToken.authToken = authorized.token;
        this.userRole = this.jwtToken.userAuthority;
        this.products.fetchProducts(0, 15);
        if (this.jwtToken.userAuthority === 'user') {
          console.info(`[${this.userRole}]: User Verified 🔐.`);
          this.notify.sppInfo("✅ Welcome back! You’ve logged in successfully.");
          this.router.navigate(['user/']);
        } else if (this.jwtToken.userAuthority === 'admin') {
          console.info(`[${this.userRole}]: User Verified 🔐.`);
          this.notify.sppInfo("🔐 Logged in as Admin. Access granted.");
          this.router.navigate(['admin/']);
        }
        this.loginHelperService.getUser().subscribe(response => {
          this.loginHelperService.userDetail = response;
        });
      }
    }, (error) => {
      console.info(`[Gaurd]: User Failed to Verify 🔐.`);
      this.notify.sppError(error.error);
    });
  }
}
