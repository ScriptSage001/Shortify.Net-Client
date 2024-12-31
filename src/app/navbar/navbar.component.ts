import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Output() routeChanged = new EventEmitter<{ route: string }>();
  constructor(private router: Router) {}
  
  navigateToLanding() {
    this.routeChanged.emit({
      route: 'home'
    });
    this.router.navigate(['']);
  }

  navigateToSignIn() {
    this.routeChanged.emit({
      route: 'home'
    });
    this.router.navigate(['/sign-in']);
  }

  navigateToSignUp() {
    this.routeChanged.emit({
      route: 'home'
    });
    this.router.navigate(['/sign-up']);
  }

  navigateToAboutUs() {
    this.routeChanged.emit({
      route: 'about'
    });
    this.router.navigate(['/about-us']);
  }
  
  navigateToResources() {
    this.routeChanged.emit({
      route: 'resource'
    });
    this.router.navigate(['/resource']);
  }
}
