/*
  Author: Alejandro Vasquez Nuñez <alejandro.vasquez@upr.edu>
*/
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {MatCalendar, MatDatepickerIntl, yearsPerPage} from '@angular/material/datepicker';
import {DateAdapter, MAT_DATE_FORMATS, MatDateFormats} from '@angular/material/core';
import {takeUntil} from 'rxjs/operators';

/** Custom header component for datepicker. Replicating the view used on Material datepicker sourcecode, but
 * with modification on the current period functions for better management of the current view in the calendar
 */
@Component({
  selector: 'app-date-header',
  styles: [`
    .mat-calendar-header {
      padding: 8px 8px 0 8px;
    }
    .mat-calendar-controls {
      display: flex;
      margin: 5% calc(33% / 7 - 16px);
    }
    .mat-icon-button:hover .mat-button-focus-overlay {
      opacity: 0.04;
    }
    .mat-calendar-spacer {
      flex: 1 1 auto;
    }
    .mat-calendar-previous-button,
    .mat-calendar-next-button {
      position: relative;
    }
    .mat-calendar-previous-button::after {
      border-left-width: 2px;
      transform: translateX(2px) rotate(-45deg);
    }
    .mat-calendar-next-button::after {
      border-right-width: 2px;
      transform: translateX(-2px) rotate(45deg);
    }
    .mat-calendar-table-header th {
      text-align: center;
      padding: 0 0 8px 0;
    }
    .mat-text:disabled {
      color: black;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mat-calendar-header">
      <div class="mat-calendar-controls">
        <button color="text" mat-button [disabled]=true
                (click)="currentPeriodClicked()" [attr.aria-label]="periodButtonLabel"
                cdkAriaLive="polite">
          {{periodButtonText}}
        </button>

        <div class="mat-calendar-spacer"></div>

        <ng-content></ng-content>

        <button mat-icon-button type="button" class="mat-calendar-previous-button"
                [disabled]="!previousEnabled()" (click)="previousClicked()"
                [attr.aria-label]="prevButtonLabel">
        </button>

        <button mat-icon-button type="button" class="mat-calendar-next-button"
                [disabled]="!nextEnabled()" (click)="nextClicked()"
                [attr.aria-label]="nextButtonLabel">
        </button>
      </div>
    </div>
  `
})
export class DateHeaderComponent<D> implements OnDestroy {
  private destroyed = new Subject<void>();
  constructor(
    private intl: MatDatepickerIntl,
    private calendar: MatCalendar<D>, private dateAdapter: DateAdapter<D>,
    @Inject(MAT_DATE_FORMATS) private dateFormats: MatDateFormats, cdr: ChangeDetectorRef) {
    calendar.stateChanges
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => cdr.markForCheck());
  }
  get periodButtonLabel(): string {
    return this.calendar.currentView === 'month' ?
      this.intl.switchToMultiYearViewLabel : this.intl.switchToMonthViewLabel;
  }
  /** The label for the current calendar view. */
  get periodButtonText(): string {
    if (this.calendar.currentView === 'month') {
      return this.dateAdapter
        .format(this.calendar.activeDate, this.dateFormats.display.monthYearLabel)
        .toLocaleUpperCase();
    }
    if (this.calendar.currentView === 'year') {
      return this.dateAdapter.getYearName(this.calendar.activeDate);
    }
    // The offset from the active year to the "slot" for the starting year is the
    // *actual* first rendered year in the multi-year view, and the last year is
    // just yearsPerPage - 1 away.
    const activeYear = this.dateAdapter.getYear(this.calendar.activeDate);
    const minYearOfPage = activeYear - this.getActiveOffset(
      this.dateAdapter, this.calendar.activeDate, this.calendar.minDate, this.calendar.maxDate);
    const maxYearOfPage = minYearOfPage + yearsPerPage - 1;
    const minYearName =
      this.dateAdapter.getYearName(this.dateAdapter.createDate(minYearOfPage, 0, 1));
    const maxYearName =
      this.dateAdapter.getYearName(this.dateAdapter.createDate(maxYearOfPage, 0, 1));
    return this.intl.formatYearRange(minYearName, maxYearName);
  }
  /** The label for the previous button. */
  get prevButtonLabel(): string {
    return {
      month: this.intl.prevMonthLabel,
      year: this.intl.prevYearLabel,
      'multi-year': this.intl.prevMultiYearLabel
    }[this.calendar.currentView];
  }
  /** The label for the next button. */
  get nextButtonLabel(): string {
    return {
      month: this.intl.nextMonthLabel,
      year: this.intl.nextYearLabel,
      'multi-year': this.intl.nextMultiYearLabel
    }[this.calendar.currentView];
  }
  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
  /** Handles user clicks on the period label. */
  currentPeriodClicked(): void {
    this.calendar.currentView = this.calendar.currentView === 'month' ? 'multi-year' : 'month';
  }
  /** Handles user clicks on the previous button. */
  previousClicked(): void {
    this.calendar.activeDate = this.calendar.currentView === 'month' ?
      this.dateAdapter.addCalendarMonths(this.calendar.activeDate, -1) :
      this.dateAdapter.addCalendarYears(
        this.calendar.activeDate, this.calendar.currentView === 'year' ? -1 : -yearsPerPage
      );
  }
  /** Handles user clicks on the next button. */
  nextClicked(): void {
    this.calendar.activeDate = this.calendar.currentView === 'month' ?
      this.dateAdapter.addCalendarMonths(this.calendar.activeDate, 1) :
      this.dateAdapter.addCalendarYears(
        this.calendar.activeDate,
        this.calendar.currentView === 'year' ? 1 : yearsPerPage
      );
  }
  /** Whether the previous period button is enabled. */
  previousEnabled(): boolean {
    if (!this.calendar.minDate) {
      return true;
    }
    return !this.calendar.minDate ||
      !this._isSameView(this.calendar.activeDate, this.calendar.minDate);
  }

  /** Whether the next period button is enabled. */
  nextEnabled(): boolean {
    return !this.calendar.maxDate ||
      !this._isSameView(this.calendar.activeDate, this.calendar.maxDate);
  }

  /**
   * When the multi-year view is first opened, the active year will be in view.
   * So we compute how many years are between the active year and the *slot* where our
   * "startingYear" will render when paged into view.
   */
  getActiveOffset<Date>(
    dateAdapter: DateAdapter<D>, activeDate: D, minDate: D | null, maxDate: D | null): number {
    const activeYear = dateAdapter.getYear(activeDate);
    return this.euclideanModulo((activeYear - this.getStartingYear(dateAdapter, minDate, maxDate)),
      yearsPerPage);
  }

  /**
   * We pick a "starting" year such that either the maximum year would be at the end
   * or the minimum year would be at the beginning of a page.
   */
  getStartingYear<Date>(
    dateAdapter: DateAdapter<D>, minDate: D | null, maxDate: D | null): number {
    let startingYear = 0;
    if (maxDate) {
      const maxYear = dateAdapter.getYear(maxDate);
      startingYear = maxYear - yearsPerPage + 1;
    } else if (minDate) {
      startingYear = dateAdapter.getYear(minDate);
    }
    return startingYear;
  }

  /** Gets remainder that is non-negative, even if first number is negative */
  euclideanModulo(a: number, b: number): number {
    return (a % b + b) % b;
  }

  isSameMultiYearView<Date>(
    dateAdapter: DateAdapter<D>, date1: D, date2: D, minDate: D | null, maxDate: D | null): boolean {
    const year1 = dateAdapter.getYear(date1);
    const year2 = dateAdapter.getYear(date2);
    const startingYear = this.getStartingYear(dateAdapter, minDate, maxDate);
    return Math.floor((year1 - startingYear) / yearsPerPage) ===
      Math.floor((year2 - startingYear) / yearsPerPage);
  }

  /** Whether the two dates represent the same view in the current view mode (month or year). */
  private _isSameView(date1: D, date2: D): boolean {
    if (this.calendar.currentView === 'month') {
      return this.dateAdapter.getYear(date1) === this.dateAdapter.getYear(date2) &&
        this.dateAdapter.getMonth(date1) === this.dateAdapter.getMonth(date2);
    }
    if (this.calendar.currentView === 'year') {
      return this.dateAdapter.getYear(date1) === this.dateAdapter.getYear(date2);
    }
    // Otherwise we are in 'multi-year' view.
    return this.isSameMultiYearView(
      this.dateAdapter, date1, date2, this.calendar.minDate, this.calendar.maxDate);
  }
}
