import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/features/Auth/models/user.model';
import { AuthService } from 'src/app/features/Auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  user?: User;
  
  constructor(private authService : AuthService, private router: Router){}
  
  ngOnInit(){
    this.authService.user().subscribe({
      next:(response)=>{
        this.user=response;
      }
    })

    this.user = this.authService.getUser();
  }

  onLogout(){
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

}
