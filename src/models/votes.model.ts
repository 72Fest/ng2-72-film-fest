import { Deserializable } from '../interfaces/deserializeable.interface';
import { VoteItemModel } from './vote-item.model';

export class VotesModel implements Deserializable {
  isSuccess: boolean;
  message: VoteItemModel[];

  deserialize(input: any): this {
    Object.assign(this, input);

    const votes: VoteItemModel[] = new Array<VoteItemModel>();

    // deserialize vote results
    if (input.message && Array.isArray(input.message)) {
      input.message.forEach((curVote: VoteItemModel) => {
        votes.push(new VoteItemModel().deserialize(curVote));
      });
    }

    this.message = votes;

    return this;
  }
}
