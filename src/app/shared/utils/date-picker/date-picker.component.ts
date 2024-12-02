import { Component, EventEmitter, inject, Output } from '@angular/core';
import { NgbAlertModule, NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
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
  @Output() filterApplied = new EventEmitter<{
    fromDate: string;
    toDate: string;
  }>();
  @Output() filterClosed = new EventEmitter<void>();

  public calendar = inject(NgbCalendar);
  public formatter = inject(NgbDateParserFormatter);

  public maxDate: NgbDate = this.calendar.getToday();
  public hoveredDate: NgbDate | null = null;
  public fromDate: NgbDate | null = this.calendar.getPrev(this.calendar.getToday(), 'd', 15);
  public toDate: NgbDate | null = this.calendar.getToday();
  public checkedDWM: string | null = null;

  constructor() { }

  //#region Button Actions

  public applyFilter() {
    this.filterApplied.emit({
      fromDate: this.stringifyDate(this.fromDate),
      toDate: this.stringifyDate(this.toDate)
    });
    this.closeFilter();
  }

  public closeFilter() {
    this.filterClosed.emit();
  }

  public clearFilter() {
    this.fromDate = this.calendar.getPrev(this.calendar.getToday(), 'd', 15);
    this.toDate = this.calendar.getToday();   
    this.checkedDWM = null; 
  }

  //#endregion
    
  //#region Validations for adding different classes on the days
  
  public isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }
  
  public isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}
  
  public isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}
  
  public isDateDisabled(date: NgbDate) {
    return date.after(this.maxDate);
  }
  
  //#endregion
  
  //#region Input and Selection Actions

  public onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

	public validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
		return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
	}

  /*
   * Stringify NgbDate in yyyy-mm-dd format 
   * @param date 
   * @returns 
   */
  public stringifyDate(date: NgbDate | null) {
    return date ? `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}` : '';
  }

  //#endregion

  //#region DWM Actions

  public isDWMChecked(id: string) {
    return this.checkedDWM && id === this.checkedDWM;
  }

  public onDWMClick(id: string) {
    this.checkedDWM = id;

    if(id === 'day') {
      this.fromDate = this.calendar.getPrev(this.calendar.getToday(), 'd', 1);
    } else if (id === 'week') {
      this.fromDate = this.calendar.getPrev(this.calendar.getToday(), 'd', 7);
    } else if (id === 'month') {
      this.fromDate = this.calendar.getPrev(this.calendar.getToday(), 'm', 1);
    }
  }

  //#endregion
}