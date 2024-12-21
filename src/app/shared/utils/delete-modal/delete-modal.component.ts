import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ErrorPagesMappingService } from '../../services/error/error-pages-mapping.service';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.scss'
})
export class DeleteModalComponent implements OnInit {
  @Input() shortUrlId: string = '';
  @Output() closeDeleteModal = new EventEmitter<void>();
  @Output() deleteShortUrl = new EventEmitter<string>();

  public contentGoneUrl: string = '';

  constructor(
    private errorPageMappingService: ErrorPagesMappingService
  ) { }

  ngOnInit(): void {
    this.contentGoneUrl = this.errorPageMappingService.getContentGoneUrl();
  }

  public closeModal() {
    this.closeDeleteModal.emit();
  }

  public emitDeleteUrlEvent() {
    this.deleteShortUrl.emit(this.shortUrlId);
  }
}
