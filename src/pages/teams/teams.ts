import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataManagerProvider } from '../../providers/data-manager/data-manager';
import { TeamsModel } from '../../models/teams.model';

/**
 * Generated class for the TeamsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-teams',
  templateUrl: 'teams.html',
})
export class TeamsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private dm: DataManagerProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TeamsPage');
    this.dm.getTeams()
      .subscribe((model: TeamsModel) => {
        console.log('TODO: model', model);
      })
  }

}
