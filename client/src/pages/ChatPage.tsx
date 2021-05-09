import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Sidebar,
  Avatar,
  ConversationHeader,
  VoiceCallButton,
  VideoCallButton,
  InfoButton,
  ExpansionPanel,
  TypingIndicator,
  MessageSeparator,
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';

import ApiComponent from '../components/ApiComponent';
import ConversationSidebar from '../components/ConversationSidebar';
import { useAuth } from '../others/auth';
import { groupAvatarUrl2, userAvatarUrl } from '../others/avatars';
import { WEBSOCKET_URL } from '../others/constants';
import { IUser } from '../others/user';

interface IMessage {
  sender_sid: string;
  content: string;
  sender: IUser;
}

function renderMessages(messages: IMessage[], sender?: IUser | null) {
  const count = messages.length;
  return messages.map((msg, idx, arr) => {
    const isFirst = idx === 0;
    const isLast = idx === count - 1;

    const prev = isFirst ? undefined : arr[idx - 1];
    const next = isLast ? undefined : arr[idx + 1];

    const isUserFirst = isFirst || msg.sender.id !== prev?.sender.id;
    const isUserLast = isLast || msg.sender.id !== next?.sender.id;

    const isSelf = msg.sender.id === sender?.id;

    return renderMessage(idx, msg, isSelf, isUserFirst, isUserLast);
  });
}

function renderMessage(
  key: string | number,
  msg: IMessage,
  isSelf: boolean,
  isUserFirst: boolean,
  isUserLast: boolean
) {
  const shouldRenderAvatar = !isSelf && isUserFirst;
  const avatarUrl = userAvatarUrl(msg.sender_sid);

  const position =
    isUserFirst && isUserLast ? 'single' : isUserFirst ? 'first' : isUserLast ? 'last' : 'normal';

  return (
    <Message
      key={key}
      model={{
        message: msg.content,
        sentTime: '15 mins ago',
        sender: msg.sender_sid,
        direction: isSelf ? 'outgoing' : 'incoming',
        position,
      }}
      avatarSpacer={!isUserFirst && !isSelf}>
      {isUserFirst && <Message.Header sender={msg.sender.name} />}
      {shouldRenderAvatar && <Avatar src={avatarUrl} name="Zoe" />}
    </Message>
  );
}

export default function ChatPage() {
  const [sid, setSid] = useState<string | null>(null);

  const [socket, setSocket] = useState<Socket | undefined>();

  const [messages, setMessages] = useState<IMessage[]>([]);

  console.count('Render');

  const auth = useAuth();
  const history = useHistory();

  React.useEffect(() => {
    console.countReset('Render');

    const socket = io(`${WEBSOCKET_URL}/chat`, {
      autoConnect: false,
      extraHeaders: {
        'x-user-id': auth?.user?.id ?? '',
      },
    });
    socket.on('connect', () => {
      console.log('Connected to /chat with sid', socket.id);
      setSid(socket.id);
    });
    socket.on('disconnect', () => {
      console.log('Disconnected');
    });
    socket.on('connect_error', err => {
      if (err instanceof Error) {
        if (err.message === 'invalid_user_id') {
          console.warn('User ID is invalid, redirecting to login');
          history.push('/login');
        }
      } else {
        console.warn(err);
      }
    });

    socket.on('chat_message', (msg: IMessage) => {
      console.log('Received message:', msg);
      setMessages(oldMsgs => [...oldMsgs, msg]);
    });

    socket.connect();

    setSocket(socket);

    return () => {
      setSid(null);
      setSocket(undefined);
      socket?.disconnect();
      console.log('Disconnecting from socket...');
    };
  }, []);

  const sendMessage = (text: string) => {
    socket?.emit('send_message', { content: text });
  };

  return (
    <div
      style={{
        height: '600px',
        position: 'relative',
      }}>
      <MainContainer responsive>
        <ConversationSidebar />
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Back />
            <Avatar src={groupAvatarUrl2('Default Room')} name="Zoe" />
            <ConversationHeader.Content userName="Default Room" info="Active 0 mins ago" />
            <ConversationHeader.Actions>
              <VoiceCallButton />
              <VideoCallButton />
              <InfoButton />
            </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList typingIndicator={<TypingIndicator content="Nobody is typing" />}>
            <MessageSeparator content="Your conversation starts here." />

            {renderMessages(messages, auth?.user)}
          </MessageList>
          <MessageInput placeholder="Type message here" onSend={sendMessage} />
        </ChatContainer>

        <Sidebar position="right">
          <ExpansionPanel open title="INFO">
            <p>Hello World</p>
          </ExpansionPanel>
          <ExpansionPanel open title="DEBUG INFO">
            <ApiComponent />
            <p>Your SID: {sid}</p>
            <p>Your username: {auth?.user?.name}</p>
            <p>Your user ID: {auth?.user?.id}</p>
          </ExpansionPanel>
          <ExpansionPanel title="OPTIONS">
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
          </ExpansionPanel>
        </Sidebar>
      </MainContainer>
    </div>
  );
}
