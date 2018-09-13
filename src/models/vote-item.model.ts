import { Deserializable } from '../interfaces/deserializeable.interface';

export class VoteItemModel implements Deserializable {
  id: string;
  votes: number;
  voted: boolean = false;

  deserialize(input: any): this {
    Object.assign(this, input);

    return this;
  }
}
