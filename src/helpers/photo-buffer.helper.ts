import { PhotosModel } from '../models/photos.model';
import { PhotoItemModel } from '../models/photo-item.model';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';

const BUFFER_CHUNKS = 5;

export class PhotoBuffer {
  // initialized values
  private _bufferedPhotos: PhotoItemModel[] = [];
  private _photoChunks: PhotoItemModel[][] = [];

  // instance variables
  private _photos$: Observable<PhotoItemModel[]>;
  private _photosSubscription: Subscription;
  private _subject$: BehaviorSubject<PhotoItemModel[]>;
  private _subjectResults$: Observable<PhotoItemModel[]>;

  get observable(): Observable<PhotoItemModel[]> {
    return this._subjectResults$;
  }

  constructor(photosModel: PhotosModel) {
    this.initModel(photosModel);
  }

  initModel(model: PhotosModel) {
    // configure subject
    this._subject$ = new BehaviorSubject([]);
    this._subjectResults$ = this._subject$.scan(
      (finalChunk: PhotoItemModel[], curChunk: PhotoItemModel[]) => {
        // once we receive an undefined item, we should stop concating
        if (!curChunk) {
          return undefined;
        }

        // merge both arrays together
        return <PhotoItemModel[]>finalChunk.concat(curChunk);
      }
    );

    // chunk photos
    this._photos$ = Observable.of(model)
      .flatMap(model => model.message.photos)
      .bufferCount(BUFFER_CHUNKS)
      .do((curChunk: PhotoItemModel[]) => {
        // store photo chunks for later on demand use
        this._photoChunks.push(curChunk);
      });

    this._photosSubscription = this._photos$.last().subscribe(finalVal => {
      // emit the first photo chunk to the subject
      const chunk = this._photoChunks.shift();
      if (chunk) {
        this._bufferedPhotos.concat(chunk);
      }
      this._subject$.next(chunk);

      // we no long need this subscription
      //this._photosSubscription.unsubscribe();
    });
  }

  subscribe(callback: (m: PhotoItemModel[]) => void): Subscription {
    return this._subjectResults$.subscribe(callback);
  }

  fetchNext() {
    const nextChunk: PhotoItemModel[] = this._photoChunks.shift();

    if (nextChunk) {
      this._bufferedPhotos.concat(nextChunk);
    }
    this._subject$.next(nextChunk);

    return this._subjectResults$.toPromise();
  }

  destroy() {
    this._bufferedPhotos = [];
    if (this._photosSubscription) {
      this._photosSubscription.unsubscribe();
    }
  }
}
