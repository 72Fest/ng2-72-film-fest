import { Deserializable } from '../interfaces/deserializeable.interface';
import { PhotosResultsModel } from './photos-results.model';

export class PhotosModel implements Deserializable {
  isSuccess: boolean;
  message: PhotosResultsModel;

  deserialize(input: any): this {
    Object.assign(this, input);

    // deserialize photo results
    if (input.message) {
      this.message = new PhotosResultsModel().deserialize(input.message);
    }

    return this;
  }
}
