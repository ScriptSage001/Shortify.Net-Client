import { Component, inject, Input, input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-offcanvas-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './offcanvas-navbar.component.html',
  styleUrl: './offcanvas-navbar.component.scss'
})
export class OffcanvasNavbarComponent {
  constructor(
    private router: Router
  ) { }

  public activeOffcanvas = inject(NgbActiveOffcanvas);
  @Input() userName: string = '';
  @Input() email: string = '';
  @Input() onSignOutTriggered!: () => void;

  public onSignOut() {
    this.activeOffcanvas.dismiss('Sign Out');
    if (this.onSignOutTriggered) {
      this.onSignOutTriggered();
    }
  }

  public navigateToUrl(url: string) {
    this.activeOffcanvas.dismiss('Navigation');
    this.router.navigateByUrl(url);
  }
}