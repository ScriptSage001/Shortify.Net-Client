import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { OtpService } from '../../shared/services/otp/otp.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { AuthResponse } from '../../shared/models/auth-response';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent implements OnInit {

  public fieldTextType: boolean = false;
  public isSubmitted: boolean = false;
  public isOtpLogin: boolean = false;
  public isOtpSent: boolean = false;
  public resendTimer: number = 60;
  public timerInterval: any;

  constructor(
    private otpService: OtpService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {     
      this.router.navigateByUrl('/dashboard');
    }
  }
  
  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    email: ['', [
      Validators.required,
      Validators.email
    ]],
    password: ['', Validators.required],
    otp:['']
  });

  public toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  public hasDisplayableError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return Boolean(control?.invalid) && (this.isSubmitted || Boolean(control?.dirty));
  }

  public toggleOtpLogin() {
    this.isOtpLogin = !this.isOtpLogin;
  }

  // To navigate to Dashboard page
  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  public sendLoginOtp() {
    if (this.form.controls.email.valid) {
      this.otpService.sendLoginOtp(this.form.controls.email.value)
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

  public signIn() {
    if(this.form.valid) {
      const { email, password } = this.form.value;

      const payload = {
        userName: null,
        email: email,
        password: password
      };      

      this.authService.loginUser(payload)
      .subscribe({
        next: (response: AuthResponse) => {
          this.form.reset();
          this.isSubmitted = false;
          this.authService.saveToken(response);
          this.toastr.success(
            'Redirecting to the Dashboard.',
            'User Logged In Successfully!'); 
          this.navigateToDashboard();          
        },
        error: () => {
          this.isSubmitted = false;          
        }
      });
    }
  }

  public signInwithOtp() {    
    if(this.form.controls.otp.valid) {
      const payload = {
        email: this.form.controls.email.value,
        otp: this.form.controls.otp.value
      }
      
      this.authService.loginUserWithOtp(payload)
      .subscribe({
        next: (response: AuthResponse) => {
          this.form.reset();
          this.isSubmitted = false;
          this.authService.saveToken(response);
          this.toastr.success(
            'Redirecting to the Dashboard.',
            'User Logged In Successfully!');
          this.navigateToDashboard();
        },
        error: () => {  
          this.isSubmitted = false;
        }
      });
      
    }
    
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

  // Utility function to check if the input is an email
  private isEmail(value: string): boolean {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
  }
}
