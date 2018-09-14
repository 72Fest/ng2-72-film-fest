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
import { VoteModel } from '../../models/vote.model';
import { AppPreferences } from '@ionic-native/app-preferences';

const baseApiUrl = 'https://api.72fest.com/api';
const endpointCountdown = '/countDown';
const endpointNews = '/news';
const endpointTeams = '/teams';
const endpointPhotos = '/photos';
const endpointVote = '/vote';
const endpointVotes = '/votes';

/*
  Generated class for the DataManagerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataManagerProvider {
  public CONSTANTS = {
    APP_DICT_KEY: '72FestVotesDict'
  };

  private photoBuffer: PhotoBuffer;

  constructor(public http: HttpClient, private appPreferences: AppPreferences) {}

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
   * A helper function that retrieves state from app preferences and updates the vote items
   * @param votes VoteItemModel[] array of votes
   * @returns Observable<VoteItemModel> emits votes array an element at a time
   */
  private _getVoteStates(votes: VoteItemModel[]): Observable<VoteItemModel> {
    const checkPrefs = (vote: VoteItemModel): Promise<VoteItemModel[]> => {
      return this.appPreferences
        .fetch(this.CONSTANTS.APP_DICT_KEY, vote.id)
        .then(results => {
          // if vote state is found, update state in vote model
          vote.voted = results ? true : false;

          return votes;
        })
        .catch(err => {
          // ignore errors
          return Promise.resolve(votes);
        });
    };

    // retrieve all local vote states
    const prom = votes.reduce((prevPromise: Promise<any>, curVote: VoteItemModel) => {
      return prevPromise.then(() => {
        return checkPrefs(curVote);
      });
    }, Promise.resolve());

    return Observable.fromPromise(prom).flatMap(result => Observable.from(result));
  }

  /**
   * Retrieve list of current vote values for photos
   * @returns Observable<VoteItemModel> model with deserialized values for votes
   */
  getVotes(): Observable<VoteItemModel> {
    const url = `${baseApiUrl}${endpointVotes}`;
    const processVoteStates = (model: VotesModel): Observable<VoteItemModel> => {
      const newModel = new VotesModel().deserialize(model);

      return this._getVoteStates(newModel.message);
    };

    return this.http.get<VotesModel>(url).flatMap((model: VotesModel) => processVoteStates(model));
  }

  /**
   * Updates vote for a given photo id
   * @param photoId string unique id of photo
   * @param isLiked boolean vote status
   */
  castVote(photoId: string, isLiked: boolean): Observable<VoteModel> {
    const url = `${baseApiUrl}${endpointVote}`;
    const postData = {
      id: photoId,
      unlike: !isLiked
    };
    let preferencesPromise = null;

    // given the vote status, either store or remove an element from
    // app preferences
    preferencesPromise = isLiked
      ? this.appPreferences.store(this.CONSTANTS.APP_DICT_KEY, photoId, isLiked)
      : this.appPreferences.remove(this.CONSTANTS.APP_DICT_KEY, photoId);

    // handle callbacks from promise
    preferencesPromise = preferencesPromise.then(results => results).catch(err => {
      // we are ignoring failure for testing on desktop
      // maybe this isn't smart?
      console.log('app preference error', err);
      return Promise.resolve();
    });

    // create post request observable to vote
    const voteResponse$: Observable<VoteModel> = this.http
      .post(url, postData)
      .map((model: VoteModel) => new VoteModel().deserialize(model));

    // update the app preferences and then return the vote
    return <Observable<VoteModel>>Observable.fromPromise(preferencesPromise)
      .ignoreElements()
      .concat(voteResponse$);
  }

  /**
   * Retrieve an incremental list of photos, the observable is update when fetchPhotos() is called
   * @returns Observable<PhotoItemModel[]> and array chunk of photo items
   */
  pollPhotos(): Observable<PhotoItemModel[]> {
    if (this.photoBuffer) {
      this.photoBuffer.fetchNext();

      return this.photoBuffer.observable;
    } else {
      return <Observable<PhotoItemModel[]>>Observable.create(observer => {
        const photos$ = this._getPhotos().subscribe((model: PhotosModel) => {
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

  /**
   * Cleanly terminates existing variables to re init the photo buffer
   */
  refreshPhotos() {
    // TODO: perform better cleanup
    this.photoBuffer.destroy();
    this.photoBuffer = null;
  }

  /**
   * Trigger observable called from `pollPhotos()` to retrieve the next chunk of photos
   * @returns
   */
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
  private _getPhotos(): Observable<PhotosModel> {
    const url = `${baseApiUrl}${endpointPhotos}`;
    const mapVotesHash = (acc, curr: VoteItemModel) => {
      const obj = acc || {};
      obj[curr.id] = curr;
      return obj;
    };
    const genPhotoObservable = hash => {
      return this.http.get<PhotosModel>(url).map((model: PhotosModel) => {
        // save computed votes hash
        model.message.votesHash = hash;

        return new PhotosModel().deserialize(model);
      });
    };

    return (
      // retrieve votes before getting photos
      this.getVotes()
        // accumulate votes hash
        .scan((acc, curr) => mapVotesHash(acc, curr))
        // emit final hash
        .last()
        // pass along votes hash for use in photos observable
        .mergeMap(hash => genPhotoObservable(hash))
    );
  }
}
