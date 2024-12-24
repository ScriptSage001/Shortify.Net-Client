import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'
;
import { UrlService } from '../../shared/services/url/url.service';
import { ShortenLink } from '../../shared/models/shorten-link';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-link',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NgbTooltipModule
  ],
  templateUrl: './edit-link.component.html',
  styleUrl: './edit-link.component.scss'
})
export class EditLinkComponent implements OnInit {
  private code: string = '';
  public shortenLink: any;

  public isTitleInEditMode: boolean = false;
  public isOriginalUrlInEditMode: boolean = false;
  
  public isSubmitted: boolean = false;
  private formBuilder = inject(FormBuilder);
  
  constructor (
    private activeRoute: ActivatedRoute,
    private service: UrlService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.code = this.activeRoute.snapshot.paramMap.get('code') || '';
    this.getShortenLink();
  }

  public form = this.formBuilder.group({
    title: [''],
    shortUrl: [''],
    originalUrl: ['', Validators.required],
    tags: this.formBuilder.array([])
  });

  private getShortenLink() {
    this.service.getShortenUrlByCode(this.code)
    .subscribe({
      next: (res: ShortenLink) => {
        this.shortenLink = res;
        this.populateEditForm();
      },
      error: () => {
      }
    });
  }

  private populateEditForm() {
    this.form = this.formBuilder.group({
      title: [this.shortenLink.title ?? ''],
      shortUrl: [this.shortenLink.shortUrl],
      originalUrl: [this.shortenLink.originalUrl ?? '', Validators.required],
      tags: this.formBuilder.array(this.shortenLink.tags ?? [])
    });

    this.form.controls.title.disable();
    this.form.controls.shortUrl.disable();
    this.form.controls.originalUrl.disable();
  }

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

  public onEdit() {
    if (this.form.valid) {
      const body = {
        id: this.shortenLink.id,
        originalUrl: this.form.get('originalUrl')?.value,
        title: this.form.get('title')?.value,
        tags: this.form.get('tags')?.value
      }

      this.service.updateShortenUrl(body)
        .subscribe({
          next: (response: any) => {
            this.isSubmitted = false;
            this.toastr.success('Updated Successfully!');
            this.router.navigateByUrl(`/links/${response.code}`);
          },
          error: () => {
            this.isSubmitted = false;
          }
        });
    }
  }

  public switchEditMode(input: string) {
    if (input === 'title') {
      if (this.isTitleInEditMode) {
        this.form.controls.title.disable();
        this.isTitleInEditMode = false;
      } else {
        this.form.controls.title.enable();
        this.isTitleInEditMode = true;
      }
    }

    if (input === 'originalUrl') {
      if (this.isOriginalUrlInEditMode) {
        this.form.controls.originalUrl.disable();
        this.isOriginalUrlInEditMode = false;
      } else {
        this.form.controls.originalUrl.enable();
        this.isOriginalUrlInEditMode = true;
      }
    }
  }
}