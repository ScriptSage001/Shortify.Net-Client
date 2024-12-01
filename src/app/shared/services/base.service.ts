import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  public baseApiUrl: string;
  public onlyDomain: string;
  public otpManagementUrl: string;
  public authManagementUrl: string;
  public userManagementUrl: string;

  private readonly OTP_MANAGEMENT_URL = 'v1/otp/';
  private readonly AUTH_MANAGEMENT_URL = 'v1/auth/';
  private readonly USER_MANAGEMENT_URL = 'v1/user/';

  constructor() {
    this.baseApiUrl = environment.baseApiUrl;
    this.onlyDomain = this.getDomain(this.baseApiUrl);
    this.otpManagementUrl = this.baseApiUrl + this.OTP_MANAGEMENT_URL;
    this.authManagementUrl = this.baseApiUrl + this.AUTH_MANAGEMENT_URL;
    this.userManagementUrl = this.baseApiUrl + this.USER_MANAGEMENT_URL;
  }

  private getDomain(urlString: string) {
    try {
      const url = new URL(urlString);

      var protocol = url.protocol;
      var domain = url.hostname;
      var port  = url.port;

      const newUrl = `${protocol}//${domain}:${port}`; 
      return newUrl;
    } catch (error) {
      return 'Invalid Domain';
    }
  }
}