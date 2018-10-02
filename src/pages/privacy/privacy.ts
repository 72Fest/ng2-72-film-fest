import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

/**
 * Generated class for the PrivacyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-privacy',
  templateUrl: 'privacy.html'
})
export class PrivacyPage {
  @ViewChild('privacyFrame')
  privacyFrame: ElementRef;

  destUrl: string = 'http://72fest.com/about/privacy-policy/';
  safeDestUrl: SafeResourceUrl;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public sanitizer: DomSanitizer,
    public loadingCtrl: LoadingController
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrivacyPage');
    // sanitize URL
    this.safeDestUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.destUrl);

    // create loading dialog and display it until site is loaded
    const loading = this.loadingCtrl.create({
      content: 'Please wait ...'
    });

    loading.present();

    // listen for site to finish loading
    this.privacyFrame.nativeElement.addEventListener('load', event => {
      // hide loading dialog after site is finished
      loading.dismiss();
    });
  }
}
