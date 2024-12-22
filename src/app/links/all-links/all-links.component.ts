import { Component } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgbDatepickerModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { ShortenLink } from '../../shared/models/shorten-link';
import { DatePickerComponent } from "../../shared/utils/date-picker/date-picker.component";
import { UrlService } from '../../shared/services/url/url.service';
import { PagedList } from '../../shared/models/paged-list';
import { ShareModalComponent } from '../../shared/utils/share-modal/share-modal.component';
import { DeleteModalComponent } from '../../shared/utils/delete-modal/delete-modal.component';
import { ToastrService } from 'ngx-toastr';
import { FilterModalComponent } from '../../shared/utils/filter-modal/filter-modal.component';
import { UserProfile } from '../../shared/models/user-profile';
import { UserService } from '../../shared/services/user/user.service';

@Component({
  selector: 'app-all-links',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NgbDatepickerModule,
    NgbPaginationModule,
    FormsModule,
    RouterLink,
    DatePickerComponent,
    ShareModalComponent,
    DeleteModalComponent,
    FilterModalComponent
  ],
  providers: [
    DatePipe
  ],
  templateUrl: './all-links.component.html',
  styleUrl: './all-links.component.scss'
})
export class AllLinksComponent {
  public links: PagedList<ShortenLink> | null = null;
  public selectedLink: ShortenLink | null = null;

  public pageNo: number = 1;
  public pageSize: number = 4;
  public collectionSize: number = this.pageSize;
  
  public fromDate: string = '';
  public toDate: string = '';
  public isDateFilterApplied: boolean = false; 
  public isDatePickerVisible: boolean = false;

  public searchTerm: string = '';
  public sortBy: string = 'createdOn';
  public sortOrder: string = 'desc';
  public isFilterApplied: boolean = false;
  public isFilterVisible: boolean = false;
  
  public shareShortUrl: string = '';
  public isShareModalVisible: boolean = false;
  
  public shortUrlIdForDelete: string = '';
  public isDeleteModalVisible: boolean = false;
 
  constructor(
    private datePipe: DatePipe,
    private urlService: UrlService,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.userDetails$
      .subscribe(user => {
        if (user) {
          this.getShortenUrls();
        }
      });
  }

  //#region Filter

  //#region Date Filter

  public showDatePicker() {
    this.isDatePickerVisible = true;
  }

  public hideDatePicker() {
    this.isDatePickerVisible = false;
  }

  public onDateFilterApplied(filter: { fromDate: string; toDate: string }) {
    const { fromDate, toDate } = filter;
    
    // Convert fromDate to UTC string
    this.fromDate = new Date(fromDate).toUTCString();

    // Include the entire toDate by setting time to 23:59:59.999
    const endOfDay = new Date(toDate);
    endOfDay.setHours(23, 59, 59, 999);
    this.toDate = endOfDay.toUTCString();

    // Fetch filtered URLs
    this.getShortenUrls();

    // Update UI state
    this.isDateFilterApplied = true;
    this.hideDatePicker();
  }

  //#endregion

  //#region Filter and Sort

  public showFilter() {
    this.isFilterVisible = true;
  }

  public hideFilter() {
    this.isFilterVisible = false;
  }

  public onFilterApplied(filter: { searchTerm: string; sortBy: string, sortOrder: string }) {
    const { searchTerm, sortBy, sortOrder } = filter;
    
    this.searchTerm = searchTerm;
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;

    // Fetch filtered URLs
    this.getShortenUrls();

    // Update UI state
    this.isFilterApplied = true;
    this.hideFilter();
  }

  //#endregion

  public clearAllFilter() {
    this.isDateFilterApplied = false;
    this.isFilterApplied = false;
    this.fromDate = '';
    this.toDate = '';
    this.searchTerm = '';
    this.sortBy = 'createdOn';
    this.sortOrder = 'desc';
    this.pageNo = 1;

    this.getShortenUrls();
  }

  //#endregion

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

  public copyToClipboard(link: any) {
    navigator.clipboard.writeText(link.shortUrl).then(
      () => {
        link.isCopiedFromCard = true;
        setTimeout(() => {
          link.isCopiedFromCard = false;
        }, 1000);
      }
    )
  }

  public onTitleClick(code: string) {
    this.router.navigateByUrl(`/links/${code}`);
  }

  //#region Share Modal

  public onShareModalOpen(url: string) {
    this.isShareModalVisible = true;
    this.shareShortUrl = url;
  }

  public onShareModalClose() {
    this.isShareModalVisible = false;
    this.shareShortUrl = '';
  }

  //#endregion

  //#region Delete Modal

  public onDeleteModalOpen(id: string) {
    this.isDeleteModalVisible = true;
    this.shortUrlIdForDelete = id;
  }
  
  public onDeleteModalClose() {
    this.isDeleteModalVisible = false;
  }

  //#endregion

  public deleteLink($event: string) {
    this.urlService.deleteShortenUrl($event)
      .subscribe({
        next: (res) => {
          this.toastr.success(res);
          this.isDeleteModalVisible = false;
          this.getShortenUrls();
        },
        error: () => {
          this.isDeleteModalVisible = false;
        }
      });
  }

  public getShortenUrls() {
    const sortOrder = this.sortOrder === 'desc' ? 'desc' : '';
    
    this.urlService.getShortenUrls(this.pageNo, this.pageSize, this.sortBy, sortOrder, this.fromDate, this.toDate, this.searchTerm)
    .subscribe({
      next: (response) => {
        if (response === null) {
          console.log(response);
        }
        this.links = response;
        this.setPagination();
      },
      error: (err) => {
        console.log(err);        
      }
    })
  }

  public onPageChange($event: any) {
    this.getShortenUrls();
  }

  private setPagination() {
    this.collectionSize = this.links?.totalCount ?? this.pageSize;
  }

  public getFavIconUrl(url: string) {
    const domain = this.getDomain(url);
    const googleApi = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    return googleApi;
  }

  public onEdit(code: string) {
    this.router.navigateByUrl(`links/${code}/edit`);
  }
}