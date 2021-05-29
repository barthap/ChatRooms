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

interface MessageWithContent extends IMessageBase {
  type: typeof MessageType.MESSAGE;
  sender: IUser;
}

export interface IFileMessage extends MessageWithContent {
  url: string;
}
export interface ITextMessage extends MessageWithContent {
  content: string;
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
  return msg?.type === MessageType.MESSAGE && (msg as any).content;
}

export function isFileMessage(msg?: IMessage): msg is IFileMessage {
  return msg?.type === MessageType.MESSAGE && (msg as any).url;
}

export type IMessage = ITextMessage | IFileMessage | IUserJoinedMessage | IUserLeftMessage;
