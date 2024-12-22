import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UrlService } from '../../shared/services/url/url.service';
import { NgIf } from '@angular/common';
import { AuthService } from '../../shared/services/auth/auth.service';

@Component({
  selector: 'app-landing-layout',
  standalone: true,
  imports: [
    NavbarComponent,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './landing-layout.component.html',
  styleUrl: './landing-layout.component.scss'
})
export class LandingLayoutComponent implements OnInit {
  public supportEmail: string = 'contact.shortify.net@gmail.com';
  public devEmail: string = 'scriptsage001@gmail.com';
  public currentYear: number = new Date().getFullYear();
  public isSubmitted: boolean = false;
  
  private formBuilder = inject(FormBuilder);

  public form = this.formBuilder.group({
    destinationUrl: ['', Validators.required]
  });
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private urlService: UrlService
  ) {}
  
  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {     
      this.router.navigateByUrl('/dashboard');
    }
  }

  public hasDisplayableError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return Boolean(control?.invalid) && (this.isSubmitted || Boolean(control?.dirty));
  }

  public onLinkGenerationClick() {
    this.isSubmitted = true;
    if (this.form.controls.destinationUrl.valid) {
      this.urlService.setDestinationUrlFromLanding(this.form.controls.destinationUrl.value ?? '');
      this.isSubmitted = false;
      this.router.navigateByUrl('/sign-in');
    }
  }
}
