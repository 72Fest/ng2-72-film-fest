import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataManagerProvider } from '../../providers/data-manager/data-manager';
import { PhotoItemModel } from '../../models/photo-item.model';
import { PhotosModel } from '../../models/photos.model';
import { Subscription } from 'rxjs';

/**
 * Generated class for the PhotosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-photos',
  templateUrl: 'photos.html'
})
export class PhotosPage {
  photos: PhotoItemModel[];

  private _subscription$: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dm: DataManagerProvider
  ) {
    // retrieve photos
    this.pollPhotos();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhotosPage');
  }

  pollPhotos() {
    this._subscription$ = this.dm.pollPhotos().subscribe(
      (models: PhotoItemModel[]) => {
        if (models) {
          this.photos = models;
        }
      },
      err => console.error(`Error while polling photos: ${err}`),
      () => console.log('FINISHED FEED!')
    );
  }

  doRefresh(refresher) {
    if (this._subscription$) {
      this._subscription$.unsubscribe();
    }

    refresher.complete();
    this.dm.refreshPhotos();
    this.pollPhotos();
  }

  doInfinite(infiniteScroll) {
    const sub$ = this.dm.fetchPhotos().subscribe(photos => {
      // if subscription comes back undefined, we have no more photos
      infiniteScroll.enable(photos ? true : false);

      // notify infinite scroll of completion
      infiniteScroll.complete();
    });
    // sub$.unsubscribe();
  }
}
