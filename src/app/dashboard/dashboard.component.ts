import { Component, OnInit } from '@angular/core';

import { UserService } from '../shared/services/user/user.service';
import { UserProfile } from '../shared/models/user-profile';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  public userProfile: UserProfile | null = null;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.userDetails$
      .subscribe(user => {
        this.userProfile = user
      });
  }
}
