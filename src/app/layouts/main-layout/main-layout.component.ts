import { Component, inject, OnInit } from '@angular/core';
import { ChildrenOutletContexts, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { animate, query, style, transition, trigger } from '@angular/animations';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../shared/services/auth/auth.service';
import { UserService } from '../../shared/services/user/user.service';
import { UserProfile } from '../../shared/models/user-profile';
import { OffcanvasNavbarComponent } from '../../offcanvas-navbar/offcanvas-navbar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  animations: [
    trigger('routerFadeIn', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0}),
          animate('1s ease-in-out', 
            style({ opacity: 1 }))
        ], { optional: true })
      ])
    ])
  ]
})
export class MainLayoutComponent implements OnInit {

  public userDetails: UserProfile | null = null;
  private offcanvasService = inject(NgbOffcanvas);

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private context: ChildrenOutletContexts
  ) { }

  ngOnInit(): void {
    this.getUserProfile();
  }

  private getUserProfile() {
    this.userService.getUserProfile()
    .subscribe({
      next: (response: UserProfile) => {
        this.userService.saveUserDetials(response);
        this.userDetails = response;
      },
      error: () => {
      }
    });
  }

  public onLogout() {
    this.authService.revokeRefreshToken()
    .subscribe({
      next: () => {
        this.userService.clearUserDetials();
        this.authService.removeToken();
        this.router.navigateByUrl('/sign-in');
      }
    });
  }

  public toggleDropDown() {
    const dropdownBtn = document.getElementById('dropdown-btn');
    const dropdownList = document.getElementById('dropdown-list');

    if ( dropdownBtn && dropdownList ) {
      dropdownBtn.classList.toggle('show');
      dropdownList.classList.toggle('show');
      dropdownList.classList.toggle('dropdown-list-show');
    }
  }

  public openOffcanvas() {
    const offcanvasRef = this.offcanvasService.open(OffcanvasNavbarComponent);
    offcanvasRef.componentInstance.userName = this.userDetails?.userName;
    offcanvasRef.componentInstance.email = this.userDetails?.email;
    offcanvasRef.componentInstance.onSignOutTriggered = () => this.onLogout();
  }

  public getRouteUrl() {
    return this.context.getContext('primary')?.route?.url;
  }
}
