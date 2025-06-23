import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthorizeService } from '../Services/authorize.service';
import { UserInteractionService } from '../Services/user-interaction.service';

@Injectable()
export class apiInterceptor implements HttpInterceptor {
  constructor(private autorization: AuthorizeService, private loader: UserInteractionService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.loader.showLoader();
    const token = this.autorization.userIdentifier;
    if(token){
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    }
    return next.handle(request);
  }
}
