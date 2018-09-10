import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  @ViewChild('contactFrame')
  contactFrame: ElementRef;

  destUrl: string = 'https://72fest.com/contact/';
  safeDestUrl: SafeResourceUrl;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public sanitizer: DomSanitizer,
    public loadingCtrl: LoadingController
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactPage');
    // sanitize URL
    this.safeDestUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.destUrl);

    // create loading dialog and display it until site is loaded
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    // listen for site to finish loading
    this.contactFrame.nativeElement.addEventListener('load', event => {
      // hide loading dialog after site is finished
      loading.dismiss();
    });
  }
}
