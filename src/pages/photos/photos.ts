import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataManagerProvider } from '../../providers/data-manager/data-manager';
import { PhotoItemModel } from '../../models/photo-item.model';
import { Subscription } from 'rxjs';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { VoteModel } from '../../models/vote.model';

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
  private _defaultOptions: CameraOptions = {
    quality: 90,
    allowEdit: true,
    saveToPhotoAlbum: true,
    correctOrientation: true
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dm: DataManagerProvider,
    private camera: Camera
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

  captureImage(isUsingCamera: boolean) {
    // configure options
    const options: CameraOptions = Object.assign(
      {
        saveToPhotoAlbum: isUsingCamera,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        //set source type to retrieve photo from camera
        sourceType: isUsingCamera
          ? this.camera.PictureSourceType.CAMERA
          : this.camera.PictureSourceType.PHOTOLIBRARY
      },
      this._defaultOptions
    );

    // capture a photo
    this.camera.getPicture(options).then(
      imageData => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        let base64Image = 'data:image/jpeg;base64,' + imageData;
      },
      err => {
        // Handle error
        console.error(`Failed when capturing image: ${err}`);
      }
    );
  }

  onVoteToggled(photo: PhotoItemModel) {
    this.dm.castVote(photo.id, photo.isVoted).subscribe((model: VoteModel) => {
      // update current photos list with new model
      this.photos.forEach((curPhoto: PhotoItemModel) => {
        if (curPhoto.id === photo.id) {
          curPhoto.deserialize(model.message);
        }
      });
    });
  }

  onCamera() {
    this.captureImage(true);
  }

  onAlbums() {
    this.captureImage(false);
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
