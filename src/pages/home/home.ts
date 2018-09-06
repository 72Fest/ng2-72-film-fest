import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DataManagerProvider } from '../../providers/data-manager/data-manager';
import { CountdownModel } from '../../models/countdown.model';
import { TimestampModel } from '../../models/timestamp.model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  curTitle: string;
  curTimestamp: TimestampModel;

  constructor(public navCtrl: NavController, private dm: DataManagerProvider) {
    this.updateCountdown();
  }

  /**
   * Retrieve latest countdown data and update countdown component
   */
  updateCountdown() {
    this.dm.getCountdown()
      .subscribe((model: CountdownModel) => {
        // update countdown component with caption and timestamp
        this.curTitle = model.message.caption;
        this.curTimestamp = model.message.time;
      });
  }

}
