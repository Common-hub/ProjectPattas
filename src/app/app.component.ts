import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Suriya Pryo Park';
  isLoggedIn: boolean = false;
  
  constructor(private router: Router){
    
    this.router.events.subscribe(event =>{
      if(event instanceof NavigationEnd){
        const currentRoute = event.urlAfterRedirects;

        this.isLoggedIn = !!sessionStorage.getItem('token') || currentRoute.startsWith('/productsList');
      }
    })
  }
}
