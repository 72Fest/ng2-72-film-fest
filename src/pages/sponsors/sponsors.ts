import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/**
 * Generated class for the SponsorsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-sponsors',
  templateUrl: 'sponsors.html'
})
export class SponsorsPage {
  @ViewChild('sponsorsFrame')
  sponsorsFrame: ElementRef;

  destUrl: string = 'https://72fest.com/sponsors/';
  safeDestUrl: SafeResourceUrl;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public sanitizer: DomSanitizer,
    public loadingCtrl: LoadingController
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SponsorsPage');
    // sanitize URL
    this.safeDestUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.destUrl);

    // create loading dialog and display it until site is loaded
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    // listen for site to finish loading
    this.sponsorsFrame.nativeElement.addEventListener('load', event => {
      // hide loading dialog after site is finished
      loading.dismiss();
    });
  }
}
