import { Deserializable } from '../interfaces/deserializeable.interface';

export class PhotoMetadataModel implements Deserializable {
  defaultTeamLogo: string;
  logosPath: string;
  logos: string;

  deserialize(input: any): this {
    Object.assign(this, input);

    return this;
  }
}
