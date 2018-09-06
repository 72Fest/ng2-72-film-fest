import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { TimestampModel } from '../../models/timestamp.model';

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

  days: string = '--';
  hours: string = '--';
  minutes: string = '--';
  seconds: string = '--';

  constructor() {
    this.title = 'Sample Title';
  }

  ngOnChanges(changes: SimpleChanges) {
    // update timestamp on change
    if (changes.timestamp) {
      const curTimestamp:TimestampModel = changes.timestamp.currentValue;
      this.timestamp = curTimestamp;
    }

    // update title on change
    if (changes.title && changes.title.currentValue) {
      this.title = changes.title.currentValue;
    }
  }

}
