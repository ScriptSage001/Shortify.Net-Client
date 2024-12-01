import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class UrlMappingService extends BaseService {
  private readonly SEND_VERIFY_EMAIL_OTP = 'send/verify-email/';

  constructor() {
    super()
  }

  public getSendVerifyEmailOtpUrl(email: string) {
    return this.otpManagementUrl + this.SEND_VERIFY_EMAIL_OTP + email;
  }
}