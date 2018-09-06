import * as moment from 'moment';

export class NewsItemModel {
  id: string;
  timestamp: string;
  title: string;
  content: string;
  get timeStr(): string {
    if (this.timestamp) {
      return moment(this.timestamp).fromNow()
    }

    return 'no date';
  }
}
