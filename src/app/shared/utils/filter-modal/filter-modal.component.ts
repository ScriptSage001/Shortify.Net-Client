import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-modal',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './filter-modal.component.html',
  styleUrl: './filter-modal.component.scss'
})
export class FilterModalComponent {
  @Output() filterApplied = new EventEmitter<{
    searchTerm: string;
    sortBy: string;
    sortOrder: string;
  }>();
  @Output() filterClosed = new EventEmitter<void>();

  @Input() searchTerm: string = '';
  @Input() sortBy: string = '';
  @Input() sortOrder: string = '';

  constructor() { }

  public closeModal() {
    this.filterClosed.emit();
  }

  public clearFilter() {
    this.searchTerm = '';
    this.sortBy = 'createdOn';  
    this.sortOrder = 'desc';
  }

  public applyFilter() {
    this.filterApplied.emit({
      searchTerm: this.searchTerm,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    });
    this.closeModal();
  }
}
