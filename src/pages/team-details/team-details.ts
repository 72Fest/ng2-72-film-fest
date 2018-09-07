import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { TeamItemModel } from '../../models/team-item.model';
import { TeamItemFilmsModel } from '../../models/team-item-films.model';
import { FilmPage } from '../film/film';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
    // populate the team variable from the nav params
    this.team = <TeamItemModel>this.navParams.get('team');
  }

  ionViewDidLoad() {
  }

  filmSelected(film: TeamItemFilmsModel) {
    const modal = this.modalCtrl.create(FilmPage, { film });
    modal.present();
  }

}
