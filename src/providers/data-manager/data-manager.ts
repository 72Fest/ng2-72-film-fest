import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CountdownModel } from '../../models/countdown.model';
import { Observable } from 'rxjs/Observable';
import { NewsModel } from '../../models/news.model';
import { NewsItemModel } from '../../models/news-item.model';
import { markdown } from 'markdown';

const baseApiUrl = 'https://api.72fest.com/api';
const endpointCountdown = '/countDown';
const endpointNews = '/news';

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
    const updateMarkdownLinks = (nodes) => {
      const nodeType = nodes[0];
      let nodeData;

      if (nodeType === 'link') {
        nodeData = nodes[1];
        //if we found a link node, add an onclick to
        //open the system browser
        nodeData.class = 'ex-link';
        nodeData['onclick'] = 'window.open(\'' + nodeData.href + '\', \'_system\', \'location=yes\')';
        nodeData.href = '';
      } else {
        nodes.forEach(function (curNode) {
          if (Array.isArray(curNode)) {
            updateMarkdownLinks(curNode);
          }
        });
      }

      return nodes;
    }
    const processMd = (content) => {
      let tree = markdown.parse(content);
      tree = updateMarkdownLinks(tree);

      return markdown.renderJsonML(markdown.toHTMLTree(tree));
    }

    return this.http.get<NewsModel>(url)
      .map((model: NewsModel) => {
        // process markdown to html for all items
        model.message.map((curNewsItem: NewsItemModel) => {
          // convert markdown to HTML
          curNewsItem.content = processMd(curNewsItem.content);

          return curNewsItem;
        });

        return model;
      });
  }
}
