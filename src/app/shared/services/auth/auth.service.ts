import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthMappingService } from './auth-mapping.service';
import { RegisterUserRequest } from '../../models/register-user-request';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_EXPIRATION_KEY, REFRESH_TOKEN_KEY } from '../../constants';
import { AuthResponse } from '../../models/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private mappingService: AuthMappingService
  ) { }

  public registerUser(body: RegisterUserRequest): Observable<any> {
    const url = this.mappingService.getRegistrationUrl();
    return this.http.post(url, body);
  }

  public loginUser(body: any): Observable<any> {
    const url = this.mappingService.getLoginUrl();
    return this.http.post(url, body);
  }

  public loginUserWithOtp(body: any): Observable<any> {
    const url = this.mappingService.getLoginWithOtpUrl();
    return this.http.post(url, body);
  }

  public forgotPassword(body: any): Observable<any> {
    const url = this.mappingService.getForgotPasswordUrl();
    return this.http.put(url, body, { responseType: 'text' });
  }

  public refreshToken(): Observable<any> {
    const url = this.mappingService.getRefreshTokenUrl();
    const body = this.getRefreshTokenPayload();
    this.removeRefreshToken();
    return this.http.post(url, body);
  }

  public revokeRefreshToken(): Observable<any> {
    const url = this.mappingService.getRevokeRefreshTokenUrl();
    return this.http.put(url, null, { responseType: 'text' });
  }
  
  public isLoggedIn() {   
    return this.getAccessToken() != null ? true : false;
  }

  // Utility function to add tokens to localStorage
  public saveToken(response: AuthResponse) {
    localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);        
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);        
    localStorage.setItem(REFRESH_TOKEN_EXPIRATION_KEY, response.refreshTokenExpirationTimeUtc);
  }
  
  // Utility function to remove tokens from localStorage
  public removeToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);        
    localStorage.removeItem(REFRESH_TOKEN_KEY);        
    localStorage.removeItem(REFRESH_TOKEN_EXPIRATION_KEY);
  }

  public getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  private getRefreshTokenPayload() {
    return {
      accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
      refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY)
    };
  }

  public canRefreshToken() {
    const expiration = localStorage.getItem(REFRESH_TOKEN_EXPIRATION_KEY);
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if ( accessToken && expiration && refreshToken ) {
      const expirationDate = new Date(expiration);
      const  now = new Date();
      return expirationDate >= now;
    }
    return false;
  }

  private removeRefreshToken() {
    localStorage.removeItem(REFRESH_TOKEN_KEY);        
    localStorage.removeItem(REFRESH_TOKEN_EXPIRATION_KEY);
  }
}
