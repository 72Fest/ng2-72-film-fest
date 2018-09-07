import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataManagerProvider } from '../../providers/data-manager/data-manager';
import { PhotoItemModel } from '../../models/photo-item.model';
import { PhotosModel } from '../../models/photos.model';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, dm: DataManagerProvider) {
    // retrieve photos
    dm.getPhotos().subscribe((model: PhotosModel) => {
      this.photos = model.message.photos;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhotosPage');
  }
}
