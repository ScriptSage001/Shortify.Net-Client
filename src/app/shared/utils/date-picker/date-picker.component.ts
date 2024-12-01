import { Component } from '@angular/core';
import { NgbAlertModule, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [
    NgbDatepickerModule,
    NgbAlertModule,
    FormsModule,
    JsonPipe
  ],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss'
})
export class DatePickerComponent {
  public dateModel: NgbDateStruct | null = null;

  constructor() { }
}
