import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user/user.service';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { AuthService } from '../shared/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpErrorHandlerUtils } from '../shared/utils/http-error-handler.utils';
import { FirstKeyPipe } from '../shared/pipes/first-key.pipe';
import { OtpService } from '../shared/services/otp/otp.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIf,
    FirstKeyPipe
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  constructor (
    private userService: UserService,
    private authService: AuthService,
    private otpService: OtpService,
    private toastr: ToastrService,
    private router: Router,
    private httpErrorHandler: HttpErrorHandlerUtils
  ) {}

  ngOnInit(): void {
    this.userService.userDetails$.subscribe({
      next: (res) => {
        this.user = res;
      }
    });
  }

  public user: any;
  public isPasswordChangeRequested: boolean = false;
  public currentPasswordTextType: boolean = false;
  public newPasswordTextType: boolean = false;
  public confirmPasswordTextType: boolean = false;
  public newPasswordFpTextType: boolean = false;
  public confirmPasswordFpTextType: boolean = false;
  public isOtpSent: boolean = false;
  public isOtpVerified: boolean = false;
  public isSubmitted: boolean = false;
  public resendTimer: number = 60;
  public timerInterval: any;
  public emailVerificationToken: string = '';

  private formBuilder = inject(FormBuilder);
  private passwordMatchValidator: ValidatorFn = (control: AbstractControl): null => {
    const newPassword = control.get('newPassword')
    const confirmPassword = control.get('confirmPassword')

    if (newPassword && confirmPassword && newPassword.value != confirmPassword.value)
      confirmPassword?.setErrors({ passwordMismatch: true })
    else
      confirmPassword?.setErrors(null)

    return null;
  }

  public passwordResetForm = this.formBuilder.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(30),
      Validators.pattern(/(?=.*[^a-zA-Z0-9 ])/)]],
    confirmPassword:['', Validators.required]
  }, { validators: this.passwordMatchValidator });
  
  public forgotPasswordForm = this.formBuilder.group({
    otp: ['', Validators.required],
    newPassword: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(30),
      Validators.pattern(/(?=.*[^a-zA-Z0-9 ])/)]],
    confirmPassword:['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  public hasDisplayableError(controlName: string): boolean {
    const control = this.passwordResetForm.get(controlName);
    return Boolean(control?.invalid) && (this.isPasswordChangeRequested || Boolean(control?.dirty));
  }

  public hasDisplayableErrorInForgerPassword(controlName: string): boolean {
    const control = this.forgotPasswordForm.get(controlName);
    return Boolean(control?.invalid) && (this.isSubmitted || Boolean(control?.dirty));
  }

  public onPasswordChange() {
    if (this.passwordResetForm.valid) {
      const { currentPassword, newPassword, confirmPassword } = this.passwordResetForm.value;

      const payload = {
        oldPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword
      };

      this.authService.resetPassword(payload).subscribe({
        next: (res) => {
          this.passwordResetForm.reset();
          this.isPasswordChangeRequested = false;
          this.toastr.success(
            'Redirecting to the Sign-In page.', res);
          this.authService.revokeRefreshToken()
          .subscribe({
            next: () => {
              this.logoutAndNavigateToSignIn();
            }
          });
        },
        error: (err: HttpErrorResponse) => {
          this.isPasswordChangeRequested = false;
          this.httpErrorHandler.handleError(err);
        }
      });
    }
  }

  public toggleFieldTextType(field: string) {
    if (field === 'currentPassword') {
      this.currentPasswordTextType = !this.currentPasswordTextType;
    } else if (field === 'newPassword') {
      this.newPasswordTextType = !this.newPasswordTextType;
    } else if (field === 'confirmPassword') {
      this.confirmPasswordTextType = !this.confirmPasswordTextType;
    } else if (field === 'newPasswordFp') {
      this.newPasswordFpTextType = !this.newPasswordFpTextType;
    } else if (field === 'confirmPasswordFp') {
      this.confirmPasswordFpTextType = !this.confirmPasswordFpTextType;
    }
  }

  /*
   * To Send the Password Reset OTP 
   */
  public sendOtp() {
    this.otpService.sendPasswordResetOtp(this.user.email)
      .subscribe({
        next: (response: string) => {
          this.isOtpSent = true;
          this.toastr.success(response);
        },
        error: () => {
          this.isOtpSent = false;
        }
      });

    // Start a resend timer
    this.resendTimer = 60;
    this.startResendTimer();
  }

  /*
   * To Re-Send the Password Reset OTP 
   */
  public reSendOtp() {
    this.otpService.sendPasswordResetOtp(this.user.email)
      .subscribe({
        next: (response: string) => {
          this.isOtpSent = true;
          this.toastr.success(response);
        },
        error: () => {
          this.isOtpSent = false;
        }
      });

    // Start a resend timer
    this.resendTimer = 60;
    this.startResendTimer();
  }

  // Function to start a resend timer
  private startResendTimer() {
    this.timerInterval = setInterval(() => {
      if (this.resendTimer > 0) {
        this.resendTimer--;
      } else {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  /*
   * To Verify the Password Reset OTP 
   */
  public verifyOtp() {
    if (this.forgotPasswordForm.controls.otp.valid) {
      this.otpService.validateOtp(
        this.user.email,
        this.forgotPasswordForm.controls.otp.value
      ).subscribe({
        next: (response: string) => {
          this.isOtpVerified = true;
          this.emailVerificationToken = response;
          this.toastr.success('OTP Verified Successfully!');
        },
        error: () => {
          this.isOtpVerified = false;
        }
      });
    }
  }

  /*
   * To Reset the Password 
   */
  public onForgetPassword() {
    this.isSubmitted = true;

    const payload = {
      email: this.user.email,
      newPassword: this.forgotPasswordForm.controls.newPassword.value,
      confirmPassword: this.forgotPasswordForm.controls.confirmPassword.value,
      validateOtpToken: this.emailVerificationToken
    };

    this.authService.forgotPassword(payload)
      .subscribe({
        next: () => {
          this.forgotPasswordForm.reset();
          this.isSubmitted = false;
          this.toastr.success(
            'Redirecting to the SignIn.',
            'Password Changed Successfully!');

          //Start a 0.5-second timer to redirect to the SignIn
          setTimeout(() => {
            this.logoutAndNavigateToSignIn();
          }, 500);
        },
        error: (err: HttpErrorResponse) => {
          this.isSubmitted = false;
          this.httpErrorHandler.handleError(err);
        }
      });
  }

  // To LogOut and navigate to SignIn page
  private logoutAndNavigateToSignIn() {
    this.userService.setEmail(this.user.email ?? '');
    this.userService.clearUserDetials();
    this.authService.removeToken();
    this.router.navigate(['/sign-in']);
  }
}