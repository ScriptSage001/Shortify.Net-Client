import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { ShortenLink } from '../../shared/models/shorten-link';
import { UrlService } from '../../shared/services/url/url.service';
import { ShareModalComponent } from '../../shared/utils/share-modal/share-modal.component';
import { DeleteModalComponent } from '../../shared/utils/delete-modal/delete-modal.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-detailed-link',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    ShareModalComponent,
    DeleteModalComponent,
    NgbTooltipModule
  ],
  templateUrl: './detailed-link.component.html',
  styleUrl: './detailed-link.component.scss'
})
export class DetailedLinkComponent implements OnInit {
  private code: string = '';
  public shortenLink: ShortenLink | null = null;

  public isLinkCopied: boolean = false;
  public isShareModalVisible: boolean = false;
  public isDeleteModalVisible: boolean = false;

  constructor(
    private activeRoute: ActivatedRoute,
    private service: UrlService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.code = this.activeRoute.snapshot.paramMap.get('code') || '';   
    this.getShortenLink();
  }

  private getShortenLink() {
    this.service.getShortenUrlByCode(this.code)
    .subscribe({
      next: (res: ShortenLink) => {
        this.shortenLink = res;
      },
      error: () => {
      }
    });
  }

  public getDomain(url: any) {
    try {
      const domain = new URL(url).hostname;
      return domain.startsWith('www.') ? domain.slice(4) : domain;
    } catch (error) {
      return 'Invalid Domain';
    }
  }

  public formatDateForDetail(dateString: any) {
    if (!dateString) 
      return 'Invalid Date';

    const date = new Date(dateString);
    if (isNaN(date.getTime()))
      return 'Invalid Date';

    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: undefined,
      timeZoneName: 'short'
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    return formattedDate;
  }

  public getFavIconUrl(url: any) {
    const domain = this.getDomain(url);
    const googleApi = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    return googleApi;
  }

  public copyToClipboard(link: any) {
    navigator.clipboard.writeText(link).then(
      () => {
        this.isLinkCopied = true;
        this.toastr.info('URL copied to clipboard!');
        setTimeout(() => {
          this.isLinkCopied = false;
        }, 1000);
      }
    )
  }

  public onShareModalOpen() {
    this.isShareModalVisible = true;
  }

  public onShareModalClose() {
    this.isShareModalVisible = false;
  }

  public onDeleteModalOpen() {
    this.isDeleteModalVisible = true;
  }
  
  public onDeleteModalClose() {
    this.isDeleteModalVisible = false;
  }

  public deleteLink() {
    this.service.deleteShortenUrl(this.shortenLink?.id!)
      .subscribe({
        next: (res) => {
          this.toastr.success(res);
          this.isDeleteModalVisible = false;
          this.getShortenLink();
          this.router.navigateByUrl('/links');
        },
        error: () => {
          this.isDeleteModalVisible = false;
        }
      });
  }

  public onEdit() {
    this.router.navigateByUrl(`links/${this.shortenLink?.code}/edit`);
  }
}
