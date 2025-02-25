/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { DateNavigationService } from './providers/date-navigation.service';
import { DatepickerFocusService } from './providers/datepicker-focus.service';
import { ViewManagerService } from './providers/view-manager.service';

@Component({
  selector: 'clr-datepicker-view-manager',
  templateUrl: './datepicker-view-manager.html',
  providers: [DatepickerFocusService],
  host: {
    '[class.datepicker]': 'true',
    '[class.has-action-buttons]': 'hasActionButtons',
    '[attr.aria-modal]': 'true',
    '[attr.aria-label]': 'commonStrings.keys.datepickerDialogLabel',
    role: 'dialog',
  },
})
export class ClrDatepickerViewManager {
  constructor(
    public commonStrings: ClrCommonStringsService,
    private viewManagerService: ViewManagerService,
    private dateNavigationService: DateNavigationService
  ) {}

  /**
   * Returns if the current view is the monthpicker.
   */
  get isMonthView(): boolean {
    return this.viewManagerService.isMonthView;
  }

  /**
   * Returns if the current view is the yearpicker.
   */
  get isYearView(): boolean {
    return this.viewManagerService.isYearView;
  }

  /**
   * Returns if the current view is the daypicker.
   */
  get isDayView(): boolean {
    return this.viewManagerService.isDayView;
  }

  protected get hasActionButtons() {
    return this.dateNavigationService.hasActionButtons;
  }
}
