import { TeamItemFilmsModel } from "./team-item-films.model";
import { Deserializable } from "../interfaces/deserializeable.interface";

export class TeamItemModel implements Deserializable {
  _id: string;
  teamName: string;
  bio: string;
  logo: string;
  logoThumb: string;
  films: TeamItemFilmsModel[];

  deserialize(input: any): this {
    Object.assign(this, input);
    let films = new Array<TeamItemFilmsModel>();

    // deserialize films
    if (input.films && Array.isArray(input.films)) {
      input.films.forEach((curFilmItem: TeamItemFilmsModel) => {
        films.push(new TeamItemFilmsModel().deserialize(curFilmItem));
      });

      // descendant sort of films by year
      films.sort((filmA: TeamItemFilmsModel, filmB: TeamItemFilmsModel) => {
        if (filmA.year >= filmB.year) {
          return -1;
        }

        if (filmA.year < filmB.year) {
          return 1;
        }

        return 0;
      });
    }

    // add thumb url if logo is defined
    if (input.logo) {
      this.logoThumb = input.logo.replace(/\.([a-z]{3})$/, '-thumb.$1');
    }

    this.films = films;

    return this;
  }
}
