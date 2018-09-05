import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CountdownModel } from '../../models/countdown.model';
import { Observable } from 'rxjs/Observable';

const baseApiUrl = 'https://api.72fest.com/api';
const endpointCountdown = '/countDown';

/*
  Generated class for the DataManagerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataManagerProvider {

  constructor(public http: HttpClient) {
    console.log('Hello DataManagerProvider Provider');
  }

  /**
   * Retrieve current countdown value from api endpoint
   * @returns Observable<CountdownModel> model
   */
  getCountdown(): Observable<CountdownModel> {
    const countdownUrl = `${baseApiUrl}${endpointCountdown}`;

    return this.http.get<CountdownModel>(countdownUrl);
  }
}
