import { Deserializable } from '../interfaces/deserializeable.interface';
import * as moment from 'moment';

export class PhotoItemModel implements Deserializable {
  id: string;
  photoUrl: string;
  thumbUrl: string;
  timestamp: string;
  timestampStr: string;
  isRejected: boolean;
  isFilmHour: boolean;
  filmHour: boolean;
  votes: number = 0;

  private _updateTimestampStr(): void {
    if (this.timestamp) {
      this.timestampStr = moment(this.timestamp).fromNow();
    }
  }

  deserialize(input: any): this {
    Object.assign(this, input);

    this.isFilmHour = input.isFilmHour || false;
    this.filmHour = input.filmHour || '';

    // update human readable timestamp
    this._updateTimestampStr();

    return this;
  }
}
