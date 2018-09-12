import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PhotoItemModel } from '../../models/photo-item.model';
import { SocialSharing } from '@ionic-native/social-sharing';

const MESSAGE = '#72FilmFest';
/**
 * Generated class for the PhotoCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'app-photo-card',
  templateUrl: 'photo-card.html'
})
export class PhotoCardComponent {
  @Input()
  photo: PhotoItemModel;

  @Output()
  voteToggled = new EventEmitter<PhotoItemModel>();

  constructor(private socialSharing: SocialSharing) {}

  toggleVote() {
    this.photo.isVoted = !this.photo.isVoted;
    this.voteToggled.emit(this.photo);
  }

  onShare() {
    this.socialSharing.share(MESSAGE, MESSAGE, this.photo.photoUrl).catch(err => {
      console.error(`Error while sharing: ${err}`);
    });
  }

  onInstagram() {
    this.socialSharing.shareViaInstagram(MESSAGE, this.photo.photoUrl).catch(err => {
      console.error(`Error while sharing via instagram: ${err}`);
    });
  }
}
