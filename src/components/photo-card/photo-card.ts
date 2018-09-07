import { Component } from '@angular/core';

/**
 * Generated class for the PhotoCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'app-photo-card',
  templateUrl: 'photo-card.html'
})
export class PhotoCardComponent {
  text: string;

  constructor() {
    console.log('Hello PhotoCardComponent Component');
    this.text = 'Hello World';
  }
}
