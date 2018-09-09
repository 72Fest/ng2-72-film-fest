import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CountdownModel } from '../../models/countdown.model';
import { Observable } from 'rxjs/Observable';
import { NewsModel } from '../../models/news.model';
import { TeamsModel } from '../../models/teams.model';
import { PhotosModel } from '../../models/photos.model';
import { VotesModel } from '../../models/votes.model';
import { VoteItemModel } from '../../models/vote-item.model';
import { PhotoItemModel } from '../../models/photo-item.model';
import { PhotoBuffer } from '../../helpers/photo-buffer.helper';

const baseApiUrl = 'https://api.72fest.com/api';
const endpointCountdown = '/countDown';
const endpointNews = '/news';
const endpointTeams = '/teams';
const endpointPhotos = '/photos';
const endpointVotes = '/votes';

/*
  Generated class for the DataManagerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataManagerProvider {
  private photoBuffer: PhotoBuffer;

  constructor(public http: HttpClient) {}

  /**
   * Retrieve current countdown value from api endpoint
   * @returns Observable<CountdownModel> model
   */
  getCountdown(): Observable<CountdownModel> {
    const countdownUrl = `${baseApiUrl}${endpointCountdown}`;

    return this.http.get<CountdownModel>(countdownUrl);
  }

  /**
   * Retrieve list of news, render the markdown and update the URLs
   * @returns Observable<NewsModel> model with rendered news
   */
  getNews(): Observable<NewsModel> {
    const url = `${baseApiUrl}${endpointNews}`;

    return this.http
      .get<NewsModel>(url)
      .map((model: NewsModel) => new NewsModel().deserialize(model));
  }

  /**
   * Retrieve list of teams and update thumbnail URLs
   * @returns Observable<TeamsModel> model with deserialized values
   */
  getTeams(): Observable<TeamsModel> {
    const url = `${baseApiUrl}${endpointTeams}`;

    return this.http
      .get<TeamsModel>(url)
      .map((model: TeamsModel) => new TeamsModel().deserialize(model));
  }

  /**
   * Retrieve list of current vote values for photos
   * @returns Observable<VotesModel> model with deserialized values for votes
   */
  getVotes(): Observable<VotesModel> {
    const url = `${baseApiUrl}${endpointVotes}`;

    return this.http
      .get<VotesModel>(url)
      .map((model: VotesModel) => new VotesModel().deserialize(model));
  }

  pollPhotos(): Observable<PhotoItemModel[]> {
    if (this.photoBuffer) {
      this.photoBuffer.fetchNext();

      return this.photoBuffer.observable;
    } else {
      return <Observable<PhotoItemModel[]>>Observable.create(observer => {
        const photos$ = this.getPhotos().subscribe((model: PhotosModel) => {
          this.photoBuffer = new PhotoBuffer(model);

          // emit the observable from the photo buffer
          observer.next(this.photoBuffer.observable);

          photos$.unsubscribe();
        });
      })
        // map nested observable into the source observable
        .flatMap(inner$ => inner$);
    }
  }

  refreshPhotos() {
    // TODO: perform better cleanup
    this.photoBuffer.destroy();
    this.photoBuffer = null;
  }

  fetchPhotos() {
    if (!this.photoBuffer) {
      throw new Error('pollPhotos() must be called before fetchPhotos()');
    }
    this.photoBuffer.fetchNext();
    return this.photoBuffer.observable;
  }

  /**
   * Retrieve list of photos and metadata
   * @returns Observable<PhotosModel> model with deserialized photo values
   */
  getPhotos(): Observable<PhotosModel> {
    const url = `${baseApiUrl}${endpointPhotos}`;
    const mapVotesHash = (acc, curr) => {
      const obj = acc || {};
      obj[curr.id] = curr.votes;
      return obj;
    };
    const genPhotoObservable = hash => {
      // now with the
      return this.http.get<PhotosModel>(url).map((model: PhotosModel) => {
        // save computed votes hash
        model.message.votesHash = hash;

        return new PhotosModel().deserialize(model);
      });
    };

    return (
      // retrieve votes before getting photos
      this.getVotes()
        // gen observable for each VotItemModel
        .flatMap((model: VotesModel): VoteItemModel[] => model.message)
        // accumulate votes hash
        .scan((acc, curr) => mapVotesHash(acc, curr))
        // emit final hash
        .last()
        // pass along votes hash for use in  photos observable
        .mergeMap(hash => genPhotoObservable(hash))
    );
  }
}
