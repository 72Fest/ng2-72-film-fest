import { Deserializable } from "../interfaces/deserializeable.interface";

export class TeamItemFilmsModel implements Deserializable {
  title: string;
  year: number;
  url: string;

  deserialize(input: any): this {
    Object.assign(this, input);

    return this;
  }
}
