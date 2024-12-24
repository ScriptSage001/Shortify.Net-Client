import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sort-modal',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './sort-modal.component.html',
  styleUrl: './sort-modal.component.scss'
})
export class SortModalComponent {
  @Output() sortApplied = new EventEmitter<{
    sortBy: string;
    sortOrder: string;
  }>();
  @Output() sortClosed = new EventEmitter<void>();

  @Input() sortBy: string = '';
  @Input() sortOrder: string = '';

  constructor() { }

  public closeModal() {
    this.sortClosed.emit();
  }

  public clearSort() {
    this.sortBy = '';  
    this.sortOrder = '';
  }

  public applySort() {
    this.sortApplied.emit({
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    });
    this.closeModal();
  }
}
