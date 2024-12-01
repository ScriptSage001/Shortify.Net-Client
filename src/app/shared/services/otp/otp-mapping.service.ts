import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class OtpMappingService extends BaseService {
  private readonly SEND_VERIFY_EMAIL_OTP = 'send/verify-email/';
  private readonly SEND_LOGIN_OTP = 'send/login/';
  private readonly SEND_PASSWORD_RESET_OTP = 'send/forgot-password/';
  private readonly VALIDATE_OTP = 'validate';

  constructor() {
    super();
  }

  public getSendVerifyEmailOtpUrl(email: string) {
    return this.otpManagementUrl + this.SEND_VERIFY_EMAIL_OTP + email;
  }

  public getValidateOtpUrl() {
    return this.otpManagementUrl + this.VALIDATE_OTP;
  }

  public getSendLoginOtpUrl(email: string) {
    return this.otpManagementUrl + this.SEND_LOGIN_OTP + email;
  }
  
  public getSendPasswordResetOtpUrl(email: string) {
    return this.otpManagementUrl + this.SEND_PASSWORD_RESET_OTP + email;
  }
}