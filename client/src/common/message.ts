import { IUser } from './user';

export enum MessageType {
  MESSAGE,
  USER_JOINED,
  USER_LEFT,
}

interface IMessageBase {
  id: string;
  type: MessageType;
  timestamp: number;
}

export interface ITextMessage extends IMessageBase {
  type: typeof MessageType.MESSAGE;
  content: string;
  sender: IUser;
}

interface IUserJoinedMessage extends IMessageBase {
  type: typeof MessageType.USER_JOINED;
  user: IUser;
}

interface IUserLeftMessage extends IMessageBase {
  type: typeof MessageType.USER_LEFT;
  user: IUser;
}

export function isTextMessage(msg?: IMessage): msg is ITextMessage {
  return msg?.type === MessageType.MESSAGE;
}

export type IMessage = ITextMessage | IUserJoinedMessage | IUserLeftMessage;
