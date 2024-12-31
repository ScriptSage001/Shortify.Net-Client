import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class AuthMappingService extends BaseService {
  private readonly REGISTER = 'register';
  private readonly LOGIN = 'login';
  private readonly LOGIN_WITH_OTP = 'login/otp';
  private readonly FORGOT_PASSWORD = 'password/reset/forgot';
  private readonly RESET_PASSWORD = 'password/reset';
  private readonly REFRESH_TOKEN = 'token/refresh';
  private readonly REVOKE_REFRESH_TOKEN = 'token/refresh/revoke';

  constructor() {
    super();
  }

  public getRegistrationUrl() {
    return this.authManagementUrl + this.REGISTER;
  }

  public getLoginUrl() {
    return this.authManagementUrl + this.LOGIN;
  }

  public getLoginWithOtpUrl() {
    return this.authManagementUrl + this.LOGIN_WITH_OTP;
  }

  public getForgotPasswordUrl() {
    return this.authManagementUrl + this.FORGOT_PASSWORD;
  }

  public getResetPasswordUrl() {
    return this.authManagementUrl + this.RESET_PASSWORD;
  }

  public getRefreshTokenUrl() {
    return this.authManagementUrl + this.REFRESH_TOKEN;
  }

  public getRevokeRefreshTokenUrl() {
    return this.authManagementUrl + this.REVOKE_REFRESH_TOKEN;
  }
}