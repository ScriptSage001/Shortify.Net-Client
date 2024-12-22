import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { FirstKeyPipe } from '../../shared/pipes/first-key.pipe';
import { OtpService } from '../../shared/services/otp/otp.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { RegisterUserRequest } from '../../shared/models/register-user-request';
import { AuthResponse } from '../../shared/models/auth-response';
import { UserService } from '../../shared/services/user/user.service';
import { UrlService } from '../../shared/services/url/url.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FirstKeyPipe
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnInit {

  constructor(
    private otpService: OtpService,
    private authService: AuthService,
    private userService: UserService,
    private urlService: UrlService,
    private toastr: ToastrService,
    private router: Router
  ) {
    userService.email$.subscribe({
      next: (email: string) => {
        this.form.controls.email.setValue(email);    
      }
    });
    const urlFromLanding = urlService.getDestinationUrlFromLanding();
    if (urlFromLanding && urlFromLanding != '') {
      this.isWithUrl = true;
    }
   }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  isOtpSent: boolean = false;
  isOtpVerified: boolean = false;
  isSignupSuccess: boolean = false;
  isSubmitted: boolean = false;
  fieldTextType: boolean = false;
  repeatFieldTextType: boolean = false;
  resendTimer: number = 60;
  timerInterval: any;
  emailVerificationToken: string = '';
  isWithUrl: boolean = false;

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
      Validators.email,
      Validators.maxLength(50)]],
    otp: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6)]],
    userName: ['', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(20)]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(30),
      Validators.pattern(/(?=.*[^a-zA-Z0-9 ])/)]],
    confirmPassword: ['']
  }, { validators: this.passwordMatchValidator });

  public onEmailBlur() {
    this.userService.setEmail(this.form.controls.email.value ?? '');
  }

  /*
   * To Submit the Registration Form and SignUp 
   */
  public signUp() {
    this.isSubmitted = true;
    const body: RegisterUserRequest = {
      userName: this.form.controls.userName.value,
      email: this.form.controls.email.value,
      password: this.form.controls.password.value,
      confirmPassword: this.form.controls.confirmPassword.value,
      validateOtpToken: this.emailVerificationToken
    };

    this.authService.registerUser(body)
    .subscribe({
      next: (response: AuthResponse) => {
        this.form.reset();
        this.isSubmitted = false;
        this.isSignupSuccess = true;
        this.authService.saveToken(response);
        this.toastr.success(
          'Redirecting to the Dashboard.',
          'User Registered Successfully!'); 

        //Start a 3-second timer to redirect to the Dashboard
        setTimeout(() => {
          this.navigateToDashboard();
        }, 3000);
      },
      error: () => {
        this.isSubmitted = false;     
        this.isSignupSuccess = false;        
      }
    })
  }

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
   * To Send the Email Verification OTP 
   */
  public sendOtp() {
    if (this.form.controls.email.valid) {
      this.otpService.sendVerifyEmailOtp(this.form.controls.email.value)
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
   * To Re-Send the Email Verification OTP 
   */
  public reSendOtp() {
    this.otpService.sendVerifyEmailOtp(this.form.controls.email.value)
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
   * To Verify the Email Verification OTP 
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

  // To navigate to SignIn page
  navigateToSignIn() {
    this.userService.setEmail(this.form.controls.email.value ?? '');
    this.router.navigate(['/sign-in']);
  }

  // To navigate to Dashboard page
  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}