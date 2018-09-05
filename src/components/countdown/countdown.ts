import { Component } from '@angular/core';

/**
 * Generated class for the CountdownComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'countdown',
  templateUrl: 'countdown.html'
})
export class CountdownComponent {

  text: string;

  constructor() {
    console.log('Hello CountdownComponent Component');
    this.text = 'Hello World';
  }

}
