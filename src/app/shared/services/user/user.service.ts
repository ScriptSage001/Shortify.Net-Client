import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserMappingService } from './user-mapping.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserProfile } from '../../models/user-profile';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userDetailsSubject = new BehaviorSubject<any>(null);
  public userDetails$ = this.userDetailsSubject.asObservable();

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
}