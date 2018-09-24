import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { TeamsPage } from '../pages/teams/teams';
import { PhotosPage } from '../pages/photos/photos';
import { ContactPage } from '../pages/contact/contact';
import { SponsorsPage } from '../pages/sponsors/sponsors';
import { DataManagerProvider } from '../providers/data-manager/data-manager';
import { PushObject } from '@ionic-native/push';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav)
  nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{ title: string; component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public datManager: DataManagerProvider
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Photos', component: PhotosPage },
      { title: 'Teams', component: TeamsPage },
      { title: 'Sponsors', component: SponsorsPage },
      { title: 'Contact', component: ContactPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.datManager.initPush().then(
        (pushObj: PushObject) => {
          pushObj.on('notification').subscribe((notification: any) => {
            // results: {"additionalData":{"foreground":true,"coldstart":false},"message":"...","title":"...","sound":"default"}
            console.log('push notification', JSON.stringify(notification));
          });
        },
        error => {
          console.log('error', error);
        }
      );
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
