import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChildrenOutletContexts, Router, RouterOutlet } from '@angular/router';
import { animate, query, style, transition, trigger } from '@angular/animations';
import { NgIf } from '@angular/common';

import { UrlService } from '../../shared/services/url/url.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { BaseService } from '../../shared/services/base.service';

@Component({
  selector: 'app-landing-layout',
  standalone: true,
  imports: [
    NavbarComponent,
    ReactiveFormsModule,
    NgIf,
    RouterOutlet
  ],
  templateUrl: './landing-layout.component.html',
  styleUrl: './landing-layout.component.scss',
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
export class LandingLayoutComponent implements OnInit {
  public supportEmail: string = 'contact.shortify.net@gmail.com';
  public devEmail: string = 'scriptsage001@gmail.com';
  public currentYear: number = new Date().getFullYear();
  public isSubmitted: boolean = false;
  public isRouterView: boolean = false;
  
  private formBuilder = inject(FormBuilder);

  public form = this.formBuilder.group({
    destinationUrl: ['', Validators.required]
  });
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private urlService: UrlService,
    private baseService: BaseService,
    private context: ChildrenOutletContexts
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

  public getSwaggerUrl(): string {
    return this.baseService.onlyDomain + '/swagger/index.html';
  }

  public routeChanged(event: { route: string }) {
    const { route } = event;
    if (route === 'about' || route === 'resource') {
      this.isRouterView = true;
    } else {
      this.isRouterView = false;
    }
  }

  public getRouteUrl() {
    return this.context.getContext('primary')?.route?.url;
  }
}
