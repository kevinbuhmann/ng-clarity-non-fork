/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

import { CalendarModel } from '../model/calendar.model';
import { DayModel } from '../model/day.model';

/**
 * This service is responsible for:
 * 1. Initializing the displayed calendar.
 * 2. Moving the calendar to the next, previous or current months
 * 3. Managing the focused and selected day models.
 */
@Injectable()
export class DateNavigationService {
  persistedDate: DayModel;
  selectedDay: DayModel;
  focusedDay: DayModel;
  hasActionButtons = false;

  private _displayedCalendar: CalendarModel;
  private _todaysFullDate: Date = new Date();
  private _today: DayModel;
  private _selectedDayChange = new Subject<DayModel>();
  private _displayedCalendarChange = new Subject<void>();
  private _focusOnCalendarChange = new Subject<void>();
  private _focusedDayChange = new Subject<DayModel>();

  get today(): DayModel {
    return this._today;
  }

  get displayedCalendar(): CalendarModel {
    return this._displayedCalendar;
  }

  get selectedDayChange(): Observable<DayModel> {
    return this._selectedDayChange.asObservable();
  }

  /**
   * This observable lets the subscriber know that the displayed calendar has changed.
   */
  get displayedCalendarChange(): Observable<void> {
    return this._displayedCalendarChange.asObservable();
  }

  /**
   * This observable lets the subscriber know that the focus should be applied on the calendar.
   */
  get focusOnCalendarChange(): Observable<void> {
    return this._focusOnCalendarChange.asObservable();
  }

  /**
   * This observable lets the subscriber know that the focused day in the displayed calendar has changed.
   */
  get focusedDayChange(): Observable<DayModel> {
    return this._focusedDayChange.asObservable();
  }

  /**
   * Notifies that the selected day has changed so that the date can be emitted to the user.
   */
  notifySelectedDayChanged(dayModel: DayModel, { emitEvent } = { emitEvent: true }) {
    this.selectedDay = dayModel;
    if (emitEvent) {
      this._selectedDayChange.next(dayModel);
    }
  }

  /**
   * Initializes the calendar based on the selected day.
   */
  initializeCalendar(): void {
    this.focusedDay = null; // Can be removed later on the store focus
    this.initializeTodaysDate();
    if (this.selectedDay) {
      this._displayedCalendar = new CalendarModel(this.selectedDay.year, this.selectedDay.month);
    } else {
      this._displayedCalendar = new CalendarModel(this.today.year, this.today.month);
    }
  }

  changeMonth(month: number): void {
    this.setDisplayedCalendar(new CalendarModel(this._displayedCalendar.year, month));
  }

  changeYear(year: number): void {
    this.setDisplayedCalendar(new CalendarModel(year, this._displayedCalendar.month));
  }

  /**
   * Moves the displayed calendar to the next month.
   */
  moveToNextMonth(): void {
    this.setDisplayedCalendar(this._displayedCalendar.nextMonth());
  }

  /**
   * Moves the displayed calendar to the previous month.
   */
  moveToPreviousMonth(): void {
    this.setDisplayedCalendar(this._displayedCalendar.previousMonth());
  }

  /**
   * Moves the displayed calendar to the current month and year.
   */
  moveToCurrentMonth(): void {
    if (!this.displayedCalendar.isDayInCalendar(this.today)) {
      this.setDisplayedCalendar(new CalendarModel(this.today.year, this.today.month));
    }
    this._focusOnCalendarChange.next();
  }

  incrementFocusDay(value: number): void {
    this.focusedDay = this.focusedDay.incrementBy(value);
    if (this._displayedCalendar.isDayInCalendar(this.focusedDay)) {
      this._focusedDayChange.next(this.focusedDay);
    } else {
      this.setDisplayedCalendar(new CalendarModel(this.focusedDay.year, this.focusedDay.month));
    }
    this._focusOnCalendarChange.next();
  }

  resetSelectedDay() {
    this.selectedDay = this.persistedDate;
  }

  // not a setter because i want this to remain private
  private setDisplayedCalendar(value: CalendarModel) {
    if (!this._displayedCalendar.isEqual(value)) {
      this._displayedCalendar = value;
      this._displayedCalendarChange.next();
    }
  }

  private initializeTodaysDate(): void {
    this._todaysFullDate = new Date();
    this._today = new DayModel(
      this._todaysFullDate.getFullYear(),
      this._todaysFullDate.getMonth(),
      this._todaysFullDate.getDate()
    );
  }
}
