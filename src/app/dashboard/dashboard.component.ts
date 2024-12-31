import { Component, OnInit } from '@angular/core';

import { UserService } from '../shared/services/user/user.service';
import { UserProfile } from '../shared/models/user-profile';
import { UrlService } from '../shared/services/url/url.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  public userProfile: UserProfile | null = null;
  public isWithUrl: boolean = false;

  constructor(
    private userService: UserService,
    private urlService: UrlService,
    private router: Router,
    private toastr: ToastrService
  ) { 
    const urlFromLanding = urlService.getDestinationUrlFromLanding();
    if (urlFromLanding && urlFromLanding != '') {
      this.isWithUrl = true;
      this.createShortUrlFromLanding(urlFromLanding);
    }
  }

  ngOnInit(): void {
    this.userService.userDetails$
      .subscribe(user => {
        this.userProfile = user
      });
  }

  private createShortUrlFromLanding(destinationUrl: string) {
    const body = {
      url: destinationUrl
    }
    this.urlService.shortenUrl(body).subscribe({
      next: (res: string) => {
        const code = res.slice(-7);
        this.isWithUrl = false;
        this.router.navigateByUrl(`/links/${code}`);
        this.toastr.success('Your Short URL Created Successfully!');
        this.urlService.removeDestinationUrlFromLanding();
      }
    });
  }
}
