import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { ShortenLink } from '../shared/models/shorten-link';
import { ErrorPagesMappingService } from '../shared/services/error/error-pages-mapping.service';
import { DatePickerComponent } from "../shared/utils/date-picker/date-picker.component";

@Component({
  selector: 'app-links',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NgbDatepickerModule,
    FormsModule,
    DatePickerComponent
],
  providers: [
    DatePipe
  ],
  templateUrl: './links.component.html',
  styleUrl: './links.component.scss'
})
export class LinksComponent implements OnInit {
  private links: ShortenLink[] = [
    {
      id: 'yi8we943rh4',
      userId: 'shdfgu2384ry83bf',
      originalUrl: 'https://www.amazon.in/b/ref=ohlr_bstof_Budgetstore/?_encoding=UTF8&node=21557580031&pd_rd_w=vE9MS&content-id=amzn1.sym.c64f29ee-f7b4-419c-aaf2-90b6326edc4d&pf_rd_p=c64f29ee-f7b4-419c-aaf2-90b6326edc4d&pf_rd_r=2W4H8PC98JJ21DGMCVP2&pd_rd_wg=W51eh&pd_rd_r=f4e3b4b0-4c22-4c16-99e6-87bedb5fe760&ref_=pd_hp_d_hero_unk',
      shortUrl: 'shortify.net/Lkajus',
      code: 'Lkajus',
      title: 'Amazon Sale Link',
      tags: [],
      createdOnUtc: '2024-11-13 13:00:13.04006+00',
      updatedOnUtc: null
    },
    {
      id: 'yi8we943rh4',
      userId: 'shdfgu2384ry83bf',
      originalUrl: 'https://www.amazon.in/b/ref=ohlr_bstof_Budgetstore/?_encoding=UTF8&node=21557580031&pd_rd_w=vE9MS&content-id=amzn1.sym.c64f29ee-f7b4-419c-aaf2-90b6326edc4d&pf_rd_p=c64f29ee-f7b4-419c-aaf2-90b6326edc4d&pf_rd_r=2W4H8PC98JJ21DGMCVP2&pd_rd_wg=W51eh&pd_rd_r=f4e3b4b0-4c22-4c16-99e6-87bedb5fe760&ref_=pd_hp_d_hero_unk',
      shortUrl: 'shortify.net/klsjkd',
      code: 'klsjkd',
      title: null,
      tags: ['Sale', 'Amazon'],
      createdOnUtc: '2024-11-16 13:00:13.04006+00',
      updatedOnUtc: null
    },
    {
      id: 'yi8we943rh4',
      userId: 'shdfgu2384ry83bf',
      originalUrl: 'https://www.amazon.in/b/ref=ohlr_bstof_Budgetstore/?_encoding=UTF8&node=21557580031&pd_rd_w=vE9MS&content-id=amzn1.sym.c64f29ee-f7b4-419c-aaf2-90b6326edc4d&pf_rd_p=c64f29ee-f7b4-419c-aaf2-90b6326edc4d&pf_rd_r=2W4H8PC98JJ21DGMCVP2&pd_rd_wg=W51eh&pd_rd_r=f4e3b4b0-4c22-4c16-99e6-87bedb5fe760&ref_=pd_hp_d_hero_unk',
      shortUrl: 'shortify.net/Lkajus',
      code: 'Lkajus',
      title: 'Amazon Sale Link',
      tags: ['Sale', 'Amazon'],
      createdOnUtc: '2024-11-20 13:00:13.04006+00',
      updatedOnUtc: null
    }
  ];
  public filteredLinks: ShortenLink[] = this.links;

  public selectedLink: ShortenLink | null = null;
  public contentGoneUrl: string = '';  

  public fromDate: string = '';
  public toDate: string = '';

  public isDateFilterApplied: boolean = false;
  public isDatePickerVisible: boolean = false;

  constructor(
    private datePipe: DatePipe,
    private errorPageMappingService: ErrorPagesMappingService
  ) { }

  ngOnInit(): void {   
    this.contentGoneUrl = this.errorPageMappingService.getContentGoneUrl();
  }

  public showDatePicker() {
    this.isDatePickerVisible = true;
  }

  public hideDatePicker() {
    this.isDatePickerVisible = false;
  }

  public onDateFilterApplied(filter: { fromDate: string; toDate: string }) {
    const { fromDate, toDate } = filter;
    this.fromDate = fromDate;
    this.toDate = toDate;
    
    const fDate = new Date(fromDate);
    const tDate = new Date(toDate);
    
    this.filteredLinks = this.links.filter(item => {
      const date = new Date(item.createdOnUtc.slice(0, 10));
      return (!fDate || date >= fDate) && (!tDate || date <= tDate)
    });

    this.isDateFilterApplied = true;
    this.hideDatePicker();
  }

  public clearAllFilter() {
    this.isDateFilterApplied = false;
    this.filteredLinks = this.links;
  }

  public getDomain(url: string) {
    try {
      const domain = new URL(url).hostname;
      return domain.startsWith('www.') ? domain.slice(4) : domain;
    } catch (error) {
      return 'Invalid Domain';
    }
  }

  public formatDateForCard(dateString: string) {
    const formattedDate = this.datePipe.transform(dateString, 'MMM dd, yyyy');
    return formattedDate || 'Invalid Date';
  }

  public formatDateForFilter(dateString: string) {
    const formattedDate = this.datePipe.transform(dateString, 'MMM dd');
    return formattedDate || 'Invalid Date';
  }

  public copyToClipboard(link: any, source: string) {
    if (source === 'card') {
      navigator.clipboard.writeText(link.shortUrl).then(
        () => {
          link.isCopiedFromCard = true;
          setTimeout(() => {
            link.isCopiedFromCard = false;
          }, 1000);
        }
      )
    } else if (source === 'modal') {
      navigator.clipboard.writeText(link.shortUrl).then(
        () => {
          link.isCopiedFromShareModal = true;
          setTimeout(() => {
            link.isCopiedFromShareModal = false;
          }, 1000);
        }
      )
    }
  }

  public selectLink(link: ShortenLink) {
    this.selectedLink = link;
  }

  public deSelectLink() {
    this.selectedLink = null;
  }

  public deleteLink(Link: any) {

  }
}