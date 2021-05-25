import { io, Socket } from 'socket.io-client';

import { WEBSOCKET_URL } from './constants';
import { EventHandler } from './eventListener';
import { IMessage, ITextMessage } from './message';
import { IRoom } from './room';
import { IUser } from './user';

interface ConstructorOptions {
  authUser?: IUser | null;
  namespace?: string;
}

export class ChatSocketManager {
  private readonly socket: Socket;
  private _sid: string | null = null;

  readonly onConnectHandlers = new EventHandler<[sid: string]>();
  readonly onDisconnectHandlers = new EventHandler();
  readonly onChatMessageHandlers = new EventHandler<[msg: IMessage]>();
  readonly onConnectionErrorHandlers = new EventHandler<[err: Error]>();
  readonly onCurrentRoomChangedHandlers = new EventHandler<[room: IRoom]>();
  readonly onRoomListChangedHandlers = new EventHandler<[rooms: IRoom[]]>();
  readonly onUserListChangedHandlers = new EventHandler<[users: IUser[]]>();

  constructor({ authUser, namespace = '/chat' }: ConstructorOptions = {}) {
    const socket = io(`${WEBSOCKET_URL}${namespace}`, {
      autoConnect: false,
      extraHeaders: {
        'x-user-id': authUser?.id ?? '',
      },
    });
    socket.on('connect', () => {
      console.log('Connected to /chat with sid', socket.id);
      this._sid = socket.id;

      this.onConnectHandlers.notify(socket.id);
    });
    socket.on('disconnect', () => {
      this._sid = null;
      console.log('Disconnected');
      this.onDisconnectHandlers.notify();
    });
    socket.on('connect_error', err => {
      if (err instanceof Error) {
        this.onConnectionErrorHandlers.notify(err);
      } else {
        console.error(err);
      }
    });

    socket.on('chat_message', (msg: IMessage) => {
      console.log('Received message:', msg);
      this.onChatMessageHandlers.notify(msg);
    });

    socket.on('current_room_changed', (room: IRoom) => {
      this.onCurrentRoomChangedHandlers.notify(room);
    });

    socket.on('room_list_changed', rooms => {
      this.onRoomListChangedHandlers.notify(rooms);
    });

    socket.on('user_list_changed', users => {
      this.onUserListChangedHandlers.notify(users);
    });

    this.socket = socket;
  }

  connect() {
    console.debug('Connecting...');
    this.socket.connect();
  }

  disconnect() {
    console.debug('Disconnecting...');
    this.socket.disconnect();
  }

  /**
   * Sends a text message to the chat in the current room
   * @param msg IMessage object with `content` field
   */
  sendMessage(msg: Pick<ITextMessage, 'content'>) {
    this.socket.emit('send_message', msg);
  }

  /**
   * Request server to switch rooms for the current user
   * @param newRoomId ID of the room to join
   */
  switchRoom(newRoomId: IRoom['id']) {
    console.log('Switching room to', newRoomId);
    this.socket.emit('switch_room', { room_id: newRoomId });
  }

  get socketIo(): Socket {
    return this.socket;
  }
  get sid(): string | null {
    return this._sid;
  }

  /**
   * Removes all listeners for all socket events
   */
  clearAllEventHandlers() {
    this.onChatMessageHandlers.removeAllListeners();
    this.onConnectHandlers.removeAllListeners();
    this.onConnectionErrorHandlers.removeAllListeners();
    this.onDisconnectHandlers.removeAllListeners();
    this.onCurrentRoomChangedHandlers.removeAllListeners();
    this.onRoomListChangedHandlers.removeAllListeners();
    this.onUserListChangedHandlers.removeAllListeners();
  }
}
