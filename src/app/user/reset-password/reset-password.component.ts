import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { OtpService } from '../../shared/services/otp/otp.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { FirstKeyPipe } from '../../shared/pipes/first-key.pipe';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FirstKeyPipe,
    RouterLink
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  constructor(
    private toastr: ToastrService,
    private otpService: OtpService,
    private authService: AuthService,
    private router: Router
  ) {}

  public isSubmitted: boolean = false;
  public isOtpSent: boolean = false;
  public isOtpVerified: boolean = false;
  public fieldTextType: boolean = false;
  public repeatFieldTextType: boolean = false;
  public resendTimer: number = 60;
  public timerInterval: any;
  public emailVerificationToken: string = '';

  private formBuilder = inject(FormBuilder);

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): null => {
    const password = control.get('password')
    const confirmPassword = control.get('confirmPassword')

    if (password && confirmPassword && password.value != confirmPassword.value)
      confirmPassword?.setErrors({ passwordMismatch: true })
    else
      confirmPassword?.setErrors(null)

    return null;
  }

  form = this.formBuilder.group({
    email: ['', [
      Validators.required,
      Validators.email]],
    otp: ['', Validators.required],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(30),
      Validators.pattern(/(?=.*[^a-zA-Z0-9 ])/)]],
    confirmPassword: ['']
  }, { validators: this.passwordMatchValidator });

  public hasDisplayableError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return Boolean(control?.invalid) && (this.isSubmitted || Boolean(control?.dirty));
  }

  public toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  public toggleRepeatFieldTextType() {
    this.repeatFieldTextType = !this.repeatFieldTextType;
  }

  /*
   * To Send the Password Reset OTP 
   */
  public sendOtp() {
    if (this.form.controls.email.valid) {
      this.otpService.sendPasswordResetOtp(this.form.controls.email.value)
        .subscribe({
          next: (response: string) => {
            this.isOtpSent = true;
            this.form.controls.email.disable();
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
  }

  /*
   * To Re-Send the Password Reset OTP 
   */
  public reSendOtp() {
    this.otpService.sendPasswordResetOtp(this.form.controls.email.value)
      .subscribe({
        next: (response: string) => {
          this.isOtpSent = true;
          this.form.controls.email.disable();
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
    if (this.form.controls.otp.valid) {
      this.otpService.validateOtp(
        this.form.controls.email.value,
        this.form.controls.otp.value
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
  public resetPassword() {
    this.isSubmitted = true;

    const payload = {
      email: this.form.controls.email.value,
      newPassword: this.form.controls.password.value,
      confirmPassword: this.form.controls.confirmPassword.value,
      validateOtpToken: this.emailVerificationToken
    };

    this.authService.forgotPassword(payload)
      .subscribe({
        next: () => {
          this.form.reset();
          this.isSubmitted = false;
          this.toastr.success(
            'Redirecting to the SignIn.',
            'Password Changed Successfully!');

          //Start a 3-second timer to redirect to the SignIn
          setTimeout(() => {
            this.navigateToSignIn();
          }, 3000);
        },
        error: () => {
          this.isSubmitted = false;
        }
      });
  }

  // To navigate to SignIn page
  navigateToSignIn() {
    this.router.navigate(['/sign-in']);
  }

  // To navigate to Dashboard page
  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
