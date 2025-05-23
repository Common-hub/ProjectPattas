import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  errorMsg: string = "";
  type: string = "";

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  showCart(){   
    if(sessionStorage.getItem('token')){ 
    this.router.navigate(['viewCart'])
  }
  else{
    this.router.navigate(['login'])
  }
  }

  showProfile(){
    if(sessionStorage.getItem('token')){}else{
      this.errorMsg = "Login to see Profile Details";
      this.type = " warning"
      setTimeout(() => {
        this.errorMsg = ""
      }, 3000);
    }
  }
}
