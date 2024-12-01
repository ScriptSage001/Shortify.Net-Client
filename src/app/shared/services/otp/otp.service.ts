import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { OtpMappingService } from './otp-mapping.service';
import { ValidateOtpRequest } from '../../models/validate-otp-request';

@Injectable({
  providedIn: 'root'
})

export class OtpService {

  constructor(
    private http: HttpClient,
    private mappingService: OtpMappingService
  ) { }

  /*
   * Sends Email Verification OTP
   * @param email 
   * @returns 
   */
  public sendVerifyEmailOtp(email: any): Observable<any> {
    const url = this.mappingService.getSendVerifyEmailOtpUrl(email);
    return this.http.post(url, null, { responseType: 'text' });
  }

  /*
   * Sends Login OTP
   * @param email 
   * @returns 
   */
  public sendLoginOtp(email: any): Observable<any> {
    const url = this.mappingService.getSendLoginOtpUrl(email);
    return this.http.post(url, null, { responseType: 'text' });
  }
  
  /*
   * Sends Password Reset OTP
   * @param email 
   * @returns 
   */
  public sendPasswordResetOtp(email: any): Observable<any> {
    const url = this.mappingService.getSendPasswordResetOtpUrl(email);
    return this.http.post(url, null, { responseType: 'text' });
  }

  /*
   * Validates OTP 
   * @param email
   * @param otp
   * @returns
   */
  public validateOtp(email: any, otp: any): Observable<any> {
    const url = this.mappingService.getValidateOtpUrl();
    const body: ValidateOtpRequest = {
      email: email,
      otp: otp
    };

    return this.http.post(url, body, { responseType: 'text' });
  }
}