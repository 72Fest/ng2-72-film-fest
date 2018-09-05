import { TimestampModel } from "./timestamp.model";

export class CountdownMessageModel {
  _id: string;
  caption: string;
  time: TimestampModel;
}
