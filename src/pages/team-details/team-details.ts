import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TeamItemModel } from '../../models/team-item.model';
import { TeamItemFilmsModel } from '../../models/team-item-films.model';

/**
 * Generated class for the TeamDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-team-details',
  templateUrl: 'team-details.html',
})
export class TeamDetailsPage {
  team: TeamItemModel;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // populate the team variable from the nav params
    this.team = <TeamItemModel>this.navParams.get('team');
  }

  ionViewDidLoad() {
  }

  filmSelected(film: TeamItemFilmsModel) {
    console.log('film', film);
  }

}
