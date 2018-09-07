import { Component } from '@angular/core';
import { NavParams, ViewController, NavController } from 'ionic-angular';
import { TeamItemFilmsModel } from '../../models/team-item-films.model';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

/**
 * Generated class for the FilmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-film',
  templateUrl: 'film.html',
})
export class FilmPage {

  film: TeamItemFilmsModel;
  urlSafe: SafeResourceUrl;

  constructor(public sanitizer: DomSanitizer, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    console.log('navParams', navParams);
    this.film = navParams.get('film');
  }

  ionViewDidLoad() {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.film.url);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
