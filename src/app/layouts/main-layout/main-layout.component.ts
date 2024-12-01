import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../shared/services/auth/auth.service';
import { UserService } from '../../shared/services/user/user.service';
import { UserProfile } from '../../shared/models/user-profile';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit {

  public userDetails: UserProfile | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
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
}
