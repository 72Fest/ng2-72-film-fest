import { NewsItemModel } from "./news-item.model";
import { Deserializable } from "../interfaces/deserializeable.interface";

export class NewsModel implements Deserializable {
  isSuccess: boolean;
  message: NewsItemModel[];

  deserialize(input: any): this {
    Object.assign(this, input);
    const news = new Array<NewsItemModel>();

    // deserialize team models
    if (input.message && Array.isArray(input.message)) {
      input.message.forEach((curNewsItem: NewsItemModel) => {
        news.push(new NewsItemModel().deserialize(curNewsItem));
      });
    }

    this.message = news;

    return this;
  }
}
