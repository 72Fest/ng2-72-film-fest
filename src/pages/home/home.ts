import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DataManagerProvider } from '../../providers/data-manager/data-manager';
import { CountdownModel } from '../../models/countdown.model';
import { TimestampModel } from '../../models/timestamp.model';
import { NewsModel } from '../../models/news.model';
import { NewsItemModel } from '../../models/news-item.model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  curTitle: string;
  curTimestamp: TimestampModel;
  newsItems: NewsItemModel[];

  constructor(public navCtrl: NavController, private dm: DataManagerProvider) {
    this.updateCountdown();

    dm.getNews().subscribe((model: NewsModel) => {
      console.log(model.message);
      this.newsItems = model.message;
    });
  }

  /**
   * Retrieve latest countdown data and update countdown component
   */
  updateCountdown() {
    this.dm.getCountdown().subscribe((model: CountdownModel) => {
      // update countdown component with caption and timestamp
      this.curTitle = model.message.caption;
      this.curTimestamp = model.message.time;
    });
  }
}
