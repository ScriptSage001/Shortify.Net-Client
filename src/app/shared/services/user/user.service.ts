import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserMappingService } from './user-mapping.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserProfile } from '../../models/user-profile';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userDetailsSubject = new BehaviorSubject<any>(null);
  private emailSubject = new BehaviorSubject<string>('');

  public userDetails$ = this.userDetailsSubject.asObservable();
  public email$ = this.emailSubject.asObservable();

  constructor(
    private http: HttpClient,
    private mappingService: UserMappingService
  ) { }

  public getUserProfile(): Observable<any> {
    const url = this.mappingService.getUserProfileUrl();    
    return this.http.get(url);
  }

  public saveUserDetials(user: UserProfile)  {
    this.userDetailsSubject.next(user);
  }

  public clearUserDetials()  {
    this.userDetailsSubject.next(null);
  }

  public setEmail(email: string)  {
    this.emailSubject.next(email);
  }

  public removeEmail()  {
    this.emailSubject.next('');
  }
}