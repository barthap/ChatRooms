import { io, Socket } from 'socket.io-client';

import { WEBSOCKET_URL } from './constants';
import { EventHandler } from './eventListener';
import { IMessage } from './message';
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

  sendMessage(msg: Omit<IMessage, 'sender' | 'id'>) {
    this.socket.emit('send_message', msg);
  }

  get socketIo(): Socket {
    return this.socket;
  }
  get sid(): string | null {
    return this._sid;
  }

  clearAllEventHandlers() {
    this.onChatMessageHandlers.removeAllListeners();
    this.onConnectHandlers.removeAllListeners();
    this.onConnectionErrorHandlers.removeAllListeners();
    this.onDisconnectHandlers.removeAllListeners();
  }
}
