import { Deserializable } from '../interfaces/deserializeable.interface';
import { PhotoMetadataModel } from './photos-metadata.model';
import { PhotoItemModel } from './photo-item.model';

export class PhotosResultsModel implements Deserializable {
  metadata: PhotoMetadataModel;
  photos: PhotoItemModel[];
  votesHash: object;

  deserialize(input: any): this {
    Object.assign(this, input);

    const photos: PhotoItemModel[] = new Array<PhotoItemModel>();

    if (input.metadata) {
      this.metadata = new PhotoMetadataModel().deserialize(input.metadata);
    }

    if (input.photos && Array.isArray(input.photos)) {
      input.photos.forEach((curPhoto: PhotoItemModel) => {
        const newPhoto: PhotoItemModel = new PhotoItemModel().deserialize(curPhoto);

        // update vote total and vote state if photo is in votes hash
        if (this.votesHash && this.votesHash[newPhoto.id]) {
          newPhoto.votes = this.votesHash[newPhoto.id].votes;
          newPhoto.isVoted = this.votesHash[newPhoto.id].voted;
        }
        photos.push(newPhoto);
      });
    }

    this.photos = photos;

    return this;
  }
}
