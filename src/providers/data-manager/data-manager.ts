import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CountdownModel } from '../../models/countdown.model';
import { Observable } from 'rxjs/Observable';
import { NewsModel } from '../../models/news.model';
import { TeamsModel } from '../../models/teams.model';

const baseApiUrl = 'https://api.72fest.com/api';
const endpointCountdown = '/countDown';
const endpointNews = '/news';
const endpointTeams = '/teams';

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

  /**
   * Retrieve list of news, render the markdown and update the URLs
   * @returns Observable<NewsModel> model with rendered news
   */
  getNews(): Observable<NewsModel> {
    const url = `${baseApiUrl}${endpointNews}`;

    return this.http.get<NewsModel>(url)
      .map((model: NewsModel) => new NewsModel().deserialize(model));
  }

  /**
   * Retrieve list of teams and update thumbnail URLs
   * @returns Observable<TeamsModel> model with deserialized values
   */
  getTeams(): Observable<TeamsModel> {
    const url = `${baseApiUrl}${endpointTeams}`;

    return this.http.get<TeamsModel>(url)
      .map((model: TeamsModel) => new TeamsModel().deserialize(model));
  }
}
