import { Component, Input } from '@angular/core';
import { NewsItemModel } from '../../models/news-item.model';

/**
 * Generated class for the NewsCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'app-news-card',
  templateUrl: 'news-card.html'
})
export class NewsCardComponent {
  @Input() newsItem: NewsItemModel;

  constructor() { }
}
