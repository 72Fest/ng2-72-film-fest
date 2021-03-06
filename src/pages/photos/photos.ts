import { Component, OnDestroy } from '@angular/core';
import {
  NavController,
  NavParams,
  ActionSheetController,
  LoadingController,
  AlertController
} from 'ionic-angular';
import { DataManagerProvider } from '../../providers/data-manager/data-manager';
import { PhotoItemModel } from '../../models/photo-item.model';
import { Subscription, Observable } from 'rxjs';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { VoteModel } from '../../models/vote.model';
import { FileUploadResult, FileTransferError } from '@ionic-native/file-transfer';

// interval to update timestamps for photos
const TIMESTAMP_INTERVAL = 30000;

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
export class PhotosPage implements OnDestroy {
  photos: PhotoItemModel[];

  private _subscription$: Subscription;
  private _timestamps$: Subscription;
  private _defaultOptions: CameraOptions = {
    quality: 90,
    allowEdit: false,
    saveToPhotoAlbum: true,
    correctOrientation: true
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dm: DataManagerProvider,
    private camera: Camera,
    private actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    // retrieve photos
    this.pollPhotos();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhotosPage');
  }

  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Upload a photo',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.captureImage(true);
          }
        },
        {
          text: 'Photo albums',
          icon: 'albums',
          handler: () => {
            this.captureImage(false);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    actionSheet.present();
  }

  pollPhotos() {
    // retrieve latest images observable
    const pollPhotos$ = this.dm.pollPhotos();

    // create a new observable that updates the timestamp
    const interval$ = Observable.interval(TIMESTAMP_INTERVAL);

    // in case they are already defined, unsubscribe before reassigning
    if (this._subscription$) {
      this._subscription$.unsubscribe();
    }

    if (this._timestamps$) {
      this._timestamps$.unsubscribe();
    }

    // subscribe to update photos
    this._subscription$ = pollPhotos$.subscribe(
      (models: PhotoItemModel[]) => {
        if (models) {
          // only update photos there are more models
          this.photos = models;
        }
      },
      err => console.error(`Error while polling photos: ${err}`)
    );

    // subscribe to update photo timestamps
    this._timestamps$ = interval$.subscribe(
      () => {
        if (this.photos && Array.isArray(this.photos)) {
          this.photos.forEach((photo: PhotoItemModel) => {
            // update model data (triggers timestamp update)
            photo.deserialize(photo);
            // photo.timestamp = photo.timestamp;
          });
        }
      },
      err => console.error(`Error while polling photos: ${err}`)
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

    // process image returned from camera or photo album
    const processImageData = imageData => {
      // imageData is either a base64 encoded string or a file URI
      let imageUrl = null;

      if (imageData.match(/^file:\/\//)) {
        // if file is a URI, do nothing
        imageUrl = imageData;
      } else {
        // If it's base64 (DATA_URL), prepend with content type
        imageUrl = 'data:image/jpeg;base64,' + imageData;
      }

      return imageUrl;
    };

    // upload image after it is retrieved from the camera or album
    const uploadImageData = imageUrl => {
      return this.uploadPhoto(imageUrl);
    };

    // capture a photo
    return this.camera
      .getPicture(options)
      .then(processImageData)
      .then(imageData => uploadImageData(imageData))
      .catch(err => {
        // Handle error
        console.error(`Failed when capturing image: ${err}`);
      });
  }

  uploadPhoto(imageUrl: string) {
    const loader = this.loadingCtrl.create({
      content: 'uploading'
    });
    loader.present();

    this.dm
      .uploadPhoto(imageUrl)
      .then((result: FileUploadResult) => {
        // we were successful so poll for the latest photos
        this.pollPhotos();
        loader.dismiss();
      })
      .catch((err: FileTransferError) => {
        loader.dismiss();

        // alert user that an error ocurred
        const alert = this.alertCtrl.create({
          title: 'Upload failed!',
          message: 'An error ocurred when attempting to upload the image',
          buttons: ['Dismiss']
        });

        alert.present();
      });
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
    this.presentActionSheet();
  }

  doRefresh(refresher) {
    refresher.complete();
    this.pollPhotos();
  }

  doInfinite(infiniteScroll) {
    this.dm.fetchPhotos().subscribe(photos => {
      // if subscription comes back undefined, we have no more photos
      infiniteScroll.enable(photos ? true : false);

      // notify infinite scroll of completion
      infiniteScroll.complete();
    });
  }

  ngOnDestroy(): void {
    if (this._subscription$) {
      this._subscription$.unsubscribe();
    }

    if (this._timestamps$) {
      this._timestamps$.unsubscribe();
    }
  }
}
