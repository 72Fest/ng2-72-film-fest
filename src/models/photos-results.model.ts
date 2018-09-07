import { Deserializable } from '../interfaces/deserializeable.interface';
import { PhotoMetadataModel } from './photos-metadata.model';
import { PhotoItemModel } from './photo-item.model';

export class PhotosResultsModel implements Deserializable {
  metadata: PhotoMetadataModel;
  photos: PhotoItemModel[];

  deserialize(input: any): this {
    Object.assign(this, input);

    const photos: PhotoItemModel[] = new Array<PhotoItemModel>();

    if (input.metadata) {
      this.metadata = new PhotoMetadataModel().deserialize(input.metadata);
    }

    if (input.photos && Array.isArray(input.photos)) {
      input.photos.forEach((curPhoto: PhotoItemModel) => {
        photos.push(new PhotoItemModel().deserialize(curPhoto));
      });
    }

    this.photos = photos;

    return this;
  }
}
