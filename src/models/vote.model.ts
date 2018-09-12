import { Deserializable } from '../interfaces/deserializeable.interface';
import { VoteItemModel } from './vote-item.model';

export class VoteModel implements Deserializable {
  isSuccess: boolean;
  message: VoteItemModel;

  deserialize(input: any): this {
    Object.assign(this, input);

    // deserialize vote result
    this.message = new VoteItemModel().deserialize(this.message);

    return this;
  }
}
