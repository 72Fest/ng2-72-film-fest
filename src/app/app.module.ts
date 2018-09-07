import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ComponentsModule } from '../components/components.module';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { TeamsPage } from '../pages/teams/teams';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { FileTransfer } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';
import { Push } from '@ionic-native/push';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { DataManagerProvider } from '../providers/data-manager/data-manager';
import { TeamDetailsPage } from '../pages/team-details/team-details';
import { FilmPage } from '../pages/film/film';
import { PhotosPage } from '../pages/photos/photos';
import { PhotoCardPage } from '../pages/photo-card/photo-card';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    TeamsPage,
    TeamDetailsPage,
    FilmPage,
    PhotosPage,
    PhotoCardPage
  ],
  imports: [BrowserModule, IonicModule.forRoot(MyApp), HttpClientModule, ComponentsModule],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    TeamsPage,
    TeamDetailsPage,
    FilmPage,
    PhotosPage,
    PhotoCardPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    FileTransfer,
    Camera,
    Push,
    InAppBrowser,
    DataManagerProvider
  ]
})
export class AppModule {}
