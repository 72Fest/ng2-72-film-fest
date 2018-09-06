import { TeamItemFilmsModel } from "./team-item-films.model";

export class TeamItemModel {
  _id: string;
  teamName: string;
  bio: string;
  logo: string;
  films: TeamItemFilmsModel[];
}
