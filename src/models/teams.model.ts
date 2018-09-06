import { TeamItemModel } from "./team-item.model";
import { Deserializable } from "../interfaces/deserializeable.interface";

export class TeamsModel implements Deserializable {
  isSuccess: boolean;
  message: TeamItemModel[];

  deserialize(input: any): this {
    Object.assign(this, input);
    const teams = new Array<TeamItemModel>();

    // deserialize team models
    if (input.message && Array.isArray(input.message)) {
      input.message.forEach((curTeamItem: TeamItemModel) => {
        teams.push(new TeamItemModel().deserialize(curTeamItem));
      });
    }

    this.message = teams;

    return this;
  }
}
