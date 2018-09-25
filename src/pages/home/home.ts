import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DataManagerProvider } from '../../providers/data-manager/data-manager';
import { CountdownModel } from '../../models/countdown.model';
import { NewsModel } from '../../models/news.model';
import { NewsItemModel } from '../../models/news-item.model';
import { Observable } from 'rxjs';
import { CountdownMessageModel } from '../../models/countdown-message.model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  newsItems: NewsItemModel[];
  newsItems$: Observable<NewsItemModel[]>;
  countdown$: Observable<CountdownMessageModel>;

  constructor(public navCtrl: NavController, private dm: DataManagerProvider) {
    this.newsItems$ = this.getNews();
    this.countdown$ = this.updateCountdown();
  }

  getNews() {
    return this.dm.getNews().flatMap((model: NewsModel) => {
      return Observable.of(model.message);
    });
  }

  /**
   * Retrieve latest countdown data and update countdown component
   */
  updateCountdown() {
    return this.dm.getCountdown().flatMap((model: CountdownModel) => Observable.of(model.message));
  }
}
