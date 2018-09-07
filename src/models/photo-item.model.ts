import { Deserializable } from '../interfaces/deserializeable.interface';

export class PhotoItemModel implements Deserializable {
  id: string;
  photoUrl: string;
  thumbUrl: string;
  timestamp: string;
  isRejected: boolean;
  isFilmHour: boolean;
  filmHour: boolean;

  deserialize(input: any): this {
    Object.assign(this, input);

    this.isFilmHour = input.isFilmHour || false;
    this.filmHour = input.filmHour || '';

    return this;
  }
}
