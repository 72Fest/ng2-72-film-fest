import { Component } from '@angular/core';

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
export class CountdownComponent {

  title: string = 'Loading ...';
  days: string = '--';
  hours: string = '--';
  minutes: string = '--';
  seconds: string = '--';

  constructor() {
    this.title = 'Sample Title';
  }

}
