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
    const films = new Array<TeamItemFilmsModel>();

    // deserialize films
    if (input.films && Array.isArray(input.films)) {
      input.films.forEach((curFilmItem: TeamItemFilmsModel) => {
        films.push(new TeamItemFilmsModel().deserialize(curFilmItem));
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
