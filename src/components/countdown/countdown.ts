import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { TimestampModel } from '../../models/timestamp.model';

import { Observable, Subscription } from 'rxjs';
/**
 * Generated class for the CountdownComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'app-countdown',
  templateUrl: 'countdown.html'
})
export class CountdownComponent implements OnChanges {

  @Input() title: string = 'Loading ...';
  @Input() timestamp: TimestampModel;

  timer: Observable<TimestampModel>;
  timerSubscription: Subscription;

  days: string = '--';
  hours: string = '--';
  minutes: string = '--';
  seconds: string = '--';

  constructor() {
    this.title = 'Sample Title';
  }

  formatTimeValue(val) {
    return (val < 10) ? '0' + val : val;
  }

  calcTimeDiff(t: TimestampModel): TimestampModel {
    const secsInMin = 60;
    const secsInHour = secsInMin * 60;
    const secsInDay = secsInHour * 24;

    const timeLeft: TimestampModel = new TimestampModel();
    const curDate = new Date();
    let curSecs: number;
    let timeDiff: number;

    // calculate time diff
    const endDate = new Date(t.year, t.month - 1, t.day, t.hour, t.minute, t.second);
    const endSecs: number = endDate.getTime() / 1000;

    curSecs = curDate.getTime() / 1000;
    timeDiff = endSecs - curSecs;

    if (timeDiff <= 0) {
      //Time has expired, zero everything out
      timeLeft.day = undefined;
      timeLeft.hour = undefined;
      timeLeft.minute = undefined;
      timeLeft.second = undefined;
    } else {
      //there still is time left, calculate the difference
      timeLeft.day = this.formatTimeValue(Math.floor(timeDiff / secsInDay));
      timeLeft.hour = this.formatTimeValue(Math.floor((timeDiff / secsInHour) % 24));
      timeLeft.minute = this.formatTimeValue(Math.floor((timeDiff / secsInMin) % 60));
      timeLeft.second = this.formatTimeValue(Math.floor(timeDiff % secsInMin));
    }

    return timeLeft;
  }

  /**
   * Calculate the days, hours, minutes and seconds left given a specified timestamp
   * @param {TimestampModel} curTimestamp TimestampModel current timestamp retrieved from API
   * @returns TimestampModel differences in time or undefined if expired
   */
  updateCountdown(curTimestamp: TimestampModel) {
    const timeDiff: TimestampModel = this.calcTimeDiff(curTimestamp);

    // update countdown
    this.timestamp = curTimestamp;

    this.days = timeDiff.day ? String(timeDiff.day) : '00';
    this.hours = timeDiff.day ? String(timeDiff.hour) : '00';
    this.minutes = timeDiff.day ? String(timeDiff.minute) : '00';
    this.seconds = timeDiff.day ? String(timeDiff.second) : '00';

    return timeDiff;
  }

  /**
   * Initializes and subscribes to an interval observer to update the counter
   * @param {TimestampModel} curTimestamp
   */
  initTimer(curTimestamp: TimestampModel) {
    // first update counts to calc differences
    const timeDiff: TimestampModel = this.updateCountdown(curTimestamp);

    // we have a valid timestamp, lets update it
    if (this.timestamp && !isNaN(timeDiff.second)) {

      // if a subscription already exists, unsubscribe first
      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
      }

      // create observable that fires every second
      this.timer = Observable.interval(1000)
        .map(() => this.calcTimeDiff(this.timestamp));

      // subscribe to timer observable to update counter
      this.timerSubscription = this.timer
        .subscribe((ts) => this.updateCountdown(ts));
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // update timestamp on change
    if (changes.timestamp && changes.timestamp.currentValue) {
      const curTimestamp: TimestampModel = changes.timestamp.currentValue;

      // start the timer upon receiving the current timestamp
      this.initTimer(curTimestamp);
    }

    // update title on change
    if (changes.title && changes.title.currentValue) {
      this.title = changes.title.currentValue;
    }
  }

}
