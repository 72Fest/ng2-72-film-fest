import { Component, Input } from '@angular/core';
import { PhotoItemModel } from '../../models/photo-item.model';

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
  @Input()
  photo: PhotoItemModel;

  constructor() {}
}
