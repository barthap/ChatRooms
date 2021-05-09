import { IUser } from './user';

export interface IMessage {
  id: string;
  content: string;
  sender: IUser;
}
