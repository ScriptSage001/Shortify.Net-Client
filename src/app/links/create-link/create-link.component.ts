import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UrlService } from '../../shared/services/url/url.service';
import { ToastrService } from 'ngx-toastr';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorHandlerUtils } from '../../shared/utils/http-error-handler.utils';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-link',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NgbTooltipModule
  ],
  templateUrl: './create-link.component.html',
  styleUrl: './create-link.component.scss'
})
export class CreateLinkComponent {

  constructor(
    private service: UrlService,
    private toastr: ToastrService,
    private router: Router,
    private errorHandler: HttpErrorHandlerUtils
  ) { }

  public isSubmitted: boolean = false;
  private formBuilder = inject(FormBuilder);

  public form = this.formBuilder.group({
    destination: ['', Validators.required],
    title: [''],
    tags: this.formBuilder.array([])
  });

  get tags(): FormArray {
    return this.form.get('tags') as FormArray;
  }

  public addTag(event: any): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    if (value && (event.key === 'Enter' || event.key === 'Tab')) {
      this.tags.push(this.formBuilder.control(value));
      input.value = '';
      event.preventDefault();
    }
  }

  public removeTag(index: number): void {
    this.tags.removeAt(index);
  }

  public hasDisplayableError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return Boolean(control?.invalid) && (this.isSubmitted || Boolean(control?.dirty));
  }

  public onCreate() {
    if (this.form.valid) {
      const body = {
        url: this.form.get('destination')?.value,
        title: this.form.get('title')?.value,
        tags: this.form.get('tags')?.value
      }

      this.service.shortenUrl(body)
        .subscribe({
          next: (response: any) => {
            this.form.reset();
            this.isSubmitted = false;
            this.toastr.success('Url Shortened Successfully!');
            this.router.navigateByUrl('/links');
          },
          error: (err: HttpErrorResponse) => {
            this.isSubmitted = false;
            this.errorHandler.handleError(err);
          }
        });
    }
  }
}